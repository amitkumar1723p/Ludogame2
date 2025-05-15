import {View, Text, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {Colors} from '../../constants/Colors';
import {ArrowSpot, SafeSpots, StarSpots} from '../../helpers/PlotData';
import Iconicons from 'react-native-vector-icons/Ionicons';
import {RFValue} from 'react-native-responsive-fontsize';
const Cell = ({id, color}) => {
  const isSafeSpot = useMemo(() => SafeSpots.includes(id), [id]);
  const isStartSpot = useMemo(() => StarSpots.includes(id), [id]);
  const isArrowSpot = useMemo(() => ArrowSpot.includes(id), [id]);
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isSafeSpot ? color : 'white'},
      ]}>
      {isStartSpot && (
        <Iconicons name="star-outline" size={RFValue()} color="grey" />
      )}

      {isArrowSpot && (
        <Iconicons
          name="arrow-forward-outline"
          style={{
            transform: [
              {
                rotate:
                  id === 38
                    ? '180deg'
                    : id == 25
                    ? '90deg'
                    : id == 51
                    ? '-90deg'
                    : '0deg',
              },
            ],
          }}
          size={RFValue(12)}
          color={color}
        />
      )}

      <View style={[styles.pileContainer]}>
       <Text>{id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
     borderColor: Colors.borderColor,
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
