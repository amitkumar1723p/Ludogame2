import { View, Text } from 'react-native'
import React, { useMemo } from 'react'

const HorizontalPath = () => {
const groupedCells =useMemo(({cells ,color})=>{
  const groups =[]

  for (let index = 0; index < cells.length; index+= 6) {
    groups.push(cells.slice(index, index + 6));
    
  }
  return groups;
} ,[cells])

  return (
    <View  
    
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      width: '40%',
      height: '100%',
    }}
    >
      <Text>HorizontalPath</Text>
    </View>
  )
}

export default React.memo(HorizontalPath) ;