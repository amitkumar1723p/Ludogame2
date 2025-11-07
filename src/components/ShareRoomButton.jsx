import React from 'react';
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 📦 install if not installed

// 👉 Run this if you haven't already:
// npm install react-native-vector-icons
// (For Expo: already included by default)

const ShareRoomButton = ({ roomId }) => {
  const handleShare = async () => {
    if (!roomId) return;

    const message = `${roomId}`;

    try {
      await Share.share({
        message,
        title: 'Play Ludo - Invite your friends 🎯'
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Icon
          name="share-social-outline"
          size={22}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.text}>Share Room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShareRoomButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#128C7E', // Play Ludo theme green (WhatsApp style)
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
