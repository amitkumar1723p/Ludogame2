import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlayerOption = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={['#ff9966', '#ff5e62']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientBtn}>
      <Icon name={iconName} size={22} color="white" style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const OfflinePlayerModal = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
     onRequestClose={onClose}
      backdropColor="black"
      backdropOpacity={0.7}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modal}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#141E30', '#243B55']}
          style={styles.gradientContainer}>
          <Text style={styles.title}>Choose Players</Text>

          <PlayerOption title="2 Players" iconName="account-multiple-outline" onPress={() => onSelect(2)} />
          <PlayerOption title="3 Players" iconName="account-group-outline" onPress={() => onSelect(3)} />
          <PlayerOption title="4 Players" iconName="account-group" onPress={() => onSelect(4)} />

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default OfflinePlayerModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientContainer: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    width: '85%',
    marginVertical: 8,
    borderRadius: 15,
    overflow: 'hidden',
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  closeBtn: {
    marginTop: 15,
    padding: 10,
  },
  closeText: {
    color: 'silver',
    fontSize: 14,
  },
});
