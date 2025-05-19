

import {View, Text, Pressable} from 'react-native';
import {Provider} from 'react-redux';
import React from 'react';
import Navigation from './src/navigation/Navigation';
// Only import react-native-gesture-handler on native platforms
import 'react-native-gesture-handler';
// import {persistor, store} from './src/redux/reducers/store';
import {persistor, store} from './src/redux/reducers/store';
import {PersistGate} from 'redux-persist/integration/react';
import "./global.css"
const App = () => {
  return (
  <View className="flex-1 items-center justify-center bg-white">
      {/* ✅ Green Text */}
      <Text className="text-green-600 text-xl mb-4">This is green text</Text>

      {/* ✅ Green Background Button */}
      <Pressable className="bg-green-500 px-4 py-2 rounded">
        <Text className="text-white font-bold">Click Me</Text>
      </Pressable>

      {/* ✅ Green Border Box */}
      <View className="mt-6 border border-green-600 p-4 rounded">
        <Text className="text-green-700">Box with green border</Text>
      </View>
    </View>
    
      // <Provider store={store}>`
      //   <PersistGate loading={null} persistor={persistor}>
      //     <Navigation />
      //   </PersistGate>

    
      // </Provider>
    
  );
};

export default App;
