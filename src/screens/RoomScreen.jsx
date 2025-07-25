import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import socket from '../soket/socket';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigate } from '../helpers/NavigationUtil';

const RoomScreen = () => {
  const { roomId } = useRoute().params;
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    socket.on('roomUpdate', ({ players }) => {
      setPlayers(players);
    });

    // Jab game start hota hai
    socket.on('game-started', ({ players, roomId }) => {
      console.log('Game started with players:', players);
      setPlayers(players);
      setGameStarted(true);

      // Ab GameScreen par navigate karo
      navigateToGameScreen(players, roomId);
    });


    return () => {
      socket.off('roomUpdate');
      socket.off('game-started');
    };
  }, []);

// Example navigate function
function navigateToGameScreen(players, roomId) {
  
  // React Navigation / Router se GameScreen pe jao
  console.log("Navigating to Game Screen:", players, roomId);
      navigate('LudoBoardScreen' ,{players , roomId});
}

  // Host Start Game button click
  const handleStartGame = () => {
    socket.emit('start-game', { roomId }); 
    console.log('Start Game clicked, roomId:', roomId);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Room ID: {roomId}</Text>
      <Text>Players:</Text>
      {players.map((id, idx) => (
        <Text key={id}>Player {idx + 1}</Text>
      ))}
      <Button
        title="Start Game"
        onPress={ handleStartGame}
        disabled={players.length < 2}
      />
      
    </View>
  );
};

export default RoomScreen;
