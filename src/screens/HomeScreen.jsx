import {
  View,
  Text,
  Image,
  Animated,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import Witch from '../assets/animation/witch.json';
import React, {useCallback, useEffect, useRef} from 'react';
import {useDispatch} from 'react-redux';
import Wrapper from '../components/Wrapper';
import Logo from '../assets/images/logo.png';
import LottieView from 'lottie-react-native';
import {deviceHeight, deviceWidth} from '../constants/Scaling';
import GradientButton from '../components/GradienthButton';
import {navigate} from '../helpers/NavigationUtil';
import SoundPlayer from 'react-native-sound-player';
import {playSound} from '../helpers/SoundUtility';
import {resetGame} from '../redux/reducers/gameSlice';
const HomeScreen = () => {
  const dispatch = useDispatch();
  const witchAnim = useRef(new Animated.Value(-deviceWidth)).current;
  const scaleXAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 0.02,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(3000), // 3 seconds delay ,

          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 2,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleXAnim, {
              toValue: -1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: deviceWidth * 0.05,
              duration: 3000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
          Animated.delay(3000), // 3 seconds delay ,
          Animated.parallel([
            Animated.timing(witchAnim, {
              toValue: -deviceWidth * 2,
              duration: 8000,
              useNativeDriver: true,
            }),
            Animated.timing(scaleXAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
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
    [],
  );

  const handleResumePress = useCallback(() => {
    startGame();
  }, []);

  const handleNewGamePress = useCallback(() => {
    startGame(true);
  }, []);

  // Start new Game
  const startGame = async (isNew = false) => {
    SoundPlayer.stop();
    if (isNew) {
      dispatch(resetGame());
    }

    navigate('LudoBoardScreen');
    playSound('game_start');
  };
  //  const renderButton =useCallback((title ,onPress)=>   )
  return (
    <Wrapper style={styles.mainContainer}>
      <View style={styles.imgContainer}>
        <Image source={Logo} style={styles.img} />
      </View>

      {renderButton('RESUME', handleResumePress)}
      {renderButton('NEW GAME', handleNewGamePress)}
      {renderButton('VS CPU', () => {
        Alert.alert('Comming Soon! Click New Game');
      })}
      {renderButton('2 Vs 2', handleResumePress)}
      <Animated.View
        style={[
          styles.witchcontainer,
          {
            transform: [{translateX: witchAnim}, {scaleX: scaleXAnim}],
          },
        ]}>
        <Pressable>
          <LottieView
            hardwareAccelerationAndroid
            source={Witch}
            autoPlay
            speed={1}
            style={styles.witch}
          />
        </Pressable>
      </Animated.View>
      <Text style={styles.artist}> Made By - Amit </Text>
    </Wrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
  },
  imgContainer: {
    width: deviceWidth * 0.6,
    height: deviceHeight * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  artist: {
    position: 'absolute',
    bottom: 40,
    color: 'white',
    opacity: 0.5,
    fontStyle: 'italic',
  },

  witchcontainer: {
    position: 'absolute',
    top: '70%',
    left: '24%',
  },
  witch: {
    height: 240,
    width: 240,
    transform: [{rotate: '20deg'}],
  },
});
