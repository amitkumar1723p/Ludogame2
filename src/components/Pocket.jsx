import { View, Text, StyleSheet, Alert } from 'react-native';
import React, { memo } from 'react';
import { Colors } from '../constants/Colors';
import Pile from './Pile';
import { startingPoints } from '../helpers/PlotData';
import { unfreezeDice, updatePlayerPieceValue } from '../redux/reducers/gameSlice';
import { useDispatch } from 'react-redux';
const Pocket = ({ color, player, data }) => {
 const dispatch = useDispatch();
  const handlePress = (value) => {

    //     Value == {id: "D4"
    // pos: 0
    // travelCount: 0}  


    let playerNo = value?.id?.slice(0, 1);
    console.log(playerNo)

    switch (playerNo) {
      case 'A':
        playerNo = 'player1';
        break;
      case 'B':
        playerNo = 'player2';
        break;
      case 'C':
        playerNo = 'player3';
        break;
      default:
        playerNo = 'player4';
        break;
    }



    dispatch(updatePlayerPieceValue({
      playerNo: playerNo,
      pieceId: value.id,
      pos: startingPoints[parseInt(playerNo.match(/\d+/)[0], 10) - 1],
      travelCount: 1,
    }))

    dispatch(unfreezeDice())
    

  }
  return (
    <View style={[styles.container, { backgroundColor: color }]}>

      <View style={styles.childFrame}>
        <View style={styles.flexRow}>
          <Plot
            handlePress={handlePress}
            pieceNo={0} player={player} color={color}


            data={data}
          />
          <Plot pieceNo={1} player={player} color={color}
            handlePress={handlePress}
            data={data}
          />
        </View>
        <View style={[styles.flexRow, { marginTop: 20 }]}>
          <Plot pieceNo={2} player={player} color={color} data={data} handlePress={handlePress} />
          <Plot pieceNo={3} player={player} color={color} data={data} handlePress={handlePress} />
        </View>
      </View>
    </View>
  );
};

export default memo(Pocket);

{
  /* <Plot /> Component  */
}

const Plot = ({ pieceNo, player, color, data, handlePress }) => {
  return (
    <View style={[styles.plot, { backgroundColor: color }]}>
      <Pile player={player} color={color} onPress={() => {

        // console.log(data[pieceNo])
        //   console.log(`data[pieceNo] : ${data[pieceNo]}`);
        //  Alert.alert(`Player${player} pieceNo ${pieceNo},`)
        handlePress(data[pieceNo])
        // Alert.alert(`PiceNO : ${pieceNo} && 
        //   data[pieceNo] : ${data[pieceNo]}`)
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.4,
    justifyContent: 'center',
    alignItems: 'center',

    width: '40%',
    height: '100%',
    borderColor: Colors.borderColor,
  },

  childFrame: {
    backgroundColor: 'white',
    borderWidth: 0.4,
    padding: 15,
    width: '70%',
    height: '70%',
    borderColor: Colors.borderColor,
  },
  flexRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    flexDirection: 'row',
  },

  plot: {
    backgroundColor: Colors.green,
    height: '80%',
    width: '36%',
    borderRadius: 50,
  },
});
