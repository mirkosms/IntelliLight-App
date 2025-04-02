import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch } from 'react-native';

export default function MenuScreen({ navigation, esp32IP }) {
  const [motionTimeout, setMotionTimeout] = useState('60');
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    fetchESP32IP();
    fetchMotionStatus();
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch(`http://esp32.local/getIP`);
      const ip = await res.text();
      // IP jest przekazywane przez props w App.js
    } catch (error) {
      console.error("Error fetching ESP32 IP:", error);
    }
  };

  const fetchMotionStatus = async () => {
    if (!esp32IP) return;
    try {
      const res = await fetch(`http://${esp32IP}/toggleMotionMode`);
      const status = await res.text();
      setMotionEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Error fetching motion sensor status:", error);
    }
  };

  const toggleMotionMode = async () => {
    if (!esp32IP) return;
    try {
      const res = await fetch(`http://${esp32IP}/toggleMotionMode`);
      const status = await res.text();
      setMotionEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Error toggling motion sensor:", error);
    }
  };

  const updateMotionTimeout = async () => {
    if (!esp32IP) return;
    try {
      await fetch(`http://${esp32IP}/setMotionTimeout?seconds=${motionTimeout}`);
      alert(`Czas wyłączenia ustawiony na ${motionTimeout} sekund`);
    } catch (error) {
      console.error("Error updating motion timeout:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz opcję:</Text>
      
      <Button title="LED Control" onPress={() => navigation.navigate('LED Control')} />
      <View style={styles.spacer} />
      <Button title="Pomodoro Timer" onPress={() => navigation.navigate('Pomodoro Timer')} />
      <View style={styles.spacer} />
      <Button title="Data from Sensors" onPress={() => navigation.navigate('Data from Sensors')} />

      <View style={styles.separator} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Czujnik ruchu</Text>
        <Switch value={motionEnabled} onValueChange={toggleMotionMode} />
      </View>

      <Text>Ustaw czas wyłączenia (sekundy):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={motionTimeout}
        onChangeText={setMotionTimeout}
      />
      <Button title="Ustaw czas wyłączenia" onPress={updateMotionTimeout} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  spacer: {
    marginVertical: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: 'center',
    marginBottom: 10,
  },
});