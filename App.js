import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MenuScreen from './screens/MenuScreen';
import SimpleLEDScreen from './screens/SimpleLEDScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import SensorScreen from './screens/SensorScreen';
import CustomLEDScreen from './screens/CustomLEDScreen';

const Stack = createStackNavigator();

export default function App() {
  const [esp32IP, setEsp32IP] = useState(null);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen name="Menu">
            {(props) => <MenuScreen {...props} esp32IP={esp32IP} />}
          </Stack.Screen>
          <Stack.Screen name="Simple LED" component={SimpleLEDScreen} />
          <Stack.Screen name="Pomodoro Timer" component={PomodoroScreen} />
          <Stack.Screen name="Data from Sensors" component={SensorScreen} />
          <Stack.Screen name="Custom LED" options={{ title: 'Custom LED Color' }}>
            {(props) => <CustomLEDScreen {...props} esp32IP={esp32IP} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
