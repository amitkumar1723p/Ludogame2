import {View, Text, StyleSheet} from 'react-native';
import React, {memo} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Pile from './Pile';

const Pocket = ({color, player}) => {
  return (
    <View style={[styles.container, {backgroundColor: color}]}>
      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot pieceNo={0} player={player} color={color} />
          <Plot pieceNo={1} player={player} color={color} />
        </View>
        <View style={[styles.flexRow, {marginTop: 20}]}>
          <Plot pieceNo={2} player={player} color={color} />
          <Plot pieceNo={3} player={player} color={color} />
        </View>
      </View>
    </View>
  );
};

export default memo(Pocket);

{
  /* <Plot /> Component  */
}

const Plot = ({pieceNo, player, color}) => {
  return (
    <View style={[styles.plot, {backgroundColor: color}]}>
      <Pile player={player} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: '100%',
    borderColor: Colors.borderColor,
  },

  childFrame: {
    backgroundColor: 'white',
    borderWidth: 0.4,
    padding: 15,
    width: '70%',
    height: '70%',
    borderColor: Colors.borderColor,
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    flexDirection: 'row',
  },

  plot: {
    backgroundColor: Colors.green,
    height: '80%',
    width: '36%',
    borderRadius: 50,
  },
});
