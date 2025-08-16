import { Alert } from 'react-native';
import { io } from 'socket.io-client';

// ✅ Replace this with your actual local IP or deployed server URL
let SOCKET_SERVER_URL = 'http://10.206.203.12:3000'; //  default production

   

  

// 🔌 Connect to server
const socket = io(SOCKET_SERVER_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 3,
  timeout: 5000,
});

// ✅ Check if connected successfully
socket.on('connect', () => {
  Alert.alert('🟢 Socket connected:', socket.id);
});

// ❌ Handle connection errors
socket.on('connect_error', (err) => {
   console.log(err ,"Soket Error")
  Alert.alert('🔴 Socket connection error:', err.message);
});


 socket.on ('error',(err  )=>{
      console.log(err ,"Soket Error")
  Alert.alert('🔴 Socket connection error:', err.message);

 } ),


// 🔌 Disconnected
socket.on('disconnect', (reason) => {
 Alert.alert('⚠️ Socket disconnected:', reason);
});

export default socket;
