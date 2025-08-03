import { Alert } from 'react-native';
import { io } from 'socket.io-client';

// ✅ Replace this with your actual local IP or deployed server URL
let SOCKET_SERVER_URL = 'http://10.210.224.12:3000'; //  default production


// if (__DEV__) {
//   import('react-native-network-info').then(({ NetworkInfo }) => {
//     NetworkInfo.getIPV4Address().then(ip => {
//        console.log(ip ,"ip")
//       SOCKET_SERVER_URL = `http://${ip}:3000`;
//       console.log("Dev Mode Socket URL:", SOCKET_SERVER_URL);
//     });
//   });
// }

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
