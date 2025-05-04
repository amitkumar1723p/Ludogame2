import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
const iconSize = RFValue(18);

const GradientButton = ({title}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity activeOpacity={0.8} 
        style={styles.btnContainer} 
       >
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
  } ,


   btnContainer :{
    borderWidth: 2,
    borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
     backgroundColor: 'white',
    shadowColor: '#d5be3e' ,
    shadowOpacity: 0.5,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 10,
    borderColor: '#d5be3e',
    width: 220,
   }
  
});
export default GradientButton;
