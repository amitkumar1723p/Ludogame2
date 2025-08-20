import { createSlice } from "@reduxjs/toolkit";

const initialState = {
UserCurrentRoomData :{}
};

const roomSlice = createSlice({
  name: "SoketRoomData",
  initialState,
  reducers: {
    setUserCurrentRoomData: (state, action) => {
          state.UserCurrentRoomData = action.payload || {}
       
    },
     
  },
});

export const { setUserCurrentRoomData, } = roomSlice.actions;
export default roomSlice.reducer;
