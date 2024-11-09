import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About the App</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Text style ={styles.infoParagraph}>The app monitors severe weather in your area and alerts you if you're at risk, 
        guiding you to the nearest shelter with clear, real-time directions. Stay prepared 
        and safe with this app. </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
      <Text style = {styles.infoParagraph}>
      Leave the App running in the background to get notifications.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBoxContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute', // Position it at the top
    top: 50,              // Distance from the top of the screen
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
  infoParagraph:{
    fontSize: 18,
    textAlign: 'center',
  },
  box: {
    width: 1000,       // Adjust as needed
    height: 100,      // Adjust as needed
    backgroundColor: '#8c8787', // Dark grey color
    borderRadius: 10, // Optional: adds rounded corners

  },
});
