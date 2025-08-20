 <View style={{ padding: 20 }}>
        <Text style={{color:"white"}}> Create / Join Room</Text>
        <Button title="Create Room" onPress={handleCreateRoom}  disabled={!PlayerName.trim()}/>
          
          <TextInput
          placeholder="Enter Name"
          value={PlayerName}
          placeholderTextColor="white" 
          onChangeText={setPlayerName}
          style={{ borderWidth: 1, marginVertical: 10  , color:"white" }}
        />
         
 {/* // Romm Id  */}
        <TextInput
          placeholder="Enter Room ID"
          value={roomId}
          placeholderTextColor="white" 
          onChangeText={setRoomId}
          style={{ borderWidth: 1, marginVertical: 10  , color:"white" }}
        />
        <Button title="Join Room" onPress={handleJoinRoom} />
      </View>