import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { Colors } from '../../constants/Colors';
import { ArrowSpot, SafeSpots, StarSpots } from '../../helpers/PlotData';
import Iconicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCellSelection,
  selectCurrentPosition,
  selectDiceNo,
  selectDiceRolled
} from '../../redux/reducers/gameSelectors';

import { handleForwardThunk } from '../../redux/reducers/gameAction';
import Pile from '../Pile';
import { useRoute } from '@react-navigation/native';
import socket from '../../socket/socket';

const Cell = ({ id, color = 'black' }) => {
  const dispatch = useDispatch();

  const plottedPieces = useSelector(selectCurrentPosition);
  const currentPlayerCellSelection = useSelector(selectCellSelection);
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const allPlayersPieces = useSelector(state => state.game);

  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStartSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpot.includes(id), [id]);

  const piecesAtPosition = useMemo(() => {
    return plottedPieces.filter(item => item.pos == id);
  }, [plottedPieces, id]);

  const gameType = useSelector(state => state.game?.gameType)
  const route = useRoute();
  const { roomId, players } = route.params || {}

  const handlePress = (playerNo, pieceId) => {
    if (gameType) {
      socket.emit('handleForwardThunk', {
        roomId,  //  from redux or props
        playerNo,
        pieceId,
        id

      });
    } else {
      dispatch(handleForwardThunk(playerNo, pieceId, id));
    }



  };

  const isForwardable = (piece, playerPieces) => {
    const foundPiece = playerPieces?.find(item => item.id === piece.id);
    return foundPiece && foundPiece.travelCount + diceNo <= 57;
  };


  useEffect(() => {
    socket.on('handleForwardThunk', ({
      playerNo,
      pieceId,
      id }) => {
      dispatch(handleForwardThunk(playerNo, pieceId, id));
    });

    return () => {
      socket.off('handleForwardThunk')

    }
  }, [])


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSafeSpot ? color : 'white' },
      ]}
    >
      {isStartSpot && (
        <Iconicons name="star-outline" size={RFValue(12)} color="grey" />
      )}

      {isArrowSpot && (
        <Iconicons
          name="arrow-forward-outline"
          style={{
            transform: [
              {
                rotate:
                  id === 38
                    ? '180deg'
                    : id == 25
                      ? '90deg'
                      : id == 51
                        ? '-90deg'
                        : '0deg',
              },
            ],
          }}
          size={RFValue(12)}
          color={color}
        />
      )}

      {piecesAtPosition.map((piece, index) => {
        const playerNo =
          piece.id.startsWith('A') ? 1 :
            piece.id.startsWith('B') ? 2 :
              piece.id.startsWith('C') ? 3 : 4;

        const playerPieces = allPlayersPieces[`player${playerNo}`];

        const pieceColor =
          piece.id.startsWith('A') ? Colors.red :
            piece.id.startsWith('B') ? Colors.green :
              piece.id.startsWith('C') ? Colors.yellow : Colors.blue;

        const isCellEnabled = playerNo === currentPlayerCellSelection && isDiceRolled;
        const forwardable = isForwardable(piece, playerPieces);

        return (
          <View
            key={piece.id}
            style={[
              styles.pileContainer,
              {
                transform: [
                  { scale: piecesAtPosition.length === 1 ? 1 : isCellEnabled && forwardable ? 1 : 0.7 },
                  {
                    translateX:
                      piecesAtPosition.length === 1
                        ? 0
                        : index % 2 === 0
                          ? -6
                          : 6,
                  },
                  {
                    translateY:
                      piecesAtPosition.length === 1
                        ? 0
                        : index < 2
                          ? -6
                          : 6,
                  },
                ],
              },
            ]}
          >
            <Pile
              cell={true}
              player={playerNo}
              onPress={() => handlePress(playerNo, piece.id)}
              pieceId={piece.id}
              color={pieceColor}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    borderColor: Colors.borderColor,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pileContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
});

export default Cell;
