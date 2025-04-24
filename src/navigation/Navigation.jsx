import React from 'react';
import LudoBoardScreen from '../screens/LudoBoardScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
const Stack = createStackNavigator();
// export default Navigation;
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../helpers/NavigationUtil';

// import { navigationRef } from '../helpers/NavigationUtil';
export default function Navigation() {
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreen" 
         screenOptions={()=>({
          headerShown:false ,
         })}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="LudoBoardScreen"
            component={LudoBoardScreen}
            screenOptions={() => ({
              headerShown: false,
            })}
          />

          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
