import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import Cell from './Cell';

const HorizontalPath = ({cells = [], color}) => {
  const groupedCells = useMemo(() => {
    const groups = [];

    for (let index = 0; index < cells?.length; index += 6) {
      groups.push(cells.slice(index, index + 6));
    }
    return groups;
  }, [cells]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '40%',
        height: '100%',
      }}>
      <View style={{flexDirection: 'column', width: '100%', height: '100%'}}>
        {groupedCells.map((group, groupIndex) => (
          <View
            key={`group-${groupIndex}`}
            style={{flexDirection: 'row', height: '33.3%', width: '16.7%'}}>
            {group.map((id, cellIndex) => (
              <Cell key={`cell-${id}`} cell={true} id={id} color={color} />
              // <Text key={cellIndex}>{cell}</Text>
            ))}
          </View>
        ))}{' '}
      </View>
    </View>
  );
};

export default React.memo(HorizontalPath);
