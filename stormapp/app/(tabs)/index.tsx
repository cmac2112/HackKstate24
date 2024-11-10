import { StyleSheet, View, Text, Button, Platform, PermissionsAndroid, Linking } from "react-native";
import * as Location from 'expo-location';
import { WeatherProvider } from '@/context/GetData';
import EditScreenInfo from '@/components/EditScreenInfo';
import { useEffect } from 'react';
import { useWeather } from '@/context/GetData';

export default function TabOneScreen() {
  const { setOrigin, setErrorMsg } = useWeather();

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

        setOrigin({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
      } catch (error) {
        console.error("Error getting location permission or fetching location:", error);
        if (error instanceof Error) {
          setErrorMsg(error.message);
        } else {
          setErrorMsg("An unknown error occurred");
        }
      }
    };

    requestLocationPermission();
  }, []);
  return (
    <WeatherProvider>
    <View style={styles.container}>
      <Text style={styles.title}>Tab  testsrio</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
    </WeatherProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
