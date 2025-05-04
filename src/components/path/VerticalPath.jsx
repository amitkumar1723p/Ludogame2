import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import Cell from './Cell';
const VerticalPath = ({cells, color}) => {
  const groupedCells = useMemo(() => {
    const groups = [];
    for (let index = 0; index < cells.length; index += 3) {
      groups.push(cells.slice(index, index + 3));  // 'i' ko 'index' se replace kiya
      console.log(index, 'index');
    }
    return groups;
  }, [cells]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '20%',
        height: '100%',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}>
        {groupedCells.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} 
          
          style={{flexDirection: 'row', width: '33.3%', height: '16.7%'}}  >
            {group.map((id, cellIndex) => (
              <Cell  
              key={`cell-${id}`}
              cell={true}
              id={id}
              color={color}
              
              
              />
              // <Text key={cellIndex}>{cell}</Text>

            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(VerticalPath) ;
