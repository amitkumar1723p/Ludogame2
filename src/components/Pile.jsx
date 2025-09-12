import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Svg, Circle } from 'react-native-svg';
import { Colors } from '../constants/Colors';

import PileGreen from '../assets/images/piles/green.png';
import PileRed from '../assets/images/piles/red.png';
import PileBlue from '../assets/images/piles/blue.png';
import PileYellow from '../assets/images/piles/yellow.png';
import { useSelector } from 'react-redux';
import {
  selectPocketPileSelection,
  selectCellSelection,
  selectDiceNo,
  selectDiceRolled,
  selectPlayer3,
  selectCurrentPosition,
  selectCurrentPlayerChance
} from '../redux/reducers/gameSelectors';
import {
  findBestMove,
  findBestMoveAdvanced,
  findBestMoveUnbeatable
} from '../redux/reducers/gameAction'; // path adjust करना
import { useRoute } from '@react-navigation/native';

const Pile = ({ cell, pieceId, color, player, onPress }) => {
  const player3 = useSelector(selectPlayer3);

  const rotation = useRef(new Animated.Value(0)).current;
  const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
  const currentPlayerCellSelection = useSelector(selectCellSelection);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(state => state.game[`player${player}`]);
  const gameType = useSelector(state => state.game?.gameType);
  const isDiceRolled = useSelector(selectDiceRolled);

  const currentPositions = useSelector(selectCurrentPosition);
  const isPileEnabled = useMemo(
    () => player == currentPlayerPileSelection,
    [player, currentPlayerPileSelection]
  );

  const isCellEnabled = useMemo(
    () => player === currentPlayerCellSelection && isDiceRolled === true,
    [isDiceRolled, player, currentPlayerCellSelection]
  );

  const isForwardable = useCallback(() => {
    const piece = playerPieces?.find(item => item.id === pieceId);
    return piece && piece.travelCount + diceNo <= 57;
  }, [playerPieces, diceNo, pieceId]);

  const getPileImage = useMemo(() => {
    switch (color) {
      case Colors.green:
        return PileGreen;
      case Colors.red:
        return PileRed;
      case Colors.blue:
        return PileBlue;
      case Colors.yellow:
        return PileYellow;
      default:
        return PileGreen;
    }
  }, [color]);

  const isHighlighted = cell ? isCellEnabled && isForwardable() : isPileEnabled;

  useEffect(() => {
    if (isHighlighted) {
      rotation.setValue(0); // Reset
      const rotateAnimation = Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true
        })
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [rotation, isHighlighted]);

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      }),

    [rotation]
  );

  const currentPlayerChance = useSelector(selectCurrentPlayerChance);
  const player1 = useSelector(state => state.game.player1);
  const player2 = useSelector(state => state.game.player2);
  const player4 = useSelector(state => state.game.player4);

  useEffect(() => {
    if (
      gameType === 'UserVsComp' &&
      player === 3 &&
      isDiceRolled &&
      currentPlayerChance == 3
    ) {
      const bestMove = findBestMoveUnbeatable({
        playerPieces: player3, // ✅ Already declared
        dice: diceNo, // ✅ Dice rolled
        playerNo: 3, // ✅ Computer's player number
        opponentPieces: [...player1, ...player2, ...player4], // ✅ Flatten all opponents
        allOpponentsActive: [
          { playerNo: 1, unlocked: true },
          { playerNo: 2, unlocked: true },
          { playerNo: 4, unlocked: true }
        ]
      });

      // ✅ AI move on cell selection
      if (cell && isCellEnabled && pieceId === bestMove) {
        onPress(pieceId);
      }

      // ✅ AI move on pile selection (unlock new piece)
      if (!cell && isPileEnabled && pieceId === bestMove) {
        onPress(pieceId);
      }
    }
  }, [
    gameType,
    player,
    cell,
    pieceId,
    isCellEnabled,
    isPileEnabled,
    player3,
    isDiceRolled,
    diceNo,
    onPress,
    currentPositions, // ⬅️ Important dependency
    currentPlayerChance
  ]);

  // cell ? (isCellEnabled && isForwardable()) : isPileEnabled
  //  if only one pile enagle run automatic 9

  function getSinglePieceId(currentPositions, pieceId) {
    // prefix nikal lo (first letter)
    const prefix = pieceId?.charAt(0);

    // us prefix ke saare pieces filter karo
    const relatedPieces = currentPositions.filter(
      item => item?.id?.startsWith(prefix) && item.travelCount + diceNo <= 57
    );

    if (relatedPieces.length === 1) {
      return relatedPieces[0].id; // ek hi hai toh return karo
    }
    return false; // agar 0 ya multiple hain toh false
  }
  let singleId = getSinglePieceId(currentPositions, pieceId);
  const CurrentPlayerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`]
  );

  //  auto Pile Logic Start

  const [enableAutoPileAferDice6, setenableAutoPileAferDice6] = useState(false);
  useEffect(() => {
    // if (diceNo != 6) return;
    if (diceNo == 6) {
      let matchCount = 0;
      for (const piece of CurrentPlayerPieces) {
        if (piece.travelCount + diceNo <= 57) {
          matchCount++;
        }
      }
      console.log(matchCount);
      const result = matchCount === 1;

      let enablePileDiceNUmber6 = result;
      setenableAutoPileAferDice6(enablePileDiceNUmber6);
    } else {
      setenableAutoPileAferDice6(false);
    }

    // else if ([1, 2, 3, 4, 5].includes(diceNo)) {
    //   setenableAutoPileAferDice6(true);
    //   console.log('dice is 1 se 5 tak');

    //   //
    // }

    // setenableAutoPileAferDice6(enablePileDiceNUmber6);
  }, [CurrentPlayerPieces, diceNo]);
  console.log('enableAutoPileAferDice6', enableAutoPileAferDice6);
  useEffect(() => {
    if (cell && isCellEnabled && isForwardable()) {
      if (singleId !== false && (enableAutoPileAferDice6 || diceNo !== 6)) {
        // fix
        onPress(pieceId);
      }
    }
  }, [
    cell,
    isCellEnabled,
    isForwardable,
    isDiceRolled,
    pieceId,
    diceNo,
    enableAutoPileAferDice6
  ]);

  //  auto Pile Logic End
  const route = useRoute();
  const { roomId, players, mePosition } = route.params || {};

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      // disabled={
      //   (!(cell ? (isCellEnabled && isForwardable()) : isPileEnabled)) ||
      //   (gameType === 'UserVsComp' && player === 3) || (
      //     gameType === 'Online' &&mePosition.position==player ?false:true
      //   )
      // }
      // disabled={
      //   (!(cell ? (isCellEnabled && isForwardable()) : isPileEnabled)) ||
      //   (gameType === 'UserVsComp' && player === 3) ||
      //   (cell && isCellEnabled && isForwardable()&&singleId !== false) ||
      //   (gameType === 'Online' && mePosition.position !== player)
      // }
      disabled={
        !(cell ? isCellEnabled && isForwardable() : isPileEnabled) ||
        (gameType === 'UserVsComp' && player === 3) ||
        (cell &&
          isCellEnabled &&
          isForwardable() &&
          singleId !== false &&
          (enableAutoPileAferDice6 || diceNo !== 6)) || // fix
        (gameType === 'Online' && mePosition.position !== player)
      }
      onPress={onPress}
    >
      <View style={styles.holloCircle}>
        {(cell ? isCellEnabled && isForwardable() : isPileEnabled) ? (
          <View style={styles.dashedCircleContainer}>
            <Animated.View
              style={[
                styles.dashedCircle,
                { transform: [{ rotate: rotateInterpolate }] }
              ]}
            >
              <Svg height={'18'} width={'18'}>
                <Circle
                  cx="9"
                  cy="9"
                  r="8"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeDashoffset="0"
                  fill="transparent"
                />
              </Svg>
            </Animated.View>
          </View>
        ) : null}
      </View>

      <Image
        source={getPileImage}
        style={{ width: 32, height: 32, position: 'absolute', top: -16 }}
      />
    </TouchableOpacity>
  );
};

export default React.memo(Pile);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center'
  },
  holloCircle: {
    width: 15,
    height: 15,
    position: 'absolute',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dashedCircleContainer: {
    position: 'absolute',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    top: -8
  },
  dashedCircle: {
    width: 25,
    height: 25,
    // backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
