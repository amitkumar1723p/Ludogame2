import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from "react-native";
import Modal from "react-native-modal";
import { getSocket } from '../socket/socket.js'
import { navigate } from '../helpers/NavigationUtil';
import { useNavigation } from "@react-navigation/native";
import { saveRoomData } from "../redux/reducers/storage.js";
import { useDispatch } from "react-redux";
import { setUserCurrentRoomData } from "../redux/reducers/RoomSlice.js";


const RoomModal = ({ visible, onClose }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const socket = getSocket()
    const [PlayerName, setPlayerName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [Loading, setLoading] = useState(false)

    // ✅ Create Room
    const handleCreateRoom = () => {

        console.log(socket, "socket")

        if (!PlayerName.trim()) {
            Alert.alert("Error", "Please enter your name");
            return;
        }
        setLoading(true)
        if (!socket) {
            Alert.alert("Error", "Please Click Again  Online Button");
            onClose()
        }


        socket.emit('createRoom', { isNew: true, maxPlayers: 4, PlayerName }, (response) => {

            setLoading(false)
            if (response.success) {


                //  saveRoomData(response.room || {} );

                // dispatch(setUserCurrentRoomData(response.room))
                navigation.navigate('RoomScreen', { RoomData: response.room });

                // onClose();
            } else {

                Alert.alert(response.error || 'Failed to create room');
            }
        });
    };

    // ✅ Join Room
    const handleJoinRoom = () => {
        if (!PlayerName.trim() || !roomId.trim()) {
            Alert.alert("Error", "Please enter name and room ID");
            return;
        }
        setLoading(true)
        socket.emit('joinRoom', { roomId, isNew: false, PlayerName }, (response) => {
            setLoading(false)
            if (response.success) {
                    //   dispatch(setUserCurrentRoomData(response.room))
                navigation.navigate('RoomScreen', { RoomData: response.room });
                
            } else {

                Alert.alert(response.error || 'Failed to join room');
            }
        });


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
            avoidKeyboard={true} // ✅ react-native-modal ka option
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1, justifyContent: "center" }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        <Text style={styles.title}>🎲 Create / Join Room</Text>

                        {/* Player Name */}
                        <TextInput
                            placeholder="Enter Name"
                            value={PlayerName}
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
                        <TouchableOpacity
                            disabled={Loading}
                            style={[styles.btn, { backgroundColor: "#4CAF50" }]}
                            onPress={handleCreateRoom}
                        >
                            <Text style={styles.btnText}>Create Room</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={Loading}
                            style={[styles.btn, { backgroundColor: "#2196F3" }]}
                            onPress={handleJoinRoom}
                        >
                            <Text style={styles.btnText}>Join Room</Text>
                        </TouchableOpacity>

                        {/* Close Button */}
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: "#FF5252" }]}
                            onPress={onClose}
                        >
                            <Text style={styles.btnText}>Cancel</Text>
                        </TouchableOpacity>
                        {Loading && <Text style={{ color: 'white', textAlign: 'center' }} onPress={() => { setLoading(false) }}>Loading....</Text>}
                    </View>



                </ScrollView>
            </KeyboardAvoidingView>
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
