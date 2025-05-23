import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import BrightnessControl from '../components/BrightnessControl';
import AutoBrightnessControl from '../components/AutoBrightnessControl';
import AppButton from '../components/AppButton';
import { GlobalStyles } from '../GlobalStyles';
import * as Progress from 'react-native-progress';

export default function PomodoroScreen() {
  const [esp32IP, setEsp32IP] = useState(null);
  const [status, setStatus] = useState('');
  const [mode, setMode] = useState(null);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [showBrightness, setShowBrightness] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://esp32.local/getIP');
        const ip = await res.text();
        setEsp32IP(ip);
      } catch {
        setStatus('Brak adresu ESP32');
      }
    })();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const sendPomodoroRequest = async (m) => {
    if (!esp32IP) {
      setStatus('Brak adresu ESP32');
      return;
    }

    if (m === 'focus') {
      setMode('focus');
      setTotal(30 * 60);
      setRemaining(30 * 60);
      setRunning(true);
    } else if (m === 'break') {
      setMode('break');
      setTotal(5 * 60);
      setRemaining(5 * 60);
      setRunning(true);
    } else {
      setMode(null);
      setRunning(false);
      setTotal(0);
      setRemaining(0);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`http://${esp32IP}/pomodoro?mode=${m}`, { signal: controller.signal });
      clearTimeout(timeout);
      const text = await res.text();
      setStatus(text);
    } catch (error) {
      setStatus('Błąd połączenia: ' + error.message);
    }
  };

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <Image
        source={require('../assets/pomodoroTimer.png')}
        style={styles.pomodoroLogo}
        resizeMode="contain"
      />

      <Text style={GlobalStyles.heading1}>Timer Pomodoro</Text>
      
      <AppButton 
        title="Rozpocznij sesję skupienia" 
        onPress={() => sendPomodoroRequest("focus")} 
        style={{ backgroundColor: '#34C759', marginVertical: 5 }}
      />
      <AppButton 
        title="Rozpocznij przerwę" 
        onPress={() => sendPomodoroRequest("break")} 
        style={{ backgroundColor: '#FF3B30', marginVertical: 5 }}
      />
      <AppButton 
        title="Resetuj timer" 
        onPress={() => sendPomodoroRequest("reset")} 
        style={{ backgroundColor: '#8E8E93', marginVertical: 5 }}
      />

      { total > 0 && (
        <View style={styles.timerContainer}>
          <Progress.Circle
            size={150}
            progress={remaining / total}
            showsText
            formatText={() => formatTime(remaining)}
            textStyle={{ fontWeight: 'bold' }}
            thickness={8}
            color={mode === 'focus' ? '#34C759' : '#FF3B30'}
            unfilledColor="#EEE"
            borderWidth={0}
          />
        </View>
      )}

      <AppButton 
        title="Ustawienia jasności" 
        onPress={() => setShowBrightness(!showBrightness)}
        style={{ marginVertical: 10 }}
      />
      {showBrightness && (
        <View style={styles.brightnessContainer}>
          <BrightnessControl esp32IP={esp32IP} />
          <AutoBrightnessControl esp32IP={esp32IP} />
        </View>
      )}

      <Text style={styles.status}>{status}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  pomodoroLogo: {
    width: 200 * 2.5,
    height: 60 * 2.5,
    alignSelf: 'center',
    marginBottom: 15,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  brightnessContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});
