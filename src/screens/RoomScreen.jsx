import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import socket from '../socket/socket';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigate } from '../helpers/NavigationUtil';
import { getRoomData, saveRoomData } from '../redux/reducers/storage';
import { resetGame } from '../redux/reducers/gameSlice';
import { useDispatch } from 'react-redux';

const RoomScreen = () => {
  const { roomId } = useRoute().params;
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

 const dispatch =useDispatch()

 

  useEffect(() => {
    // 🔁 App refresh hone ke baad roomId & playerId MMKV se fetch karke rejoin karo
    const tryRejoin = async () => {
      const { roomId: savedRoomId, playerId } = getRoomData();
      

      // ✅ Room ID match hona chahiye current screen se
      if (savedRoomId === roomId && playerId) {
        socket.emit('rejoin-room', { roomId: savedRoomId, playerId, playerName: 'Your Name' });

      }
    };

    tryRejoin(); // Call it once when component mounts

    // 🔄 Server se jab bhi room ka latest status aaye (player join/leave ya turn update),
    socket.on('roomUpdate', ({ players, roomId, currentTurn, maxPlayers }) => {
      // Table jaise formatted string banate hain
      let message = `
🧩 Room Info:

Room ID     : ${roomId}
Max Players : ${maxPlayers}
Current Turn: ${currentTurn}

👥 Players List:
${players.map((p, i) => `Player ${i + 1}: ${p.PlayerName} (${p.PlayerSocketId})`).join('\n')}

`;

      Alert.alert("🎯 Room Updated", message.trim());
      setPlayers(players);
    });

    // Jab game start hota hai
    socket.on('game-started', ({ players, roomId }) => {
      Alert.alert("🎮 Game Start Ho chuka hai");
       
      setPlayers(players);
      setGameStarted(true);


      // const { playerId } = getRoomData();
      // ✅ Get current socket ID
      const playerId = socket.id;

      

      // if (roomId && playerId) {
      //   saveRoomData(roomId, playerId); // Store again in case of new game
      // }
      // ✅ Directly store the data into MMKV
      saveRoomData(roomId, playerId);
      // Ab GameScreen par navigate karo
      navigateToGameScreen(players, roomId);
    });

    return () => {
      socket.off('roomUpdate');
      socket.off('game-started');
    };
  }, []);


  function navigateToGameScreen(players, roomId) {


    // let activePlayer =    players.map((_, index) => index + 1);
      let activePlayer = players.map((item) => item.position);
      
  //     dispatch(PlayActivePlayer({ PlayingActivePlayer: activePlayer, gameType: "Online" }))

    // React Navigation / Router se GameScreen pe jao
     
 
    dispatch(resetGame({ PlayerActive:activePlayer, gameType :"Online" }));
    navigate('LudoBoardScreen', { players, roomId });
  }

  // Host Start Game button click
  const handleStartGame = () => {
    socket.emit('start-game', { roomId });
   
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Room ID: {roomId}</Text>
      <Text>Players:</Text>
      {players.map((player, idx) => (
        <Text key={player.PlayerSocketId}>
    {`Player ${player.position}: ${player.PlayerName} ${player.host ? '(Host)' : ''}`}
  </Text>
      ))}
      <Button
        title="Start Game"
        onPress={handleStartGame}
        disabled={players.length < 2}
      />

    </View>
  );
};

export default RoomScreen;
