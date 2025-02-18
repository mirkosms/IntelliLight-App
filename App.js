import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MenuScreen from './screens/MenuScreen';
import SimpleLEDScreen from './screens/SimpleLEDScreen';
import PomodoroScreen from './screens/PomodoroScreen';
import SensorScreen from './screens/SensorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Simple LED" component={SimpleLEDScreen} />
          <Stack.Screen name="Pomodoro Timer" component={PomodoroScreen} />
          <Stack.Screen name="Data from Sensors" component={SensorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
