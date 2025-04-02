import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BrightnessControl from '../components/BrightnessControl';
import AutoBrightnessControl from '../components/AutoBrightnessControl';
import AppButton from '../components/AppButton';
import { GlobalStyles } from '../GlobalStyles';

export default function PomodoroScreen() {
  const [esp32IP, setEsp32IP] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchESP32IP();
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch('http://esp32.local/getIP');
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
    <View style={GlobalStyles.screenContainer}>
      <Text style={GlobalStyles.heading1}>Timer Pomodoro</Text>
      
      <AppButton title="Rozpocznij sesję skupienia (30 min)" onPress={() => sendPomodoroRequest("focus")} style={{ backgroundColor: '#34C759' }} />
      <AppButton title="Rozpocznij przerwę (5 min)" onPress={() => sendPomodoroRequest("break")} variant="primary" style={{ backgroundColor: '#FF3B30' }} />
      <AppButton title="Resetuj timer" onPress={() => sendPomodoroRequest("reset")} variant="primary" style={{ backgroundColor: '#8E8E93' }} />

      {esp32IP && <BrightnessControl esp32IP={esp32IP} />}
      {esp32IP && <AutoBrightnessControl esp32IP={esp32IP} />}
      
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  status: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
