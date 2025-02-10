import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [activeEffect, setActiveEffect] = useState(null);
  const [status, setStatus] = useState('');

  const sendRequestToESP32 = async (effect) => {
    try {
      const res = await fetch(`http://192.168.1.10/toggle/${effect}`);
      const text = await res.text();
      setStatus(text);

      setActiveEffect(prevEffect => (prevEffect === effect ? null : effect));
    } catch (error) {
      setStatus('Błąd połączenia: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sterowanie ESP32 przez Wi-Fi</Text>

      <Button
        title="LED (Niebieski)"
        color={activeEffect === 'led' ? '#007AFF' : '#CCCCCC'}
        onPress={() => sendRequestToESP32('led')}
      />
      <View style={styles.spacer} />

      <Button
        title="Efekt Rainbow"
        color={activeEffect === 'rainbow' ? '#007AFF' : '#CCCCCC'}
        onPress={() => sendRequestToESP32('rainbow')}
      />
      <View style={styles.spacer} />

      <Button
        title="Efekt Pulsing"
        color={activeEffect === 'pulsing' ? '#007AFF' : '#CCCCCC'}
        onPress={() => sendRequestToESP32('pulsing')}
      />

      <Text style={styles.status}>{status}</Text>
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
  status: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
