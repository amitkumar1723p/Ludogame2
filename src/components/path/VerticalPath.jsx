import {View, Text} from 'react-native';
import React, {useMemo} from 'react';

const VerticalPath = ({cells, color}) => {
  const groupedCells = useMemo(() => {
    const groups = [];
    for (let index = 0; index < cells.length; index += 3) {
      groups.push(cells.slice(i, i + 3));
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
        stylel={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}>
          <Text>Hello</Text>
        {/* {groupedCells.map((groups, groupIndex) => (
          <View>
            <Text>Hllo</Text>
          </View>
        ))} */}
      </View>
    </View>
  );
};

export default VerticalPath;
