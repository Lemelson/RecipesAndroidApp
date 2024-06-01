import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import SignUp from './components/screens/Signup';
import Login from './components/screens/Login';

import {BigShouldersDisplay_400Regular, BigShouldersDisplay_900Black } from '@expo-google-fonts/big-shoulders-display';
import { useFonts, LibreFranklin_300Light, LibreFranklin_400Regular, LibreFranklin_800ExtraBold,LibreFranklin_600SemiBold,LibreFranklin_500Medium } from '@expo-google-fonts/libre-franklin';
import {  OpenSans_300Light, OpenSans_400Regular, OpenSans_700Bold, OpenSans_600SemiBold} from '@expo-google-fonts/open-sans';

import Home from './components/screens/Home';
import Detail from './components/screens/Detail';
import Inventory from './components/screens/Inventory';
import AddInventory from './components/screens/AddInventory';
import Tracking from './components/screens/Tracking';
import TrackingDetail from './components/screens/TrackingDetail';

export default function App() {
 
   let [fontsLoaded] = useFonts({
    BigShouldersDisplay_900Black,
    LibreFranklin_300Light,
    LibreFranklin_800ExtraBold,
    LibreFranklin_400Regular,
    LibreFranklin_600SemiBold,
    OpenSans_600SemiBold,
    LibreFranklin_500Medium,
    OpenSans_300Light,
    BigShouldersDisplay_400Regular

  });

  if (!fontsLoaded) {
    return null;
  }
  else
  {
    console.log('here with no issue')
  }

  
  const Stack = createStackNavigator();

  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="LoginScreen" component={Login} />

        <Stack.Screen name="SignUp" component={SignUp} />


        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Tracking" component={Tracking} />
        <Stack.Screen name="Inventory" component={Inventory} />  
        <Stack.Screen name="Detail" component={Detail} />
        <Stack.Screen name="AddNew" component={AddInventory} />
        <Stack.Screen name="TrackingDetail" component={TrackingDetail}/>
    

      </Stack.Navigator>
    </NavigationContainer>
         
      </PaperProvider>
  );
}



 