import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

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
      console.log("Próba pobrania adresu IP ESP32...");
      const res = await fetch('http://esp32.local/getIP');
      const ip = await res.text();
      console.log("Pobrane IP:", ip);
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
      console.log(`Wysyłanie żądania do: http://${esp32IP}/sensor`);
      const res = await fetch(`http://${esp32IP}/sensor`);
      const text = await res.text();
      console.log("Odpowiedź z ESP32:", text);

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
    <View style={styles.container}>
      <Text style={styles.title}>Dane z czujników</Text>
      <Button title="Odczytaj dane" onPress={fetchSensorData} color="#007AFF" />

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
