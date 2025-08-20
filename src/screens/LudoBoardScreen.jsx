import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import MenuModal from '../components/MenuModal';
import { deviceHeight, deviceWidth } from '../constants/Scaling';
import Dice from '../components/Dice';
import Pocket from '../components/Pocket';
import VerticalPath from '../components/path/VerticalPath';
import HorizontalPath from '../components/path/HorizontalPath';
import FourTriangles from '../components/FourTriangles';
import StartGame from '../assets/images/start.png';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../constants/Colors';
import { Plot1Data, Plot2Data, Plot3Data, Plot4Data } from '../helpers/PlotData';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


import WinModal from '../components/WinModal';
import {
  selectDiceTouch,
  selectPlayer1,
  selectPlayer2,
  selectPlayer3,
  selectPlayer4,
  // selectPlayer4,
} from '../redux/reducers/gameSelectors';
import { playSound } from '../helpers/SoundUtility';
import { PlayActivePlayer } from '../redux/reducers/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { store } from '../redux/reducers/store';

 
const LudoBoardScreen = () => {
 console.log('🧠 Full Redux Store at launch:', store.getState()); // ✅ This wor
  const route = useRoute();

  // Dummy Room Data 

 
   

  


   
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets();

  const winner = useSelector(state => state.game.winner);
  const player1 = useSelector(selectPlayer1);
  const player2 = useSelector(selectPlayer2);
  const player3 = useSelector(selectPlayer3);
  const player4 = useSelector(selectPlayer4);
  const isDiceTouch = useSelector(selectDiceTouch);
  const opacity = useRef(new Animated.Value(1)).current;
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuPress = useCallback(() => {
    playSound('ui');
    setMenuVisible(true);
  }, []);

  const isFocused = useIsFocused();
  const [showStartImage, setShowStartImage] = useState(false);
  useEffect(() => {
    if (isFocused) {
      setShowStartImage(true);

      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      blinkAnimation.start();
      const timeout = setTimeout(() => {
        blinkAnimation.stop();
        setShowStartImage(false);
        clearTimeout(timeout);
      }, 2500);

      return () => {
        blinkAnimation.stop();
      };
    }
  }, []);





  //  Soket logic -----------------STart  like update acitve palyer updte dice number etc


  // useEffect(() => {

  //   if (roomId && Array.isArray(players)) {

  //     // let activePlayer =    players.map((_, index) => index + 1);
  //     let activePlayer = players.map((item) => item.position);
      
  //     dispatch(PlayActivePlayer({ PlayingActivePlayer: activePlayer, gameType: "Online" }))

  //   }

  // }, [])


  //  / Soket Logic End ----------------------------------------------------





  return (
    <Wrapper>


      {winner != null && <WinModal winner={winner} />}
      {/* <WinModal winner={1} />  */}

      <TouchableOpacity

        style={[styles.menuIcon, { top: insets.top + 10 }]}

        onPress={handleMenuPress}>
        <Image source={MenuIcon} style={styles.menuIconImage} />
      </TouchableOpacity>

      {/* <LudoBoad Screen Start  */}

      <View style={styles.container}>
        <View style={styles.flexRow} pointerEvents={isDiceTouch ? 'none' : 'auto'}>
          <Dice color={Colors.green} player={2} data={player2} />
          <Dice color={Colors.yellow} player={3} data={player3} rotate={false} />
        </View>
        <View style={styles.ludoBoard}>

          {/* // ludobard start */}
          <View style={styles.plotContainer}>
            <Pocket color={Colors.green} player={2} data={player2} />
            <VerticalPath color={Colors.yellow} cells={Plot2Data} />
            <Pocket color={Colors.yellow} player={3} data={player3} />
          </View>
          <View style={styles.pathContainer}>
            <HorizontalPath color={Colors.green} cells={Plot1Data} />
            <FourTriangles
              player1={player1}
              player2={player2}
              player3={player3}
              player4={player4} />
            <HorizontalPath color={Colors.blue} cells={Plot3Data} />
          </View>
          <View style={styles.plotContainer}>
            <Pocket color={Colors.red} data={player1} player={1} />
            <VerticalPath player={1} cells={Plot4Data} color={Colors.red} />
            <Pocket color={Colors.blue} data={player4} player={4} />
          </View>

        </View>

        <View style={styles.flexRow}>
          <Dice color={Colors.green} player={1} data={player1} />
          <Dice color={Colors.yellow} player={4} data={player4} />
        </View>
        {/* // ludobard end */}
      </View>
      {/* <LudoBoad Screen  End */}

      {showStartImage && (
        <Animated.Image
          source={StartGame}
          style={{
            width: deviceHeight * 0.5,
            height: deviceHeight * 0.2,
            position: 'absolute',
            opacity,
          }}
        />
      )}

      {menuVisible && (
        <MenuModal
          onPressHide={() => setMenuVisible(false)}
          visible={menuVisible}
        />
      )}

    </Wrapper>
  );
};

export default LudoBoardScreen;
const styles = StyleSheet.create({
  //  LudoBaod css  start
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: deviceHeight * 0.5,
    width: deviceWidth,
    marginTop: deviceHeight * 0.08,

  },
  // LudoBoad Css end

  menuIcon: {
    position: 'absolute',
    // top: 50,
    // top: deviceHeight * 0.07,
    //  top: insets.top, // ✅ safe & responsive

    left: 20,
  },
  menuIconImage: {
    width: 30,
    height: 40,
  },
  ludoBoard: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    padding: 10,
  },
  plotContainer: {
    width: '100%',
    height: '40%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#ccc',
  },

  pathContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '20%',
    justifyContent: 'space-between',
    backgroundColor: '#1E5162',
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
