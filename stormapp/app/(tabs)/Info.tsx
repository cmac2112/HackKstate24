import { StyleSheet } from 'react-native';
import {ImageBackground, Image } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <ImageBackground
      source={require('./assets/storm.png')} // Path to your PNG image
      style={styles.background}
    >
    <View style={styles.overlay}>
      <Text style={styles.title}>About the App</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Text style={styles.infoParagraph}>
        The app monitors <Text style={{ fontWeight: 'bold' }}>severe weather</Text> in your area and alerts you if you're at risk,
        guiding you to the nearest shelter with clear, real-time directions. Stay prepared
        and safe with this app.
      </Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Text style = {styles.infoParagraph}>
      Leave the App running in the background to get notifications.
      </Text>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  infoParagraph:{
    fontSize: 28,
    textAlign: 'center',
  },
  background: {
    flex: 1, // Make the background cover the entire screen
    justifyContent: 'center', // Align the content
    alignItems: 'center', // Align the content
  },
});