import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
const iconSize = RFValue(18);

const GradientButton = ({title}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity activeOpacity={0.8} >
        <LinearGradient
        style={styles.button}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={['#4c669f', '#3b5998', '#192f6a']}>
       <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: RFValue(16),
    width: '70%',
    textAlign: 'left',
    fontFamily: 'philosopher-Bold',
  },
  button: { 
    paddingVertical: 0,
    width: '100%',
    borderRadius: 5,
    borderWidth: 2,
    height: '45',
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }

  
});
export default GradientButton;
