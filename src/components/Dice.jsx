import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Easing,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  selectCurrentPlayerChance,
  selectDiceRolled,
  selectDiceNo,
} from '../redux/reducers/gameSelectors';
import DiceRoll from '../assets/animation/diceroll.json';
import LinearGradient from 'react-native-linear-gradient';
import Arrow from '../assets/images/arrow.png';
import {BackgroundImage} from '../helpers/GetIcons';
import LottieView from 'lottie-react-native';
import {playSound} from '../helpers/SoundUtility';
import {
  updateDiceNo,
  updatePlayerChance,
  enablePileSelection,
} from '../redux/reducers/gameSlice';
import {useDispatch, useSelector} from 'react-redux';
const Dice = React.memo(({color, data, player}) => {
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);

  const playerPieces = useSelector(
    state => state.game[`player ${currentPlayerChance}`],
  );
  const isDiceRolled = useSelector(selectDiceRolled);
  const diceNo = useSelector(selectDiceNo);
  const [diceRolling, setDiceRolling] = useState(false);
  const arrowAnim = useRef(new Animated.Value(0)).current;

  const pileIcon = BackgroundImage.GetImage(color);
  const diceIcon = BackgroundImage.GetImage(diceNo);

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const dispatch = useDispatch();
  useEffect(() => {
    const animateArrow = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 10,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),

          Animated.timing(arrowAnim, {
            toValue: -10,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animateArrow();

    //  return () => {
    //    second
    //  }
  }, [currentPlayerChance, isDiceRolled]);

  const handleDicePress = async () => {
    //  playSound('dice_roll');
    // const newDiceNo = Math.floor(Math.random() * 6) + 1;
   const  newDiceNo =6

    setDiceRolling(true);

    await delay(1000); // simulate dice roll animationnpx react-native start --reset-cache

    dispatch(updateDiceNo({diceNo: newDiceNo}));

    setDiceRolling(false);

    const isAnyPieceALive = data?.findIndex(i => i.pos != 0 && i.pos != 57);

    if (isAnyPieceALive == -1) {
      if (newDiceNo == 6) {
        Alert.alert('enablePileSelection');
        dispatch(enablePileSelection({playerNo: player}));
      } else {
        let chancePlayer = player + 1;

        if (chancePlayer > 4) {
          chancePlayer = 1;
        }
        await delay(1000);
        dispatch(updatePlayerChance({chancePlayer: chancePlayer}));
      }
    } else {
      Alert.alert('isAnyPieceALive');
      // गोटी मूव करने की अनुमति दो
    }
  };

  return (
    <View style={[styles.flexRow]}>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={styles.pileContainer}>
            <Image source={pileIcon} style={styles.pileIcon} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <View style={styles.diceGradient}>
          <View style={styles.diceContainer}>
            {/* jis dice per number show ho rhe hai vo vala dice  */}

            {currentPlayerChance == player && !diceRolling ? (
              <TouchableOpacity
                disabled={false} // ye remove karna hai
                // disabled={isDiceRolled}  // ye add karna hai

                activeOpacity={0.4}
                onPress={handleDicePress}>
                <Image source={diceIcon} style={styles.dice} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Arrow Icon  */}
      {currentPlayerChance === player && !isDiceRolled ? (
        <Animated.View style={{transform: [{translateX: arrowAnim}]}}>
          <Image source={Arrow} style={{width: 30, height: 30}} />
        </Animated.View>
      ) : null}

      {/* Rolling Dice  */}

      {/* diceRolling */}

      {currentPlayerChance === player && diceRolling ? (
        <LottieView
          source={DiceRoll}
          style={styles.rollingDice}
          loop={true}
          autoPlay
          hardwareAccelerationAndroid
        />
      ) : null}
    </View>
  );
});

export default Dice;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },

  linearGradient: {
    padding: 1,
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: `#f0ce2c`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pileIcon: {
    width: 35,
    height: 35,
  },
  pileContainer: {
    paddingHorizontal: 3,
    paddingVertical: 10,
  },

  border2: {
    borderWidth: 3,
    padding: 1,
    backgroundColor: '#aac8ab',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: '#aac8ab',
  },

  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  diceContainer: {
    backgroundColor: '#e8c0c1',
    borderWidth: 1,
    borderRadius: 5,
    width: 60,
    height: 70,
    paddingHorizontal: 8,
    paddingVertical: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dice: {
    height: 45,
    width: 45,
  },
  rollingDice: {
    height: 80,
    width: 80,
    zIndex: 99,
    top: -25,
    right: 25,
    position: 'absolute',
  },
});
