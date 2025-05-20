import React, { useCallback } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import GradientButton from './GradientButton';
import {resetGame} from '../redux/reducers/gameSlice';
import { useDispatch } from 'react-redux';
import { playSound } from '../helpers/SoundUtility';
import {goBack} from '../helpers/NavigationUtil';
const MenuModal = ({onPressHide, visible}) => {


   const dispatch = useDispatch()
 const handleNewGame =useCallback(()=>{
   console.log(onPressHide)
 
  

   dispatch(resetGame());
       playSound('game_start');
    onPressHide();
 }, [dispatch, onPressHide])

 const handleHome =useCallback(()=>{
  goBack();
 } ,[])

  return (
    <Modal
      style={styles.bottomModalView}
      isVisible={visible}
      onBackdropPress={onPressHide}
      onRequestClose={onPressHide}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          style={styles.gradientContainer}>
          <View style={styles.subView}>
            
            <GradientButton title={'RESUME'}   onPress ={onPressHide} />
            <GradientButton title={'NEW GAME'} onPress={handleNewGame} />

            <GradientButton title={'HOME'}  onPress={ handleHome}  />
            
             </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center',
  },

  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },

  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subView: {
    width: '100%',
    marginVertical: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
