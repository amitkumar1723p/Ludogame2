
import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',

  initialState: initialState,

  reducers: {
    updateDiceNo: (state, action) => {
      console.log('reducer', action.payload);

      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = true;
    },
  },
});

export const {updateDiceNo} = gameSlice.actions;
export default gameSlice.reducer;
