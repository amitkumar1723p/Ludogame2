import { Provider, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import Navigation from './src/navigation/Navigation';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
// import {persistor, store} from './src/redux/reducers/store';
import { persistor, store } from './src/redux/reducers/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Alert } from 'react-native';
import { getSocket } from './src/socket/socket';
import mobileAds from 'react-native-google-mobile-ads';
const App = () => {
  const state = store.getState(); // direct store ka access

  const { UserCurrentRoomData } = state.room || {};

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized');
      });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>
    </Provider>
  );
};

export default App;
