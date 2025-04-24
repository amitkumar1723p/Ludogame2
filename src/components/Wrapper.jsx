import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import React, {Children} from 'react';
import BG from '../assets/images/bg.jpeg';
import {deviceHeight, deviceWidth} from '../constants/Scaling.js';
import {SafeAreaView} from 'react-native-safe-area-context';

const Wrapper = ({children, style}) => {
  console.log('children', children);
  console.log('style', style);
  return (
    <ImageBackground source={BG} resizeMode="cover" style={styles.container}>
      <SafeAreaView style={[styles.SafeAreaView, style]}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  SafeAreaView: {flex: 1, height: deviceHeight, width: deviceWidth ,justifyContent:"center" ,alignItems:"center"},
});
export default Wrapper;
