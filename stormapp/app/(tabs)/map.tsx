import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  Platform,
  PermissionsAndroid,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Notifications from "expo-notifications";
import MapViewDirections from "react-native-maps-directions";
import { useWeather } from "../../context/GetData";
import { ImageBackground } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

const MapScreen = () => {
  const {
    places,
    destination,
    setDestination,
    origin,
    errorMsg,
    setDemoPolygon,
    warning,
    setWarning,
  } = useWeather();

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {origin.latitude !== null &&
      origin.longitude !== null &&
      places.length > 0 ? (
        <>
          <Text style={styles.text}>
            Tap on a place to set it as your destination
          </Text>
          <Text style={styles.disclaimer}>
            These are possible shelter places in this area, ALWAYS use your best
            judement
          </Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: origin.latitude,
              longitude: origin.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: origin.latitude!,
                longitude: origin.longitude!,
              }}
              title={"Your Location"}
              pinColor="green"
            />
            {origin.latitude !== null &&
              origin.longitude !== null &&
              destination.latitude !== null &&
              destination.longitude !== null && (
                <MapViewDirections
                  origin={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                  }}
                  destination={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                  }}
                  apikey={GOOGLE_API_KEY}
                  strokeWidth={6}
                  strokeColor="hotpink"
                  onError={(errorMessage) => {
                    console.error("MapViewDirections Error:", errorMessage);
                  }}
                />
              )}
            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: place.geometry.location.lat,
                  longitude: place.geometry.location.lng,
                }}
                title={place.name}
                description={place.vicinity}
                onPress={() =>
                  setDestination({
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                  })
                }
              />
            ))}
          </MapView>
          {destination.latitude && (
            <Button title="Open in Google Maps" onPress={openGoogleMaps} />
          )}
          <Button
            title="Start demo"
            onPress={() => {
              const demoPolygon = [
                [-96.578, 39.188], // Bottom-left
                [-96.576, 39.188], // Bottom-right
                [-96.576, 39.19], // Top-right
                [-96.578, 39.19], // Top-left
                [-96.578, 39.188], // Closing the polygon
              ];
              setWarning(false); //remove this for demo if weird stuff starts happening
              setTimeout(() => {
                setDemoPolygon(demoPolygon);
              }, 1000);
            }}
          />
        </>
      ) : (
        <Text style={styles.text}>
          {errorMsg
            ? `Error: ${errorMsg}`
            : "Getting Location and nearby places..."}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: 400,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  disclaimer: {
    fontSize: 8,
    color: "yellow",
    textAlign: "center",
    padding: 5,
  },
});

export default MapScreen;
