import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Switch } from 'react-native';

export default function MenuScreen({ navigation }) {
  const [esp32IP, setEsp32IP] = useState(null);
  const [motionTimeout, setMotionTimeout] = useState('60'); // Domyślnie 60s
  const [motionEnabled, setMotionEnabled] = useState(false);

  useEffect(() => {
    fetchESP32IP();
    fetchMotionStatus();
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch(`http://esp32.local/getIP`);
      const ip = await res.text();
      setEsp32IP(ip);
    } catch (error) {
      console.error("Błąd pobierania IP ESP32:", error);
    }
  };

  const fetchMotionStatus = async () => {
    if (!esp32IP) return;
    try {
      const res = await fetch(`http://${esp32IP}/toggleMotionMode`);
      const status = await res.text();
      setMotionEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Błąd pobierania statusu czujnika ruchu:", error);
    }
  };

  const toggleMotionMode = async () => {
    if (!esp32IP) return;
    try {
      const res = await fetch(`http://${esp32IP}/toggleMotionMode`);
      const status = await res.text();
      setMotionEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Błąd przełączania czujnika ruchu:", error);
    }
  };

  const updateMotionTimeout = async () => {
    if (!esp32IP) return;
    try {
      await fetch(`http://${esp32IP}/setMotionTimeout?seconds=${motionTimeout}`);
      alert(`Zmieniono czas bezczynności na ${motionTimeout} sekund`);
    } catch (error) {
      console.error("Błąd ustawiania czasu bezczynności:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz opcję:</Text>
      
      <Button title="Simple LED" onPress={() => navigation.navigate('Simple LED')} />
      <View style={styles.spacer} />
      <Button title="Pomodoro Timer" onPress={() => navigation.navigate('Pomodoro Timer')} />
      <View style={styles.spacer} />
      <Button title="Data from Sensors" onPress={() => navigation.navigate('Data from Sensors')} />
      <View style={styles.spacer} />
      <Button title="Custom LED Color" onPress={() => navigation.navigate('Custom LED')} />
      <View style={styles.spacer} />
      <Button title="Palette LED Color" onPress={() => navigation.navigate('Palette LED')} />

      <View style={styles.separator} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Czujnik ruchu</Text>
        <Switch value={motionEnabled} onValueChange={toggleMotionMode} />
      </View>

      <Text>Podaj czas bezczynności (sekundy):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={motionTimeout}
        onChangeText={setMotionTimeout}
      />
      <Button title="Zapisz czas bezczynności" onPress={updateMotionTimeout} color="#007AFF" />
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
