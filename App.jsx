import {View, Text, Pressable} from 'react-native';
import {Provider} from 'react-redux';
import React from 'react';
import './global.css';
import Navigation from './src/navigation/Navigation';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
// import {persistor, store} from './src/redux/reducers/store';
import {persistor, store} from './src/redux/reducers/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  return (
   

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />
      </PersistGate>

    </Provider>
  );
};

export default App;
 

