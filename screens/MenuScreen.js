import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { GlobalStyles } from '../GlobalStyles';
import AppButton from '../components/AppButton';

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
    <View style={GlobalStyles.screenContainer}>
      <Text style={styles.welcomeText}>Witaj w aplikacji IntelliLight!</Text>
      <Text style={GlobalStyles.heading1}>Wybierz opcję:</Text>
      
      <AppButton 
        title="Sterowanie LED" 
        onPress={() => navigation.navigate('LED Control')} 
        style={[styles.mainButton, { backgroundColor: '#FFCC00' }]}
        textStyle={{ color: '#000', fontSize: 20 }}
      />
      <AppButton 
        title="Timer Pomodoro" 
        onPress={() => navigation.navigate('Pomodoro Timer')} 
        style={[styles.mainButton, { backgroundColor: '#FFCC00' }]}
        textStyle={{ color: '#000', fontSize: 20 }}
      />
      <AppButton 
        title="Dane z czujników" 
        onPress={() => navigation.navigate('Data from Sensors')} 
        style={[styles.mainButton, { backgroundColor: '#FFCC00' }]}
        textStyle={{ color: '#000', fontSize: 20 }}
      />

      <View style={styles.separator} />

      <View style={styles.switchContainer}>
        <Text style={GlobalStyles.heading2}>Czujnik ruchu</Text>
        <Switch value={motionEnabled} onValueChange={toggleMotionMode} />
      </View>

      <Text style={styles.label}>Czas bezczynności (sekundy):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={motionTimeout}
        onChangeText={setMotionTimeout}
      />
      <AppButton title="Ustaw czas wyłączenia" onPress={updateMotionTimeout} />
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 15,
  },
  mainButton: {
    width: '80%',
    marginVertical: 10,
    paddingVertical: 15,
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
    color: '#333',
    marginBottom: 5,
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
