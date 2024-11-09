import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  //const weather = "https://api.weather.gov/alerts/active?area=OK";
  const [status, setStatus] = useState<string | null>(null); 

  useEffect(() => {
    fetch('https://api.weather.gov/alerts/active?area=OK')
      .then(res => {
        console.log("Got here");
        if (res.ok) {
          setStatus("pinged the thing");
        } else {
          setStatus("failed to ping the thing");
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        setStatus("Fetch failed"); // Handle network errors
      });
  }, []);

  return (
    <View style={styles.container}>
      {status ? (
        <Text style={styles.title}>{status}</Text>
      ) : (
        <Text style={styles.title}>Loading...</Text>
      )}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.title}>Taburmom Two</Text>
  //     <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
  //     <EditScreenInfo path="app/(tabs)/two.tsx" />
  //   </View>
  // );
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
