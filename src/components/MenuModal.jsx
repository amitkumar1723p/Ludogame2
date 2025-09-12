import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import GradientButton from './GradientButton';
import { resetGame } from '../redux/reducers/gameSlice';
import { useDispatch, useSelector } from 'react-redux';
import { playSound } from '../helpers/SoundUtility';
import { goBack, resetAndNavigate } from '../helpers/NavigationUtil';
import RoomModal from './RoomModal';

import { connectSocket, getSocket } from '../socket/socket.js'; // 👈 import
import { useRoute } from '@react-navigation/native';
import OfflinePlayerModal from './PlayerModal.jsx';

const MenuModal = ({ onPressHide, visible, ModalType, startGame }) => {
  const route = useRoute();
  const { roomId } = route.params || {};
  const socket = getSocket();

  const gameType = useSelector(state => state.game.gameType);
  const PlayerActive = useSelector(state => state.game?.activePlayer);
  const dispatch = useDispatch();
  const handleNewGame = useCallback(() => {
    dispatch(resetGame({ PlayerActive, gameType }));

    playSound('game_start');
    onPressHide();
  }, [dispatch, onPressHide]);

  const handleHome = useCallback(() => {
    goBack();
  }, []);

  const [OfflinePlayerModeModalVisible, setOfflinePlayerModeModalVisible] =
    useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [Loading, setLoading] = useState(false);

  const onSelect = count => {
    let acivePlayer = [];

    if (count === 2) {
      acivePlayer = [1, 3]; // 2 player opposite seats
    } else {
      acivePlayer = Array.from({ length: count }, (_, i) => i + 1);
    }

    startGame({ isNew: true, PlayerActive: acivePlayer });
  };

  return (
    <Modal
      style={styles.bottomModalView}
      isVisible={visible}
      onBackdropPress={onPressHide}
      onRequestClose={onPressHide}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#0f0c29', '#302b63', '#24243e']}
          style={styles.gradientContainer}
        >
          <View style={styles.subView}>
            {ModalType == 'HomeModal' ? (
              <>
                <GradientButton
                  title={'Online'}
                  disable={Loading}
                  onPress={() => {
                    // setModalVisible(true)
                    setLoading(true);
                    //                setTimeout(() => {
                    const socket = connectSocket(); // 👈 connect to backend

                    if (socket) {
                      setModalVisible(true);
                      setLoading(false);
                    }
                    setLoading(false);
                  }}
                />
                <GradientButton
                  title={'Offline'}
                  onPress={() => {
                    setOfflinePlayerModeModalVisible(true);
                    // startGame({ isNew: true, PlayerActive: [1, 2, 3, 4] });
                  }}
                />
              </>
            ) : ModalType == 'OnlineGameModal' ? (
              <GradientButton
                title={'Left Game'}
                onPress={() => {
                  socket.emit('leaveRoom', { roomId });
                  setModalVisible(false);
                  dispatch(resetGame({}));
                  resetAndNavigate('HomeScreen');
                }}
              />
            ) : (
              <>
                <GradientButton title={'RESUME'} onPress={onPressHide} />
                <GradientButton title={'NEW GAME'} onPress={handleNewGame} />

                <GradientButton title={'HOME'} onPress={handleHome} />
              </>
            )}
            {Loading && (
              <Text style={{ color: 'white' }}>
                Wait STablish connection .....
              </Text>
            )}
          </View>
        </LinearGradient>

        <OfflinePlayerModal
          visible={OfflinePlayerModeModalVisible}
          onClose={() => {
            setOfflinePlayerModeModalVisible(false);
          }}
          onSelect={onSelect}
        />
        <RoomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </Modal>
  );
};

export default MenuModal;

const styles = StyleSheet.create({
  bottomModalView: {
    justifyContent: 'center',
    width: '95%',
    alignSelf: 'center'
  },

  modalContainer: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center'
  },

  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '96%',
    borderWidth: 2,
    borderColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center'
  },
  subView: {
    width: '100%',
    marginVertical: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
