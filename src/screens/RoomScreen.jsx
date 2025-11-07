import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useDispatch } from 'react-redux';
import BannerAdds from '../components/AddComponents/BannerAdds.jsx';
import ShareRoomButton from '../components/ShareRoomButton.jsx';
import Wrapper from '../components/Wrapper';
import { navigate } from '../helpers/NavigationUtil';
import { resetGame } from '../redux/reducers/gameSlice';
import { getSocket } from '../socket/socket';
// const MAX_PLAYERS = 4;

const RoomScreen = () => {
  const route = useRoute();
  const RoomData = route?.params?.RoomData ?? {};
  const {
    id: roomId = '',
    players: RoomPlayers = [],
    maxPlayers
  } = RoomData || {};
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
    socket.on('roomUpdate', ({ players }) => {
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

    setPlayers(RoomPlayers);

    return () => {
      socket?.off('roomUpdate');
      socket?.off('game-started');
    };
  }, []);

  useEffect(() => {
    const backAction = () => {
      // 🔹 Option 1: Navigate to previous screen
      navigation.goBack();

      // 🔹 Option 2 (Alternative): Navigate to a specific screen
      // navigate('HomeScreen');

      return true; // returning true disables default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // cleanup on unmount
  }, []);

  function navigateToGameScreen(players, roomId, mePosition) {
    let activePlayer = players.map(item => item.position);

    dispatch(resetGame({ PlayerActive: activePlayer, gameType: 'Online' }));
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
        <View style={styles.roomIdContainer}>
          <Text style={styles.roomId}>{roomId}</Text>
          <ShareRoomButton roomId={roomId} />
        </View>

        {/* Players List */}
        <Text style={styles.subtitle}>
          👥 Players in Room ({players.length}/{maxPlayers})
        </Text>

        <FlatList
          data={players}
          keyExtractor={item => item.PlayerSocketId}
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
          <BannerAdds size={BannerAdSize.FLUID} style={{ zIndex: 2 }} />
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
                style={[
                  styles.startBtn,
                  players.length < 2 && { backgroundColor: '#999' }
                ]}
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
    width: '100%'
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    textAlign: 'center'
  },
  roomId: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    justifyContent: 'space-between'
  },
  playerText: {
    color: '#fff',
    fontSize: 16
  },
  hostBadge: {
    color: '#FFD700',
    fontWeight: '700'
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center'
  },
  startBtn: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 12,
    width: '80%'
  },
  startBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700'
  },
  waitText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16
  },

  roomIdContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5
  }
});
