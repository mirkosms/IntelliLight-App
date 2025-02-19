import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function AutoBrightnessControl({ esp32IP }) {
  const [autoBrightnessEnabled, setAutoBrightnessEnabled] = useState(false);
  const [lightLevel, setLightLevel] = useState(null);

  useEffect(() => {
    fetchAutoBrightnessStatus();
    fetchLightSensorData();
    const interval = setInterval(fetchLightSensorData, 5000); // Odświeżanie co 5 sekund
    return () => clearInterval(interval); // Czyszczenie interwału przy odmontowaniu komponentu
  }, []);

  const fetchAutoBrightnessStatus = async () => {
    try {
      const res = await fetch(`http://${esp32IP}/toggle/autobrightness`);
      const status = await res.text();
      setAutoBrightnessEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Błąd pobierania statusu automatycznej jasności:", error);
    }
  };

  const toggleAutoBrightness = async () => {
    try {
      const res = await fetch(`http://${esp32IP}/toggle/autobrightness`);
      const status = await res.text();
      setAutoBrightnessEnabled(status.includes("ON"));
    } catch (error) {
      console.error("Błąd przełączania trybu automatycznej jasności:", error);
    }
  };

  const fetchLightSensorData = async () => {
    try {
      const res = await fetch(`http://${esp32IP}/sensor`);
      const data = await res.text();
      console.log("Dane z czujnika:", data);

      // Nowe wyrażenie regularne, pasujące do formatu zwracanego przez ESP32
      const match = data.match(/Natężenie światła:\s*([\d.]+)\s*lx/);
      if (match) {
        setLightLevel(parseFloat(match[1]));
      } else {
        setLightLevel(null);
      }
    } catch (error) {
      console.error("Błąd pobierania danych z czujnika światła:", error);
      setLightLevel(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Automatyczna Jasność</Text>
      <Switch value={autoBrightnessEnabled} onValueChange={toggleAutoBrightness} />
      <Text style={styles.lightLevel}>
        Natężenie światła: {lightLevel !== null ? `${lightLevel.toFixed(2)} lx` : "Brak danych"}
      </Text>
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
  lightLevel: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});
