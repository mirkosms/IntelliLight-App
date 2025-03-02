import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PALETTE = [
  { name: 'Red', r: 255, g: 0, b: 0 },
  { name: 'Green', r: 0, g: 255, b: 0 },
  { name: 'Blue', r: 0, g: 0, b: 255 },
  { name: 'Yellow', r: 255, g: 255, b: 0 },
  { name: 'Cyan', r: 0, g: 255, b: 255 },
  { name: 'Magenta', r: 255, g: 0, b: 255 },
  { name: 'White', r: 255, g: 255, b: 255 },
  { name: 'Orange', r: 255, g: 165, b: 0 },
  { name: 'Purple', r: 128, g: 0, b: 128 }
];

export default function PaletteLEDScreen({ esp32IP }) {
  const setColor = async (r, g, b) => {
    if (!esp32IP) {
      Alert.alert("Error", "No ESP32 IP address");
      return;
    }
    try {
      const url = `http://${esp32IP}/setColor?r=${r}&g=${g}&b=${b}`;
      const res = await fetch(url);
      const text = await res.text();
      Alert.alert("Success", text);
    } catch (error) {
      Alert.alert("Error", "Failed to set LED color");
      console.error("Error setting color:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose LED Color</Text>
      <View style={styles.palette}>
        {PALETTE.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.swatch, { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }]}
            onPress={() => setColor(color.r, color.g, color.b)}
          >
            <Text style={styles.swatchLabel}>{color.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  swatch: {
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  swatchLabel: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
