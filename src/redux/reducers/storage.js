import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },

  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  }
};



// Online Game STorage


export const saveRoomData = (room) => {
  storage.set('room', room);
  // storage.set('playerId', playerId);
};

export const getRoomData = () => {
  return {
    roomId: storage.getString('roomId'),
    playerId: storage.getString('playerId')
  };
};

export const clearRoomData = () => {
  storage.delete('roomId');
  storage.delete('playerId');
};



export default reduxStorage;
