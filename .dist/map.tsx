/*import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';

const MapScreen = () => {
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
  
  const [places, setPlaces] = useState<Place[]>([]);
  const origin = { latitude: 37.78825, longitude: -122.4324 }; // Replace with your origin coordinates
  const [destination, setDestination] = useState({ latitude: 37.7749, longitude: -122.4194 })
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
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  return (
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
            onPress={() => setDestination({
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng
            })}
          />
        ))}
      </MapView>
      <Button title="Open in Google Maps" onPress={openGoogleMaps} />
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
    height: 400
  },
});

export default MapScreen; */