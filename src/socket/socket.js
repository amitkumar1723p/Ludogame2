// import { Alert } from 'react-native';
// import { io } from 'socket.io-client';

// // ✅ Replace this with your actual local IP or deployed server URL
// let SOCKET_SERVER_URL = 'http://10.129.83.12:3000'; //  default production





// // 🔌 Connect to server
// // const socket = io(SOCKET_SERVER_URL, {
// //   transports: ['websocket'],
// //   reconnectionAttempts: 3,
// //   timeout: 5000,

// // });

// const socket = io(SOCKET_SERVER_URL, {
//   transports: ['websocket'],
//   reconnection: true,
//   reconnectionAttempts: 10,
//   reconnectionDelay: 2000, // 2 sec
//   timeout: 10000,
// });


// // ✅ Check if connected successfully
// socket.on('connect', () => {
//   Alert.alert('🟢 Socket connected:', socket.id);
// });

// // ❌ Handle connection errors
// socket.on('connect_error', (err) => {
//    console.log(err ,"Soket Error")
//   Alert.alert('🔴 Socket connection error:', err.message);
// });


//  socket.on ('error',(err  )=>{
//       console.log(err ,"Soket Error")
//   Alert.alert('🔴 Socket connection error:', err.message);

//  } ),


// // 🔌 Disconnected
// socket.on('disconnect', (reason) => {
//  Alert.alert('⚠️ Socket disconnected:', reason);
// });

// export default socket;





import { Alert } from "react-native";
import { io } from "socket.io-client";
import { useSelector } from 'react-redux';
let socket = null; // initially null
const SOCKET_SERVER_URL = "http://10.0.2.2:3000"; // apna backend IP

// ✅ Function to connect socket
export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket; // already connected
  }




  socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
    timeout: 10000,
  });

 

 

 socket.on ('error',(err  )=>{
      console.log(err ,"Soket Error")
  Alert.alert('🔴 Socket connection error:', err.message);

 } ),

  socket.on("reconnect", (attemptNumber) => {



 
    Alert.alert(" Reconnected after attempts:", attemptNumber);

 
  })
  // 🔴 Disconnected
  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    Alert.alert("⚠️ Disconnected", reason);
  });

  return socket;
};

// ✅ Export socket instance getter
export const getSocket = () => socket;
// export default socket;


