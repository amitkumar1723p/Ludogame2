import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useCallback, useState} from 'react';
import Wrapper from '../components/Wrapper';
import MenuIcon from '../assets/images/menu.png';
import MenuModal from '../components/MenuModal';
const LudoBoardScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const handleMenuPress = useCallback(() => {
    setMenuVisible(true);
  }, []);

  return (
    <Wrapper>
      <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress}>
        <Image source={MenuIcon} style={styles.menuIconImage} />
      </TouchableOpacity>

      {menuVisible && (
        <MenuModal
          onPressHide={() => setMenuVisible(false)}
          visible={menuVisible}
        />
      )}
    </Wrapper>
  );
};

export default LudoBoardScreen;
const styles = StyleSheet.create({
  menuIcon: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  menuIconImage: {
    width: 30,
    height: 40,
  },
});
