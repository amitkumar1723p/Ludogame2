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
import React, { useEffect, useRef, useState } from 'react';
import {
  selectCurrentPlayerChance,
  selectDiceRolled,
  selectDiceNo,
} from '../redux/reducers/gameSelectors';
import DiceRoll from '../assets/animation/diceroll.json';
import LinearGradient from 'react-native-linear-gradient';
import Arrow from '../assets/images/arrow.png';
import { BackgroundImage } from '../helpers/GetIcons';
import LottieView from 'lottie-react-native';
import { playSound } from '../helpers/SoundUtility';
import {
  updateDiceNo,
  updatePlayerChance,
  enablePileSelection,
  enableCellSelection,
} from '../redux/reducers/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { getSocket } from '../socket/socket';
import { store } from '../redux/reducers/store';

const Dice = React.memo(({ color, data, player }) => {
  const socket = getSocket()
  const currentPlayerChance = useSelector(selectCurrentPlayerChance);




  const playerPieces = useSelector(
    state => state.game[`player${currentPlayerChance}`],
  );
  const gameType = useSelector(state => state.game?.gameType
  );
  const PlayerActive = useSelector(state => state.game?.activePlayer
  );


  const isDiceRolled = useSelector(selectDiceRolled);

  const diceNo = useSelector(selectDiceNo);
  const [diceRolling, setDiceRolling] = useState(false);
  const arrowAnim = useRef(new Animated.Value(0)).current

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
            useNativeDriver: false,
          }),

          Animated.timing(arrowAnim, {
            toValue: -10,
            duration: 400,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };

    animateArrow();

    //  return () => {
    //    second
    //  }
  }, [currentPlayerChance, isDiceRolled]);






  useEffect(() => {

    const isComputerTurn = gameType === 'UserVsComp' && currentPlayerChance === 3 && player === 3 && !isDiceRolled;


    if (isComputerTurn) {


      handleDicePress()
    }
  }, [currentPlayerChance, gameType, player, isDiceRolled]);


  const route = useRoute();
  const { roomId, players, mePosition } = route.params || {}


  //    console.log(player ,"Player")
  //    console.log(currentPlayerChance ,"currentPlayerChance")

  //  Pause Handle Press Function ----------------start 


  const pauseLogicRef = useRef(false)



  const waitForPauseLogicFalse = () => {
    return new Promise((resolve) => {


      // अगर पहले से false है तो तुरंत resolve कर दो
      if (pauseLogicRef.current === false) {
        resolve(true);
        return;
      }

      // हर 50ms चेक करो
      const interval = setInterval(() => {
        if (pauseLogicRef.current === false) {
          clearInterval(interval);
          resolve(true); // जब false मिले तब resolve करो
        }
      }, 50);
    });
  };
  // const waitForPauseLogicFalse = () => {


  //   return new Promise((resolve) => {
  //     // Agar already false hai to turant resolve(true)
  //     if (!pauseLogic) {
  //       resolve(true);
  //       return;
  //     }

  //     // Har 50ms me check karo
  //     const interval = setInterval(() => {
  //       if (!pauseLogic) {
  //         clearInterval(interval);
  //         resolve(true); // condition meet hote hi return true
  //       }
  //     }, 50);
  //   });
  // };



  const handleDicePress = async () => {
    // Alert.alert("hello")

    // const newDiceNo = Math.floor(Math.random() * 6) + 1;
    const newDiceNo = 6






    // simulate dice roll animationnpx react-native start --reset-cache

    // dispatch(updateDiceNo({ diceNo: newDiceNo }));
    //  Play Online Game Logic add 

    if (gameType === 'Online') {
        if (pauseLogicRef.current) return;
      pauseLogicRef.current = true


      // Alert.alert("Press Diece Roll")
      socket.emit('diceRolled', {
        roomId: roomId,  // from redux or props
        playerNo: player,
        PlayerSocketId: players.PlayerSocketId,
        diceNo: newDiceNo,
      }  );

      await waitForPauseLogicFalse()



    } else {
      playSound("dice_roll")
      setDiceRolling(true);

      await delay(800)
      dispatch(updateDiceNo({ diceNo: newDiceNo }));
      setDiceRolling(false);
    }





    const isAnyPieceALive = data?.findIndex(i => i.pos != 0 && i.pos != 57);
    const isAnyPieceLocked = data?.findIndex(i => i.pos == 0)


    if (isAnyPieceALive == -1) {


      if (newDiceNo == 6) {
        if (gameType == "Online") {

          socket.emit('enablePileSelection', {
            roomId: roomId,  // from redux or props
            playerNo: player,

          });


        } else {
          Alert.alert("Enable Pile Selection")
          dispatch(enablePileSelection({ playerNo: player }));
        }


      } else {
        let currentIndex = PlayerActive.indexOf(player);
        // Move to next index (with loop back)
        let nextIndex = (currentIndex + 1) % PlayerActive.length;
        let chancePlayer = PlayerActive[nextIndex];
        await delay(600);
        // dispatch(updatePlayerChance({ chancePlayer: chancePlayer }));
        if (gameType === 'Online') {

          socket.emit('nextTurn', { roomId, chancePlayer });
        } else {
          dispatch(updatePlayerChance({ chancePlayer }));
        }


      }
    }






    else {
      const canMove = playerPieces.some(pile => pile.travelCount + newDiceNo <= 57 && pile.pos != 0)
      if (
        (!canMove && newDiceNo == 6 && isAnyPieceLocked == -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked != -1) ||
        (!canMove && newDiceNo != 6 && isAnyPieceLocked == -1)) {
        let currentIndex = PlayerActive.indexOf(player);
        // Move to next index (with loop back)

        let nextIndex = (currentIndex + 1) % PlayerActive.length;

        let chancePlayer = PlayerActive[nextIndex];

        await delay(600);
        if (gameType === 'Online') {
          Alert.alert("hello")
          socket.emit('nextTurn', { roomId, chancePlayer });
        } else {
          dispatch(updatePlayerChance({ chancePlayer }));
        }

        return;
      }



      if (newDiceNo == 6) {
        if (gameType == "Online") {

          socket.emit('enablePileSelection', {
            roomId: roomId,  // from redux or props
            playerNo: player,

          });
        } else {
          dispatch(enablePileSelection({ playerNo: player }));
        }

      }

      if (gameType === 'Online') {
        socket.emit('enableCellSelection', {
          roomId: roomId,  // from redux or props
          playerNo: player,

        });
      } else {
        dispatch(enableCellSelection({ playerNo: player }));
      }
      // dispatch(enableCellSelection({ playerNo: player }));








    }
    return

  };




  // Listen for Dice Update 
  useEffect(() => {




    if (gameType == "Online") {
      socket.on('diceRolling', ({ playerNo }) => {

        if (playerNo === player) {
          playSound("dice_roll")
          setDiceRolling(true); // Start animation only for active player section()

          pauseLogicRef.current = true
        }
      });

      socket.on('diceRolled', ({ playerNo, diceNo }) => {
        dispatch(updateDiceNo({ diceNo }));
        setDiceRolling(false);

        pauseLogicRef.current = false

      });




      // get new Trun Number 
      socket.on('nextTurn', ({ chancePlayer }) => {
        dispatch(updatePlayerChance({ chancePlayer }));
      });

      socket.on('enablePileSelection', ({ playerNo }) => {

        dispatch(enablePileSelection({ playerNo: playerNo }));
      });
      socket.on('enableCellSelection', ({ playerNo }) => {

        dispatch(enableCellSelection({ playerNo: playerNo }));
      });
      socket.on('error', () => {
        pauseLogicRef.current = false

      });



      return () => {
        socket.off('enablePileSelection')
        socket.off('enableCellSelection')
        socket.off('diceRolling');
        socket.off('diceRolled');
        socket.off('nextTurn')
        socket.off('error')
      };
    }



  }, []);



  return (

    <View style={[styles.flexRow]}>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}>
          <View style={styles.pileContainer}>
            <Image source={pileIcon} style={styles.pileIcon} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <View style={styles.diceGradient}>
          <View style={styles.diceContainer}>
            {/* jis dice per number show ho rhe hai vo vala dice  */}




            {currentPlayerChance == player ?

              (diceRolling) ? null :
                <TouchableOpacity

                  disabled={isDiceRolled || (gameType === 'UserVsComp' && player === 3) || (

                    gameType === 'Online' && (mePosition.position == player ? false : true || pauseLogicRef.current == true ? true : false)
                  )}
                  // disabled={isDiceRolled}  // ye add karna hai

                  activeOpacity={0.4}
                  onPress={handleDicePress}>
                  <Image source={diceIcon} style={styles.dice} />
                </TouchableOpacity>


              : null}



          </View>
        </View>
      </View>

      {/* Arrow Icon  */}
      {currentPlayerChance === player && !isDiceRolled ? (
        <Animated.View style={{ transform: [{ translateX: arrowAnim }] }}>
          <Image source={Arrow} style={{ width: 30, height: 30 }} />
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

export default React.memo(Dice);

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
