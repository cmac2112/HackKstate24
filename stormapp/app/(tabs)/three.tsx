import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, PermissionsAndroid, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
//import { Notifications } from "react-native-notifications";
import { NavigationContainer } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
import axios from 'axios';

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


const three = () => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

        setLat(location.coords.latitude);
        setLon(location.coords.longitude);
      } catch (error) {
        console.error("Error getting location permission or fetching location:", error);
        
      }
    };

    requestLocationPermission();
  }, []);
  console.log(lat)
  console.log(lon)
    
    const [places, setPlaces] = useState<Place[]>([])
    const origin = { latitude: 37.78825, longitude: -122.4324 }; // Replace with your origin coordinates
  const destination = { latitude: 37.7749, longitude: -100.4194 };

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
        title: "Local Notification",
        body: "This is a local notification",
        sound: "default",
      },
      trigger: null, // Immediately trigger the notification
    });
  };
  return (
    <NavigationContainer independent={true}>
    <View style={styles.container}>
      {lat !== null && lon !== null ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: lat,
            longitude: lon,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lon }}
            title={"My Location"}
            description={"This is where I am"}
          />
        </MapView>
      ) : (
        <Text>{errorMsg ? `Error: ${errorMsg}` : "Loading..."}</Text>
      )}
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
});

export default three;