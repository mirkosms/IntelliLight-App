import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import BrightnessControl from '../components/BrightnessControl';
import AutoBrightnessControl from '../components/AutoBrightnessControl';

export default function SimpleLEDScreen() {
  const [esp32IP, setEsp32IP] = useState(null);
  const [activeEffect, setActiveEffect] = useState(null);
  const [activeWhiteEffect, setActiveWhiteEffect] = useState(null);
  const [status, setStatus] = useState('');
  const [showWhiteOptions, setShowWhiteOptions] = useState(false);

  useEffect(() => {
    fetchESP32IP();
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

  const sendRequestToESP32 = async (endpoint, effect, isWhite = false) => {
    try {
      const res = await fetch(`http://${esp32IP}/${endpoint}`);
      const text = await res.text();
      setStatus(text);
  
      if (isWhite) {
        setActiveWhiteEffect(prevEffect => (prevEffect === effect ? null : effect));
        setActiveEffect(null); // Wyłącz inne efekty
      } else {
        setActiveEffect(prevEffect => (prevEffect === effect ? null : effect));
        setActiveWhiteEffect(null); // Wyłącz efekt White Temperature
      }
    } catch (error) {
      setStatus('Błąd połączenia: ' + error.message);
    }
  };
 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sterowanie ESP32 przez Wi-Fi</Text>

      <Button title="LED (Niebieski)" 
        color={activeEffect === 'led' ? '#007AFF' : '#CCCCCC'} 
        onPress={() => sendRequestToESP32('toggle/led', 'led')} 
      />
      <View style={styles.spacer} />
      <Button title="Efekt Rainbow" 
        color={activeEffect === 'rainbow' ? '#007AFF' : '#CCCCCC'} 
        onPress={() => sendRequestToESP32('toggle/rainbow', 'rainbow')} 
      />
      <View style={styles.spacer} />
      <Button title="Efekt Pulsing" 
        color={activeEffect === 'pulsing' ? '#007AFF' : '#CCCCCC'} 
        onPress={() => sendRequestToESP32('toggle/pulsing', 'pulsing')} 
      />
      <View style={styles.spacer} />
      <Button title="Night Mode" 
        color={activeEffect === 'night' ? '#007AFF' : '#CCCCCC'} 
        onPress={() => sendRequestToESP32('toggle/night', 'night')} 
      />
      <View style={styles.spacer} />
      <Button title="Twinkle" 
        color={activeEffect === 'twinkle' ? '#007AFF' : '#CCCCCC'} 
        onPress={() => sendRequestToESP32('toggle/twinkle', 'twinkle')} 
      />
      <View style={styles.spacer} />

      <Button 
        title="White Temperature" 
        onPress={() => setShowWhiteOptions(!showWhiteOptions)} 
        color={showWhiteOptions ? "#FFA500" : "#CCCCCC"} 
      />
      {showWhiteOptions && (
        <View>
          <Button 
            title="Neutral White" 
            color={activeWhiteEffect === 'neutral' ? '#007AFF' : '#CCCCCC'} 
            onPress={() => sendRequestToESP32('toggle/white/neutral', 'neutral', true)} 
            />
            <View style={styles.spacer} />
            <Button 
            title="Cool White" 
            color={activeWhiteEffect === 'cool' ? '#007AFF' : '#CCCCCC'} 
            onPress={() => sendRequestToESP32('toggle/white/cool', 'cool', true)} 
            />
            <View style={styles.spacer} />
            <Button 
            title="Warm White" 
            color={activeWhiteEffect === 'warm' ? '#007AFF' : '#CCCCCC'} 
            onPress={() => sendRequestToESP32('toggle/white/warm', 'warm', true)} 
            />

        </View>
      )}

      {esp32IP && <BrightnessControl esp32IP={esp32IP} />}
      {esp32IP && <AutoBrightnessControl esp32IP={esp32IP} />}  
      
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
