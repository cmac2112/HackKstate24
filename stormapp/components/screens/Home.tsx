import * as React from 'react';
import { Button, View, Text } from 'react-native';

import { NavigationProp } from '@react-navigation/native';

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Map"
        onPress={() => navigation.navigate('Map')}
      />
    </View>
  );
}

export default HomeScreen;