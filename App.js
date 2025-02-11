import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [activeEffect, setActiveEffect] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [status, setStatus] = useState('');

  const sendRequestToESP32 = async (endpoint) => {
    try {
      const res = await fetch(`http://192.168.1.10/${endpoint}`);
      
      if (endpoint === 'sensor') {
        const data = await res.json();
        setTemperature(data.temperature);
        setHumidity(data.humidity);
        setStatus('Dane z czujników odczytane!');
      } else {
        const text = await res.text();
        setStatus(text);
        setActiveEffect(prevEffect => (prevEffect === endpoint.split('/')[1] ? null : endpoint.split('/')[1]));
      }
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
        onPress={() => sendRequestToESP32('toggle/led')}
      />
      <View style={styles.spacer} />

      <Button
        title="Efekt Rainbow"
        color={activeEffect === 'rainbow' ? '#007AFF' : '#CCCCCC'}
        onPress={() => sendRequestToESP32('toggle/rainbow')}
      />
      <View style={styles.spacer} />

      <Button
        title="Efekt Pulsing"
        color={activeEffect === 'pulsing' ? '#007AFF' : '#CCCCCC'}
        onPress={() => sendRequestToESP32('toggle/pulsing')}
      />
      <View style={styles.spacer} />

      <Button
        title="Odczytaj dane z czujników"
        onPress={() => sendRequestToESP32('sensor')}
        color="#007AFF"
      />

      {temperature !== null && humidity !== null && (
        <View style={styles.sensorData}>
          <Text style={styles.dataLabel}>Temperatura:</Text>
          <Text style={styles.dataValue}>{temperature} °C</Text>

          <Text style={styles.dataLabel}>Wilgotność:</Text>
          <Text style={styles.dataValue}>{humidity} %</Text>
        </View>
      )}

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
  sensorData: {
    marginTop: 20,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  dataValue: {
    fontSize: 24,
    color: '#007AFF',
    marginBottom: 10,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
