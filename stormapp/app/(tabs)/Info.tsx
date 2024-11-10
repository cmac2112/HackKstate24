import { StyleSheet, ScrollView } from 'react-native';
import {ImageBackground, Image, Linking } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <ImageBackground
      source={require('./assets/storm.png')} // Path to your PNG image
      style={styles.background}
    >
      <ScrollView style={styles.scrollViewContent}>
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
      About our Team
      </Text>
      
        <Image source={require('../../assets/images/caden.jpg')} style={styles.img} />
        <Text style={styles.aboutme}>
        Caden McArthur
        </Text>
        <Text style={styles.aboutme}>
        CS @ Bethel College | NASA Space Apps Award Winner | President of Bethel Software Club | C/o 2025. 
        Experienced React developer with a demonstrated history of working in the computer software industry at EX Fortune 500 companies. Strong engineering professional with a Bachelor of Science - BS focused in Computer Science from Bethel College.
          </Text>
          <Text style={styles.link} onPress={() => Linking.openURL('https://www.linkedin.com/in/cadenmcarthur')}>
        Connect With Me On Linked In
      </Text>
        <Text style={styles.aboutme}>
          Micah Quinlin
        </Text>
        
        <Image source={require('../../assets/images/micah.jpg')} style={styles.img} />
        <Text style={styles.aboutme}>
        Hello, my name is Micah Quinlin and I am a software development major at Bethel College, with a minor in mathematics and psychology. I am graduating in december 2024 and am responsible for the frontend of Sky Watch.
        </Text>
    </View>
    </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  aboutme: {
    fontSize: 15,
    textAlign: 'center',
    paddingTop: 10,
  },
  img:{
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});