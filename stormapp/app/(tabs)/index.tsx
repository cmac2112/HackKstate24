import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const [buttonColor, setButtonColor] = useState('#007bff'); // Initial blue color
  const [infoText, setInfoText] = useState(
    'In an unfamiliar place with storms in the area? Let us guide you to local shelters in the area in an event of a warning!'
  );

  const [ButtonText, setButtonText] = useState(
  'Start The Watch');

  const handlePress = () => {
    setButtonColor((prevColor) => (prevColor === '#007bff' ? '#ffd700' : '#007bff'));
    setInfoText((prevText) => 
      prevText === 'In an unfamiliar place with storms in the area? Let us guide you to local shelters in the area in an event of a warning!' 
        ? 'We will notify you when you are inside of a storm warned area and help you find the nearest shelter.'
        : 'In an unfamiliar place with storms in the area? Let us guide you to local shelters in the area in an event of a warning!'
    );
  
    setButtonText((prevText) => 
      prevText === 'Start The Watch' 
        ? 'Our watch has begun' 
        : 'Start The Watch'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storm Watch</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="white" />

      <Text style={styles.infoParagraph}>
      {infoText}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonColor }]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{ButtonText}</Text>
      </TouchableOpacity>
    </View>
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
  infoParagraph:{
    fontSize: 18,
    textAlign: 'center',
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
});
