import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../constants/Colors';
import LottieView from 'lottie-react-native';
import Fireworks from '../assets/animation/firework.json';
import Svg, { Polygon } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { selectFireworks } from '../redux/reducers/gameSelectors'
const FourTriangles = ({
  player1,
  player2,
  player3,
  player4 }) => {
  const size = 300;
  const isFirework = useSelector(selectFireworks)
  const [blast, setBlast] = useState(false)
  const dispatch = useDispatch()


  useEffect(() => {
    if (isFirework) {
      setBlast(true)
      const timer = setTimeout(() => {
        setBlast(false)
        dispatch(updateFireworks(false))
      }, 5000);

      return () => clearInterval(timer)

    }

  }, [dispatch, isFirework])
  return (
    <View style={styles.mainContainer}>
      <LottieView
        source={Fireworks}
        autoPlay
        loop
        hardwareAccelerationAndroid
        speed={1}
        style={styles.lottieView}
      />
      <Svg height={size} width={size - 5}>
        <Polygon
          points={`0,0 ${size / 2},${size / 2} ${size},0`}
          fill={Colors.yellow}
        />
        <Polygon
          points={`${size},0 ${size},${size} ${size / 2},${size / 2}`}
          fill={Colors.blue}
        />
        <Polygon
          points={`${size},0 ${size},${size} ${size / 2},${size / 2}`}
          fill={Colors.blue}
        />
        <Polygon
          points={`0,${size} ${size / 2},${size / 2} ${size},${size}`}
          fill={Colors.red}
        />
        <Polygon
          points={`0,0 ${size / 2},${size / 2} 0,${size}`}
          fill={Colors.green}
        />

      </Svg>


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
  lottieView: {
    width: '`100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
});
