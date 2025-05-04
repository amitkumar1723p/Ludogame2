import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import {Colors} from '../../constants/Colors';

const Cell = ({id ,color}) => {
  return (
    <View style={[styles.container ,
    
    {backgroundColor:"white" // ye css cusom add i hai


    }]}>
      {/* <View style={[styles.pileContainer]}>

       
      </View> */}
    </View>
  )
}

const styles= StyleSheet.create({
    container:{
        borderWidth: 0.4,
        // borderColor: Colors.borderColor, orignal
        borderColor: "red", // fake
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default Cell