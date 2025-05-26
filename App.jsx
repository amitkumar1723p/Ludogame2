import {View, Text, Pressable} from 'react-native';
import {Provider} from 'react-redux';
import React, { useEffect } from 'react';
import './global.css';
import Navigation from './src/navigation/Navigation';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
// import {persistor, store} from './src/redux/reducers/store';
import {persistor, store} from './src/redux/reducers/store';
import {PersistGate} from 'redux-persist/integration/react';
 
const App = () => {
  useEffect(() => {
  console.log("✅ Hello from App");
  console.warn("⚠️ Warning test");
  console.error("❌ Error test");
}, []);
useEffect(() => {
  throw new Error("🔥 Test JS Runtime Error!");
}, []);
useEffect(() => {
  Promise.reject("💥 Test Promise Rejection");
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
 

