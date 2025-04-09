import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';

export default function BrightnessControl({ esp32IP }) {
  const [brightness, setBrightness] = useState(180);
  const [inputValue, setInputValue] = useState('180');

  useEffect(() => {
    fetchCurrentBrightness();
  }, []);

  const fetchCurrentBrightness = async () => {
    try {
      const res = await fetch(`http://${esp32IP}/brightness`);
      const value = await res.text();
      setBrightness(parseInt(value, 10));
      setInputValue(value);
    } catch (error) {
      console.error("Błąd pobierania jasności ESP32:", error);
    }
  };

  const updateBrightness = async (value) => {
    const newBrightness = Math.min(255, Math.max(0, parseInt(value, 10)));
    setBrightness(newBrightness);
    setInputValue(String(newBrightness));

    try {
      await fetch(`http://${esp32IP}/brightness?value=${newBrightness}`);
      Alert.alert("Jasność LED", `Jasność została ustawiona na: ${newBrightness}`);
    } catch (error) {
      console.error("Błąd ustawiania jasności:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Jasność LED: {brightness}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={255}
        step={1}
        value={brightness}
        onValueChange={(value) => {
          setBrightness(value);
          setInputValue(String(value));
        }}
        onSlidingComplete={(value) => updateBrightness(value)}
      />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={inputValue}
        onChangeText={(text) => setInputValue(text)}
        onSubmitEditing={() => updateBrightness(inputValue)}
      />
      <Button title="Ustaw jasność" onPress={() => updateBrightness(inputValue)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  input: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
});
