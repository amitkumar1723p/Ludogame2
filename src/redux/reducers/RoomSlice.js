import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  UserCurrentRoomData: {}
};

const roomSlice = createSlice({
  name: 'SoketRoomData',
  initialState,
  reducers: {
    setUserCurrentRoomData: (state, action) => {
      state.UserCurrentRoomData = action.payload || {};
    },
    InterstitialAdShow: (state, action) => {
      state.showAdd = action.payload.showAdd || false;
      state.navigateScreen = action.payload.navigateScreen || undefined;
    }
  }
});

export const { setUserCurrentRoomData, InterstitialAdShow } = roomSlice.actions;
export default roomSlice.reducer;
