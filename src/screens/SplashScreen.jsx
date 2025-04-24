import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {deviceHeight, deviceWidth} from '../constants/Scaling.js';
import Logo from '../assets/images/logo.png';
import Wrapper from '../components/Wrapper';
import {prepareNavigation, resetAndNavigate} from '../helpers/NavigationUtil'
// import { prepareNavigation, resetAndNavigate } from '../helpers/NavigationUtil';
const SplashScreen = () => {
  const [isStop] = useState(false);
  const scale = new Animated.Value(1);

   useEffect(()=>{
    prepareNavigation() ;
     setTimeout(() => {
      resetAndNavigate('HomeScreen')
     }, 1500);
   } ,[])

  useEffect(() => {
    const breathingAnimation = Animated.loop(
      Animated.timing(
        scale,
        {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        },
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ),
    );

    if (!isStop) {
      breathingAnimation.start();
    }
    return () => {
      breathingAnimation.stop();
    };
  }, [isStop]);

  return (
    <Wrapper>

      {/* <View style={{ flex: 1 }} /> */}
      <Animated.View style={[styles.imgContainer ,{transform:[{scale}]}]}>
        <Image source={Logo} style={styles.img} />
      </Animated.View>

      <ActivityIndicator size={'small'} color={'white'} />
       <View style={{ flex: 2 }} />
    </Wrapper>
  );
};
const styles = StyleSheet.create({
  imgContainer: {
    width: deviceWidth * 0.7,
    height: deviceHeight * 0.6,
    //  flex:2 ,
    alignSelf: 'center', // centers it horizontally; change to 'flex-start' if you want left alignment
    //  marginBottom:"auto"
  },
  
  

  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
export default SplashScreen;
