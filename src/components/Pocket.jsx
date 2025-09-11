import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Colors } from '../constants/Colors';
import Pile from './Pile';
import { startingPoints } from '../helpers/PlotData';
import { unfreezeDice, updatePlayerPieceValue } from '../redux/reducers/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { activePlayer, selectCurrentPlayerChance } from '../redux/reducers/gameSelectors';
import { useRoute } from '@react-navigation/native';
import { getSocket } from '../socket/socket';
const Pocket = ({ color, player, data }) => {
  const socket = getSocket()
  const gameType = useSelector(state => state.game?.gameType)
  const route = useRoute();
  const { roomId, players } = route.params || {}
  const clickLockRef = useRef(false);

  const dispatch = useDispatch();
  const handlePress = async (value) => {
    if (gameType == "Online") {
      if (clickLockRef.current) return; // prevent multiple fast clicks
      clickLockRef.current = true
    }

     console.log("gameType Pocket HandelPRess" , gameType)
    let playerNo = value?.id?.slice(0, 1);


    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      default:
        playerNo = 'player4';
        break;
    }




    if (gameType == "Online") {

      socket.emit('PileEnableFromPocket', {
        roomId: roomId,  // from redux or props
        playerNo: playerNo,
        pieceId: value.id,
        travelCount: 1,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1]
      });

    } else {

      dispatch(updatePlayerPieceValue({
        playerNo: playerNo,
        pieceId: value.id,
        pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
        travelCount: 1,
      }))

      dispatch(unfreezeDice())
    }




  }

  // Online Play Ludo Logic 
  useEffect(() => {
    if (gameType == "Online") {
      socket.on('PileEnableFromPocket', ({ playerNo, pieceId, pos, travelCount }) => {

        dispatch(updatePlayerPieceValue({
          playerNo,
          pieceId,
          pos,
          travelCount
        }))
        dispatch(unfreezeDice())

        clickLockRef.current = false

      });
      socket.on('error', () => {
        clickLockRef.current = false

      });
      return () => {
        socket.off('PileEnableFromPocket')
        socket.off('error')
      }
    }


  }, [])
  // Online Play Ludo Logic 


  return (
    <View style={[styles.container, { backgroundColor: color }]}>

      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            handlePress={handlePress}
            pieceNo={0}
            player={player}
            color={color}

            data={data}
          />
          <Plot pieceNo={1} player={player} color={color}
            handlePress={handlePress}
            data={data}
          />
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <Plot pieceNo={2} player={player} color={color} data={data} handlePress={handlePress} />
          <Plot pieceNo={3} player={player} color={color} data={data} handlePress={handlePress} />
        </View>
      </View>
    </View>
  );
};

export default memo(Pocket);

{
  /* <Plot /> Component  */
}

const Plot = ({ pieceNo, player, color, data, handlePress }) => {
  const activePlayPlayers = useSelector(activePlayer);



  return (
    <View style={[styles.plot, { backgroundColor: color }]}>


      {data && data[pieceNo]?.pos === 0 && activePlayPlayers?.includes(player) && <Pile player={player} color={color} pieceId={data[pieceNo]?.id} onPress={() => {

        handlePress(data[pieceNo])

      }} />}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',

    width: '40%',
    height: '100%',
    borderColor: Colors.borderColor,
  },

  childFrame: {
    backgroundColor: 'white',
    borderWidth: 0.4,
    padding: 15,
    width: '70%',
    height: '70%',
    borderColor: Colors.borderColor,
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    flexDirection: 'row',
  },

  plot: {
    backgroundColor: Colors.green,
    height: '80%',
    width: '36%',
    borderRadius: 50,
  },
});
