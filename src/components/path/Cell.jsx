import {View, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {Colors} from '../../constants/Colors';
import {ArrowSpot, SafeSpots, StarSpots} from '../../helpers/PlotData';

const Cell = ({id, color}) => {
  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isSafeSpot ? color : 'white'},
      ]}>
      <View style={[styles.pileContainer]}>
        <Text>{id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    // borderColor: Colors.borderColor, orignal
    borderColor: 'red', // fake
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pileContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 99,
  },
});
export default Cell;
