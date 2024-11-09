import React from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import EditScreenInfo from '@/components/EditScreenInfo';

const three = () => {
  return (
    <View style={styles.container}>
    
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825, // Replace with your latitude
          longitude: -122.4324, // Replace with your longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 37.78825, // Replace with your latitude
            longitude: -122.4324, // Replace with your longitude
          }}
          title={"My Location"}
          description={"This is where I am"}
        />
      </MapView>
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