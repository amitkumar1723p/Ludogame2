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


const App = () => {
 const state = store.getState(); // direct store ka access
   
      const { UserCurrentRoomData } = state.room || {};
 
    // const socket = getSocket()
     
  // useEffect(() => {
  
  //   if(!socket) return ;
 
     
  //   socket.on("reconnect", (attemptNumber) => {
   

  


      
  //     // auto rejoin room
  //     if (UserCurrentRoomData) {
  //       socket.emit("rejoin-room", UserCurrentRoomData);
  //     }
  //   });
  //   return () => {
  //     ;
  //    socket?.off("reconnect");
  //   };
  // }, [])



  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation />

      </PersistGate>
    </Provider>


  );
};

export default App;
