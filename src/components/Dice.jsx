import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import DiceRoll from '../assets/animation/diceroll.json';
import LinearGradient from 'react-native-linear-gradient';

const Dice = React.memo(() => {
  return (
    <View>
      <Text style={{color: 'green'}}>Dice</Text>
      <View style={styles.border1}>
        <LinearGradient
          style={styles.linearGradient}
          colors={['#0052be', '#5f9fcb', '#97c6c9']}
          start={{x: 0, y: 0.5}}
          end={{x: 1, y: 0.5}}>
          <View style={styles.pileContainer}>
            {/* <Image   style={styles.pileIcon} /> */}

            <View style={styles.pileIcon}>
              <Text>Diece Image </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.border2}>
        <View style={styles.diceGradient}>

 <View style={styles.diceContainer}>

 </View>


        </View>
      </View>
    </View>
  );
});
export default Dice;

const styles = StyleSheet.create({
  flexRow: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  border1: {
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: '#f0ce2c',
  },

  linearGradient: {
    padding: 1,
    borderWidth: 3,
    borderRightWidth: 0,
    borderColor: `#f0ce2c`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pileIcon: {
    width: 35,
    height: 35,
  },
  pileContainer: {
    paddingHorizontal: 3,
    paddingVertical: 10,
  },

  border2: {
    borderWidth: 3,
    padding: 1,
    backgroundColor: '#aac8ab',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderColor: '#aac8ab',
  },

  diceGradient: {
    borderWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#f0ce2c',
    justifyContent: 'center',
    alignItems: 'center',
  },

  diceContainer: {
    backgroundColor: '#e8c0c1',
    borderWidth: 1,
    borderRadius: 5,
    width: 60,
    height: 70,
    paddingHorizontal: 8,
    paddingVertical: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
