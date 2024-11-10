import { StyleSheet, View, Text, Button, Platform, PermissionsAndroid, Linking } from "react-native";
import * as Location from 'expo-location';
import { WeatherProvider } from '@/context/GetData';
import React from 'react';
import {TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useWeather } from '@/context/GetData';
import {ImageBackground} from 'react-native';

export default function TabOneScreen() {
  const { setOrigin, setErrorMsg, watching, setWatching, setArea, area } = useWeather();

  useEffect(() => {
    //sendLocalNotification();
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
    console.log(watching)
  }, [watching]);

  return (
    <WeatherProvider>
    <ImageBackground
      source={require('./assets/HomeBackground.png')} // Path to your PNG image
      style={styles.background}
    >
    
      <Text style={styles.title}>Sky Watch</Text>
      {watching ? <Text style={styles.active}>Active</Text> : <Text style={styles.inactive}>Inactive</Text>}
      <View style={styles.separator}/>

      <Text style={styles.infoParagraph}>
      {watching ? 'We will now notify you when you are inside of a Severe Level storm warning area and help you find the nearest shelter.' : 'In an unfamiliar place with storms in the area? Let us guide you to local shelters in the area in an event of a warning!'}
      </Text>
      <View style={styles.separator}/>
    {watching && <Text style={styles.infoParagraph2}>Leave this app running in the background, we will take care of the rest!</Text>}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: watching ? '#ffd700' : '#007bff' }]}
        onPress={()=>setWatching(!watching)}
      >
       
        <Text style={styles.buttonText}>{watching ? 'And Now Our Watch Begins' : 'Start Your Watch'}</Text>
      </TouchableOpacity>
    </ImageBackground>
    </WeatherProvider>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1, // Make the background cover the entire screen
    justifyContent: 'center', // Align the content
    alignItems: 'center', // Align the content
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  infoParagraph:{
    color: 'white',
    fontSize: 28,
    textAlign: 'center',
    padding: 20,
  },
  infoParagraph2:{
    fontSize: 24,
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'white'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 200,
    color: 'white',
    opacity: 1,
  },
  active:{
    color: 'green',
    fontSize: 30,
  },
  inactive:{
    color: 'yellow',
    fontSize: 30,
  }
});
