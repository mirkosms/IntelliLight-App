import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function App() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [error, setError] = useState('');

  const fetchSensorData = async () => {
    try {
      const res = await fetch('http://192.168.1.10/sensor');
      const data = await res.json();
      setTemperature(data.temperature);
      setHumidity(data.humidity);
      setError('');
    } catch (err) {
      setError('Błąd połączenia: ' + err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Odczyt danych z ESP32</Text>
      <Button title="Pobierz dane" onPress={fetchSensorData} />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.dataContainer}>
          {temperature !== null && (
            <Text style={styles.dataText}>Temperatura: {temperature} °C</Text>
          )}
          {humidity !== null && (
            <Text style={styles.dataText}>Wilgotność: {humidity} %</Text>
          )}
        </View>
      )}
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
    fontSize: 20,
    marginBottom: 20,
  },
  dataContainer: {
    marginTop: 20,
  },
  dataText: {
    fontSize: 18,
    marginBottom: 10,
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
