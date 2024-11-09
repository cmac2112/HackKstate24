import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, PermissionsAndroid } from "react-native";
import MapView, { Marker } from "react-native-maps";
import EditScreenInfo from '@/components/EditScreenInfo';
import * as Location from 'expo-location';

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
  return (
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
      <EditScreenInfo path="app/(tabs)/three.tsx" />
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
});

export default three;