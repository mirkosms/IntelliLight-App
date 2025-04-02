import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';

export default function CustomLEDScreen({ esp32IP, navigation }) {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(255);
  const [ip, setIP] = useState(esp32IP);

  useEffect(() => {
    if (!ip) {
      fetchESP32IP();
    }
  }, []);

  const fetchESP32IP = async () => {
    try {
      const res = await fetch(`http://esp32.local/getIP`);
      const ipAddress = await res.text();
      setIP(ipAddress);
    } catch (error) {
      console.error("Błąd pobierania IP ESP32:", error);
    }
  };

  const sendCustomColor = async () => {
    if (!ip) {
      Alert.alert("Błąd", "Brak adresu ESP32");
      return;
    }
    try {
      const url = `http://${ip}/setColor?r=${red}&g=${green}&b=${blue}`;
      const res = await fetch(url);
      const text = await res.text();
      Alert.alert("Sukces", text);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się ustawić koloru");
      console.error("Błąd przy ustawianiu koloru:", error);
    }
  };

  const previewColor = `rgb(${red}, ${green}, ${blue})`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz niestandardowy kolor LED</Text>
      
      <View style={[styles.preview, { backgroundColor: previewColor }]} />
      
      <Text style={styles.label}>Czerwony: {red}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={red}
        onValueChange={(value) => setRed(value)}
      />
      
      <Text style={styles.label}>Zielony: {green}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={green}
        onValueChange={(value) => setGreen(value)}
      />
      
      <Text style={styles.label}>Niebieski: {blue}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={blue}
        onValueChange={(value) => setBlue(value)}
      />
      
      <Button title="Ustaw kolor LED" onPress={sendCustomColor} />
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preview: {
    width: '100%',
    height: 100,
    marginBottom: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  spacer: {
    marginTop: 20,
  },
});
