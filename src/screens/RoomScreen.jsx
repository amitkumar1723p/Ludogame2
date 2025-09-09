// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert } from 'react-native';
// import   { getSocket } from '../socket/socket';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { navigate } from '../helpers/NavigationUtil';
// import { getRoomData, saveRoomData } from '../redux/reducers/storage';
// import { resetGame } from '../redux/reducers/gameSlice';
// import { useDispatch } from 'react-redux';

// const RoomScreen = () => {

//   const { roomId } = useRoute().params;
//   const navigation = useNavigation();
//   const [players, setPlayers] = useState([]);
//   const [gameStarted, setGameStarted] = useState(false);

//  const dispatch =useDispatch()
//  const socket = getSocket()


//   useEffect(() => {
//     // 🔁 App refresh hone ke baad roomId & playerId MMKV se fetch karke rejoin karo
//     const tryRejoin = async () => {
//       const { roomId: savedRoomId, playerId } = getRoomData();


//       // ✅ Room ID match hona chahiye current screen se
//       if (savedRoomId === roomId && playerId) {
//         socket.emit('rejoin-room', { roomId: savedRoomId, playerId, playerName: 'Your Name' });

//       }
//     };

//     tryRejoin(); // Call it once when component mounts

//     // 🔄 Server se jab bhi room ka latest status aaye (player join/leave ya turn update),
//     socket.on('roomUpdate', ({ players, roomId, currentTurn, maxPlayers }) => {
//       // Table jaise formatted string banate hain
//       let message = `
// 🧩 Room Info:

// Room ID     : ${roomId}
// Max Players : ${maxPlayers}
// Current Turn: ${currentTurn}

// 👥 Players List:
// ${players.map((p, i) => `Player ${i + 1}: ${p.PlayerName} (${p.PlayerSocketId})`).join('\n')}

// `;

 
//       setPlayers(players);
//     });

//     // Jab game start hota hai
//     socket.on('game-started', ({ players, roomId }) => {
//      

//       setPlayers(players);
//       setGameStarted(true);


//       // const { playerId } = getRoomData();
//       // ✅ Get current socket ID
//       const playerId = socket.id;



//       // if (roomId && playerId) {
//       //   saveRoomData(roomId, playerId); // Store again in case of new game
//       // }
//       // ✅ Directly store the data into MMKV
//       saveRoomData(roomId, playerId);


//        // ✅ Find my position from players list
//       const mePosition = players.find(p => p.PlayerSocketId === playerId);
//       
//       // if (me) {
//       //   dispatch(setMyPlayer(me.position));
//       // }
//       // Ab GameScreen par navigate karo
//       navigateToGameScreen(players, roomId ,mePosition);
//     });

//     return () => {
//       socket?.off('roomUpdate');
//       socket?.off('game-started');
//     };
//   }, []);


//   function navigateToGameScreen(players, roomId ,mePosition) {


//     // let activePlayer =    players.map((_, index) => index + 1);
//       let activePlayer = players.map((item) => item.position);

 

//     // React Navigation / Router se GameScreen pe jao


//     dispatch(resetGame({ PlayerActive:activePlayer, gameType :"Online" }));
//     navigate('LudoBoardScreen', { players, roomId ,mePosition});
//   }

//   // Host Start Game button click
//   const handleStartGame = () => {
//     socket.emit('start-game', { roomId });

//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>Room ID: {roomId}</Text>
//       <Text>Players:</Text>
//       {players.map((player, idx) => (
//         <Text key={player.PlayerSocketId}>
//     {`Player ${player.position}: ${player.PlayerName} ${player.host ? '(Host)' : ''}`}
//   </Text>
//       ))}
//       <Button
//         title="Start Game"
//         onPress={handleStartGame}
//         disabled={players.length < 2}
//       />

//     </View>
//   );
// };

// export default RoomScreen;











import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getSocket } from '../socket/socket';
import { useNavigation, useRoute } from '@react-navigation/native';
import { navigate } from '../helpers/NavigationUtil';
import { getRoomData, saveRoomData } from '../redux/reducers/storage';
import { resetGame } from '../redux/reducers/gameSlice';
import { useDispatch } from 'react-redux';
import Wrapper from '../components/Wrapper';

