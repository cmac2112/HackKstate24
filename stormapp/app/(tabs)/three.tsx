import React, {useState, useEffect} from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
//import { Notifications } from "react-native-notifications";
import { NavigationContainer } from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';
import * as Notifications from 'expo-notifications'
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
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


const three = () => {
    
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
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
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
            />
          ))}
      </MapView>
      <Button title="sent notification" onPress={sendLocalNotification} />
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  map: {
    width: "100%",
    height: 400,
  },
});

export default three;