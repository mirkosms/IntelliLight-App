import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz opcję:</Text>
      <Button title="Simple LED" onPress={() => navigation.navigate('Simple LED')} />
      <View style={styles.spacer} />
      <Button title="Pomodoro Timer" onPress={() => navigation.navigate('Pomodoro Timer')} />
      <View style={styles.spacer} />
      <Button title="Data from Sensors" onPress={() => navigation.navigate('Data from Sensors')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spacer: {
    marginVertical: 10,
  },
});
