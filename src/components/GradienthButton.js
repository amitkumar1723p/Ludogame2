import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const GradientButton = ({title, onPress, iconColor = '#d5be3e'}) => {
  const iconSize = RFValue(18);

  return (
    <View style={styles.mainContainer} onPress={onPress}>
      <TouchableOpacity activeOpacity={0.8} style={styles.btnContainer}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}>
          {title === 'RESUME' ? (
            <MaterialIcons
              name="play-arrow"
              color={iconColor}
              size={iconSize}
              style={{marginRight: 6}}
            />
          ) : title === 'NEW GAME' ? (
            <MaterialIcons
              name="play-circle"
              color={iconColor}
              size={iconSize}
            />
          ) : title === 'CPU' ? (
            <MaterialIcons name="home" color={iconColor} size={iconSize} />
          ) : (
            <MaterialIcons name="person-4" color={iconColor} size={iconSize} />
          )}
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

  btnContainer: {
    borderWidth: 2,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: '#d5be3e',
    shadowOpacity: 0.5,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 10,
    borderColor: '#d5be3e',
    width: 220,
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
  },
});

export default GradientButton;
