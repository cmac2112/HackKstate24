import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, PermissionsAndroid, Button, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
//import { Notifications } from "react-native-notifications";
import { NavigationContainer } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location';
import axios from 'axios'


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });


  interface Place {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    name: string;
    vicinity: string;
  }


  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

const Map = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [destination, setDestination] = useState({ latitude: 37.7749, longitude: -122.4194 })
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0});
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "This app needs access to your location",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setErrorMsg("Location permission denied");
            return;
          }
        } else {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg("Location permission denied");
            return;
          }
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setOrigin({latitude: location.coords.latitude, longitude: location.coords.longitude});
      } catch (error) {
        console.error("Error getting location permission or fetching location:", error);
        
      }
    };

    requestLocationPermission();

    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&radius=5000&type=local_government_office&key=${GOOGLE_API_KEY}`
        );
        setPlaces(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();
  }, []);
  


  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${origin.latitude},${origin.longitude}&radius=5000&type=local_government_office&key=${GOOGLE_API_KEY}`
        );
        setPlaces(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaces();

    Notifications.requestPermissionsAsync()
  }, []);

  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Warning",
        body: "The NWS has issued a warning for your area",
        sound: "default",
      },
      trigger: null, // Immediately trigger the notification
    });
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };
  return (
    <NavigationContainer independent={true}>
    <View style={styles.container}>
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
          coordinate={origin}
          title={"Origin"}
          description={"This is the starting point"}
        />
        <Marker
          coordinate={destination}
          title={"Destination"}
          description={"This is the destination"}
        />
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />
        {places.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }}
            title={place.name}
            description={place.vicinity}
            onPress={() => setDestination({
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng
            })}
          />
        ))}
      </MapView>
      <Button title="Open in Google Maps" onPress={openGoogleMaps} />
    </View>
    </NavigationContainer>
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
  text:{
    color: "white",
    fontSize: 20
  }
});

export default Map;