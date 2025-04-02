import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert 
} from 'react-native';
import BrightnessControl from '../components/BrightnessControl';
import AutoBrightnessControl from '../components/AutoBrightnessControl';
import AppButton from '../components/AppButton';
import { GlobalStyles } from '../GlobalStyles';

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

export default function LEDControlScreen({ esp32IP, navigation }) {
  const [status, setStatus] = useState('');
  const [activeEffect, setActiveEffect] = useState(null);
  const [activeWhiteEffect, setActiveWhiteEffect] = useState(null);
  const [showWhiteOptions, setShowWhiteOptions] = useState(false);
  const [showContinuousOptions, setShowContinuousOptions] = useState(false);
  const [showBrightness, setShowBrightness] = useState(false);

  const activateContinuousEffect = (effect) => {
    setActiveEffect(effect);
    setActiveWhiteEffect(null);
    fetch(`http://${esp32IP}/toggle/${effect}`)
      .then(res => res.text())
      .then(text => setStatus(text))
      .catch(error => setStatus('Błąd połączenia: ' + error.message));
  };

  const deactivateContinuousEffect = (effect) => {
    fetch(`http://${esp32IP}/toggle/${effect}`)
      .then(res => res.text())
      .then(text => setStatus(text))
      .catch(error => setStatus('Błąd połączenia: ' + error.message));
    setActiveEffect(null);
  };

  const toggleWhiteMode = (mode) => {
    if (activeWhiteEffect === mode) {
      fetch(`http://${esp32IP}/toggle/white/${mode}`)
        .then(res => res.text())
        .then(text => setStatus(text))
        .catch(error => setStatus('Błąd połączenia: ' + error.message));
      setActiveWhiteEffect(null);
    } else {
      fetch(`http://${esp32IP}/toggle/white/${mode}`)
        .then(res => res.text())
        .then(text => setStatus(text))
        .catch(error => setStatus('Błąd połączenia: ' + error.message));
      setActiveWhiteEffect(mode);
      setActiveEffect(null);
    }
  };

  const choosePaletteColor = async (r, g, b) => {
    if (!esp32IP) {
      Alert.alert("Błąd", "Brak adresu ESP32");
      return;
    }
    try {
      const res = await fetch(`http://${esp32IP}/setColor?r=${r}&g=${g}&b=${b}`);
      const text = await res.text();
      setStatus(text);
      setActiveEffect("palette");
      setActiveWhiteEffect(null);
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się ustawić koloru LED");
    }
  };

  const renderWhiteOptions = () => (
    <View style={styles.buttonGroup}>
      {["neutral", "cool", "warm"].map((mode) => (
        <TouchableOpacity
          key={mode}
          style={[
            styles.toggleButton,
            { backgroundColor: activeWhiteEffect === mode ? "#007AFF" : "#CCCCCC" }
          ]}
          onPress={() => toggleWhiteMode(mode)}
        >
          <Text style={styles.toggleButtonText}>
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContinuousOptions = () => (
    <View style={styles.buttonGroup}>
      {["rainbow", "pulsing", "twinkle", "night"].map((effect) => (
        <TouchableOpacity
          key={effect}
          style={[
            styles.toggleButton,
            { backgroundColor: activeEffect === effect ? "#007AFF" : "#CCCCCC" }
          ]}
          onPress={() => {
            if (activeEffect === effect) {
              deactivateContinuousEffect(effect);
            } else {
              activateContinuousEffect(effect);
            }
          }}
        >
          <Text style={styles.toggleButtonText}>
            {effect.charAt(0).toUpperCase() + effect.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={GlobalStyles.heading1}>Paleta kolorów</Text>
      <View style={styles.paletteContainer}>
        {PALETTE.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.swatch, { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }]}
            onPress={() => choosePaletteColor(color.r, color.g, color.b)}
          >
            <Text style={styles.swatchLabel}>{color.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.expandButton} 
        onPress={() => setShowWhiteOptions(!showWhiteOptions)}
      >
        <Text style={styles.expandButtonText}>Temperatura bieli</Text>
      </TouchableOpacity>
      {showWhiteOptions && renderWhiteOptions()}

      <TouchableOpacity 
        style={styles.expandButton} 
        onPress={() => setShowContinuousOptions(!showContinuousOptions)}
      >
        <Text style={styles.expandButtonText}>Efekty ciągłe</Text>
      </TouchableOpacity>
      {showContinuousOptions && renderContinuousOptions()}

      <AppButton 
        title="Niestandardowy kolor LED" 
        variant="secondary"
        onPress={() => navigation.navigate('Custom LED')}
        style={{ marginVertical: 10 }}
      />

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
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  paletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  swatch: {
    width: 90,
    height: 90,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  swatchLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  expandButton: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  expandButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  toggleButton: {
    width: '30%',
    paddingVertical: 10,
    marginVertical: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
