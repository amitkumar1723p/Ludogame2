import {
  View,
  Text,
  Image,
  Animated,
  Pressable,
  StyleSheet,
  Alert,
  Button,
  useWindowDimensions
} from 'react-native';
import Witch from '../assets/animation/witch.json';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../components/Wrapper';
import Logo from '../assets/images/logo.png';
import LottieView from 'lottie-react-native';
import { deviceHeight, deviceWidth } from '../constants/Scaling';
import GradientButton from '../components/GradienthButton';
import { navigate } from '../helpers/NavigationUtil';
import SoundPlayer from 'react-native-sound-player';
import { playSound } from '../helpers/SoundUtility';
import { PlayActivePlayer, resetGame } from '../redux/reducers/gameSlice';
import { useIsFocused } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-gesture-handler';
import MenuModal from '../components/MenuModal.jsx';
import BannerAdds from '../components/AddComponents/BannerAdds.jsx';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const HomeScreen = () => {
  const dispatch = useDispatch();
  const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
  const scaleXAnim = useRef(new Animated.Value(-1)).current;
  const Focoused = useIsFocused();
  const [menuVisible, setMenuVisible] = useState(false);

  // Soket Code
  const [roomId, setRoomId] = useState(''); // Store Room Id

  const [PlayerName, setPlayerName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loopAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 0.02,
              duration: 2000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true
            })
          ]),
          Animated.delay(3000), // 3 seconds delay ,

          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 2,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true
            })
          ]),
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 0.05,
              duration: 3000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ]),
          Animated.delay(3000), // 3 seconds delay ,
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: -deviceWidth * 2,
              duration: 8000,
              useNativeDriver: true
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true
            })
          ])
        ])
      ).start();
    };

    const cleanupAnimation = () => {
      witchAnim.stopAnimation();
      scaleXAnim.stopAnimation();
    };

    loopAnimation();

    return cleanupAnimation;
  }, []);

  const renderButton = useCallback(
    (title, onPress) => <GradientButton title={title} onPress={onPress} />,
    []
  );

  const handleResumePress = useCallback(() => {
    startGame({});
  }, []);

  const handleNewGamePress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const UserVsComputerGameStart = useCallback(() => {
    startGame({ isNew: true, PlayerActive: [1, 3], gameType: 'UserVsComp' });
  }, []);

  // Start new Game
  const startGame = async ({
    isNew = false,
    PlayerActive = {},
    gameType = 'default'
  }) => {
    SoundPlayer.stop();
    if (isNew) {
      dispatch(resetGame({ PlayerActive, gameType }));
    }
    setMenuVisible(false);
    navigate('LudoBoardScreen');
    playSound('game_start');
  };

  const { showAdd, navigateScreen } = useSelector(state => {
    return state.room;
  });
  // const [ ,setPlayHomeSound] = useState(false)
  useEffect(() => {
    if (Focoused && !showAdd) {
      playSound('home');
      const timer = setTimeout(() => {
        SoundPlayer.stop(); // ✅ sound stop after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // cleanup jab component unmount ho
    }
  }, [Focoused]);
  const insets = useSafeAreaInsets(); // top, bottom, left, right
  // const { width } = useWindowDimensions();
  return (
    <Wrapper style={styles.mainContainer}>
      <BannerAdds
        size={BannerAdSize.FLUID}
        style={{ position: 'absolute', zIndex: 2, top: insets.top }}
      />
      <View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </View>

      {renderButton('RESUME', handleResumePress)}
      {renderButton('NEW GAME', handleNewGamePress)}
      {renderButton('VS CPU', UserVsComputerGameStart)}
      {/* {renderButton('2 Vs 2', handleResumePress)} */}
      <Animated.View
        style={[
          styles.witchcontainer,
          {
            transform: [{ translateX: witchAnim }, { scaleX: scaleXAnim }]
          }
        ]}
      >
        <Pressable
          onPress={() => {
            const random = Math.floor(Math.random() * 3) + 1;
            playSound(`girl${random}`);
          }}
        >
          <LottieView
            hardwareAccelerationAndroid
            source={Witch}
            autoPlay
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>
      <Text style={[styles.artist, { bottom: insets.bottom + 10 }]}>
        Made By - Amit
      </Text>

      {/* Socket code  ----start */}

      {/* Socket code  ----end */}

      {menuVisible && (
        <MenuModal
          ModalType={'HomeModal'}
          startGame={startGame}
          onPressHide={() => setMenuVisible(false)}
          visible={menuVisible}
        />
      )}

      {/* <View style={{ position: 'absolute', top: 0, width: '100%' }}></View> */}
    </Wrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start'
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    alignSelf: 'center',
    position: 'relative'
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },

  artist: {
    position: 'absolute',
    bottom: 40,
    color: 'white',
    opacity: 0.5,
    fontStyle: 'italic'
  },

  witchcontainer: {
    position: 'absolute',
    top: '70%',
    left: '24%'
  },
  witch: {
    height: 240,
    width: 240,
    transform: [{ rotate: '20deg' }]
  }
});
