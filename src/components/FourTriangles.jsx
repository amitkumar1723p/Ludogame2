import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Colors} from '../constants/Colors';
import LottieView from 'lottie-react-native';
import Fireworks from '../assets/animation/firework.json'
const FourTriangles = ({}) => {
  return (
    <View style={styles.mainContainer}>
<LottieView  source={Fireworks} />


    </View>
  );
};

export default React.memo(FourTriangles);

const styles = StyleSheet.create({
  mainContainer: {
        alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.8,
    width: '20%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderColor: Colors.borderColor,
  },
});
