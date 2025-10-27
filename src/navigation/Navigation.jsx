import React from 'react';
import LudoBoardScreen from '../screens/LudoBoardScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
const Stack = createStackNavigator();
// export default Navigation;
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigate, navigationRef } from '../helpers/NavigationUtil';
import RoomScreen from '../screens/RoomScreen';
import { useDispatch, useSelector } from 'react-redux';

import InterstitialAdComponent from '../components/AddComponents/InterstitialAd';
import SoundPlayer from 'react-native-sound-player';
import { InterstitialAdShow } from '../redux/reducers/RoomSlice';
export default function Navigation() {
  const { showAdd, navigateScreen } = useSelector(state => {
    return state.room;
  });
  const dispatch = useDispatch();

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={() => ({
            headerShown: false
          })}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="LudoBoardScreen"
            component={LudoBoardScreen}
            screenOptions={() => ({
              headerShown: false
            })}
          />
          {console.log(showAdd, 'showAdd')}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="RoomScreen" component={RoomScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <InterstitialAdComponent
        showAd={showAdd}
        onAdClosed={() => {
          dispatch(InterstitialAdShow({ showAdd: false }));
          if (navigateScreen) {
            navigate('HomeScreen');
          }
        }}
      />
    </>
  );
}
