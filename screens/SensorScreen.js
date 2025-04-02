// SensorScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from '../components/AppButton';
import { GlobalStyles } from '../GlobalStyles';

export default function SensorScreen() {
  const [esp32IP, setEsp32IP] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [lightLevel, setLightLevel] = useState(null);
  const [status, setStatus] = useState('Ładowanie...');

  useEffect(() => {
    fetchESP32IP();
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch('http://esp32.local/getIP');
      const ip = await res.text();
      setEsp32IP(ip);
      setStatus('');
    } catch (error) {
      console.error("Błąd pobierania IP ESP32:", error);
      setStatus('Brak adresu ESP32');
    }
  };

  const fetchSensorData = async () => {
    if (!esp32IP) {
      setStatus('Brak adresu ESP32');
      return;
    }

    try {
      const res = await fetch(`http://${esp32IP}/sensor`);
      const text = await res.text();
      const matches = text.match(/Temperatura:\s*([\d.]+)\s*°C\s*Wilgotność:\s*([\d.]+)\s*%\s*Natężenie światła:\s*([\d.]+)\s*lx/);
      if (matches) {
        setTemperature(parseFloat(matches[1]));
        setHumidity(parseFloat(matches[2]));
        setLightLevel(parseFloat(matches[3]));
        setStatus('');
      } else {
        setStatus('Błąd parsowania danych z czujników');
      }
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
      setStatus('Błąd pobierania danych');
    }
  };

  return (
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.heading1}>Dane z czujników</Text>
      <AppButton title="Odczytaj dane" onPress={fetchSensorData} />

      {temperature !== null && humidity !== null && lightLevel !== null && (
        <View style={styles.sensorData}>
          <Text style={styles.dataLabel}>Temperatura:</Text>
          <Text style={styles.dataValue}>{temperature.toFixed(1)} °C</Text>
          <Text style={styles.dataLabel}>Wilgotność:</Text>
          <Text style={styles.dataValue}>{humidity.toFixed(1)} %</Text>
          <Text style={styles.dataLabel}>Natężenie światła:</Text>
          <Text style={styles.dataValue}>{lightLevel.toFixed(2)} lx</Text>
        </View>
      )}

      {status !== '' && <Text style={styles.status}>{status}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sensorData: {
    marginTop: 20,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
