import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function PomodoroScreen() {
  const [esp32IP, setEsp32IP] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchESP32IP();
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch('http://esp32.local/getIP'); // Upewnij się, że ESP32 ma poprawny adres
      const ip = await res.text();
      setEsp32IP(ip);
    } catch (error) {
      console.error("Błąd pobierania IP ESP32:", error);
      setStatus('Brak adresu ESP32');
    }
  };

  const sendPomodoroRequest = async (mode) => {
    if (!esp32IP) {
        setStatus('Brak adresu ESP32');
        return;
    }

    const url = `http://${esp32IP}/pomodoro?mode=${mode}`;
    console.log("Wysyłam żądanie:", url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Anuluj po 5 sek

    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        const text = await res.text();
        console.log("Odpowiedź serwera:", text);
        setStatus(text);
    } catch (error) {
        console.error("Błąd połączenia:", error);
        setStatus('Błąd połączenia: ' + error.message);
    }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pomodoro Timer</Text>
      
      <Button title="Start Focus Session (25 min)" 
        color="#007AFF" 
        onPress={() => sendPomodoroRequest("focus")} 
      />
      <View style={styles.spacer} />
      
      <Button title="Start Break (5 min)" 
        color="#FF3B30" 
        onPress={() => sendPomodoroRequest("break")} 
      />
      <View style={styles.spacer} />

      <Button title="Reset Timer" 
        color="#8E8E93" 
        onPress={() => sendPomodoroRequest("reset")} 
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