// const MAX_PLAYERS = 4;

const RoomScreen = () => {
  const route = useRoute();
const RoomData = route?.params?.RoomData ?? {};
  const { id: roomId="", players: RoomPlayers = [], maxPlayers } = RoomData || {}
  const navigation = useNavigation();
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false); // ✅ Track whether game is starting

  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    // ✅ Try rejoin if app refreshes
    // const tryRejoin = async () => {
    //   const { roomId: savedRoomId, playerId } = getRoomData();
    //   if (savedRoomId === roomId && playerId) {
    //     socket.emit('rejoin-room', { roomId: savedRoomId, playerId, playerName: 'Your Name' });
    //   }
    // };

    // tryRejoin();

    // ✅ Listen for room updates
    socket.on('roomUpdate', ({ players,  }) => {
       
      setPlayers(players);
    });

    // ✅ When game actually starts
    socket.on('game-started', ({ players, roomId }) => {
      setPlayers(players);
      setGameStarted(true);

      const playerId = socket.id;
      // 

      const mePosition = players.find(p => p.PlayerSocketId === playerId);
      navigateToGameScreen(players, roomId, mePosition);
    });


    setPlayers(RoomPlayers)

    return () => {
      socket?.off('roomUpdate');
      socket?.off('game-started');
    };
  }, []);




  function navigateToGameScreen(players, roomId, mePosition) {
    let activePlayer = players.map((item) => item.position);

    dispatch(resetGame({ PlayerActive: activePlayer, gameType: "Online" }));
    navigate('LudoBoardScreen', { players, roomId, mePosition });
     playSound('game_start');
  }

  // ✅ Host clicks "Start Game"
  const handleStartGame = () => {
    setGameStarted(true); // Show "Game starting..." for host
    socket.emit('start-game', { roomId });
  };

  
  const currentPlayer = players.find(p => p.PlayerSocketId === socket.id);

  return (
    <Wrapper>
      <View style={styles.container}>
        {/* Room Header */}
        <Text style={styles.roomTitle}>🎲 Room ID</Text>
        <Text style={styles.roomId}>{roomId}</Text>

        {/* Players List */}
        <Text style={styles.subtitle}>👥 Players in Room ({players.length}/{maxPlayers})</Text>

        <FlatList
          data={players}
          keyExtractor={(item) => item.PlayerSocketId}
          renderItem={({ item }) => (
            <View style={styles.playerCard}>
              <Text style={styles.playerText}>
                {`Player ${item.position}: ${item.PlayerName}`}
              </Text>
              {item.host && <Text style={styles.hostBadge}>⭐ Host</Text>}
            </View>
          )}
        />
        {/* {currentPlayer ,"currentPlayer"} */}
     

        {/* Controls Section */}
        <View style={styles.footer}>
          {/* ✅ Host controls */}
          {currentPlayer?.host ? (
            players.length === 1 ? (
              // If host is alone
              <Text style={styles.waitText}>
                🙋 No other players have joined yet.
              </Text>
            ) : gameStarted ? (
              // If host already started the game
              <Text style={styles.waitText}>
                🚀 Game starting... please wait!
              </Text>
            ) : (
              // Host can start game if 2+ players
              <TouchableOpacity
                style={[styles.startBtn, (players.length < 2) && { backgroundColor: "#999" }]}
                onPress={handleStartGame}
                disabled={players.length < 2}
              >
                <Text style={styles.startBtnText}>🚀 Start Game</Text>
              </TouchableOpacity>
            )
          ) : (
            // ✅ Non-host players
            <Text style={styles.waitText}>
              ⌛ Waiting for host to start the game...
            </Text>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFD700",
    textAlign: "center",
  },
  roomId: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  playerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  playerText: {
    color: "#fff",
    fontSize: 16,
  },
  hostBadge: {
    color: "#FFD700",
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
  },
  startBtn: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 12,
    width: "80%",
  },
  startBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
  },
  waitText: {
    marginTop: 20,
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
  },
});


