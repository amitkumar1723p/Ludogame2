import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const RoomModal = ({ visible, onClose }) => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");

  // ✅ Create Room
  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    Alert.alert("Room Created", `Player: ${playerName}`);
    // 👉 socket.emit("createRoom", { playerName })
    onClose();
  };

  // ✅ Join Room
  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomId.trim()) {
      Alert.alert("Error", "Please enter name and room ID");
      return;
    }
    Alert.alert("Joined Room", `Player: ${playerName}, Room: ${roomId}`);
    // 👉 socket.emit("joinRoom", { playerName, roomId })
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onRequestClose={onClose}
      backdropColor="black"
      backdropOpacity={0.8}
      animationIn="zoomIn"
      animationOut="zoomOut"
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎲 Create / Join Room</Text>

        {/* Player Name */}
        <TextInput
          placeholder="Enter Name"
          value={playerName}
          placeholderTextColor="#aaa"
          onChangeText={setPlayerName}
          style={styles.input}
        />

        {/* Room Id */}
        <TextInput
          placeholder="Enter Room ID"
          value={roomId}
          placeholderTextColor="#aaa"
          onChangeText={setRoomId}
          style={styles.input}
        />

        {/* Buttons */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: "#4CAF50" }]} onPress={handleCreateRoom}>
          <Text style={styles.btnText}>Create Room</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: "#2196F3" }]} onPress={handleJoinRoom}>
          <Text style={styles.btnText}>Join Room</Text>
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity style={[styles.btn, { backgroundColor: "#FF5252" }]} onPress={onClose}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RoomModal;

const styles = StyleSheet.create({
  container: {
    width: "85%",
    backgroundColor: "#1E1E2E",
    borderRadius: 20,
    padding: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    color: "white",
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
