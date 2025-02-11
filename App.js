import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [activeEffect, setActiveEffect] = useState(null);
  const [whiteTempMode, setWhiteTempMode] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [showWhiteOptions, setShowWhiteOptions] = useState(false);
  const [status, setStatus] = useState('');

  const sendRequestToESP32 = async (endpoint, isWhiteTemp = false, tempMode = '') => {
    try {
      const res = await fetch(`http://192.168.1.10/${endpoint}`);
      const text = await res.text();
      setStatus(text);

      if (endpoint === 'sensor') {
        const data = JSON.parse(text);
        setTemperature(data.temperature);
        setHumidity(data.humidity);
      } else {
        if (isWhiteTemp) {
          setWhiteTempMode(prevMode => (prevMode === tempMode ? null : tempMode));
        } else {
          setActiveEffect(prevEffect => (prevEffect === endpoint.split('/')[1] ? null : endpoint.split('/')[1]));
          setWhiteTempMode(null);  // Resetowanie trybu White Temperature przy wyborze innego efektu
        }
      }
    } catch (error) {
      setStatus('Błąd połączenia: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sterowanie ESP32 przez Wi-Fi</Text>

      <Button title="LED (Niebieski)" color={activeEffect === 'led' ? '#007AFF' : '#CCCCCC'} onPress={() => sendRequestToESP32('toggle/led')} />
      <View style={styles.spacer} />
      <Button title="Efekt Rainbow" color={activeEffect === 'rainbow' ? '#007AFF' : '#CCCCCC'} onPress={() => sendRequestToESP32('toggle/rainbow')} />
      <View style={styles.spacer} />
      <Button title="Efekt Pulsing" color={activeEffect === 'pulsing' ? '#007AFF' : '#CCCCCC'} onPress={() => sendRequestToESP32('toggle/pulsing')} />
      <View style={styles.spacer} />
      <Button title="Night Mode" color={activeEffect === 'night' ? '#007AFF' : '#CCCCCC'} onPress={() => sendRequestToESP32('toggle/night')} />
      <View style={styles.spacer} />
      <Button title="Twinkle" color={activeEffect === 'twinkle' ? '#007AFF' : '#CCCCCC'} onPress={() => sendRequestToESP32('toggle/twinkle')} />
      <View style={styles.spacer} />

      <Button
        title="White Temperature"
        onPress={() => setShowWhiteOptions(!showWhiteOptions)}
        color={showWhiteOptions ? '#FFA500' : '#CCCCCC'}
      />

      {showWhiteOptions && (
        <View>
          <Button
            title="Neutral White"
            color={whiteTempMode === 'neutral' ? '#007AFF' : '#CCCCCC'}
            onPress={() => sendRequestToESP32('toggle/white/neutral', true, 'neutral')}
          />
          <View style={styles.spacer} />
          <Button
            title="Cool White"
            color={whiteTempMode === 'cool' ? '#007AFF' : '#CCCCCC'}
            onPress={() => sendRequestToESP32('toggle/white/cool', true, 'cool')}
          />
          <View style={styles.spacer} />
          <Button
            title="Warm White"
            color={whiteTempMode === 'warm' ? '#007AFF' : '#CCCCCC'}
            onPress={() => sendRequestToESP32('toggle/white/warm', true, 'warm')}
          />
        </View>
      )}

      <View style={styles.spacer} />
      <Button title="Odczytaj dane z czujników" onPress={() => sendRequestToESP32('sensor')} color="#007AFF" />

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
