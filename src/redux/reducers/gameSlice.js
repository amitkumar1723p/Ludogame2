import {createSlice} from '@reduxjs/toolkit';
import {initialState} from './initialState';

export const gameSlice = createSlice({
  name: 'game',

  initialState: initialState,

  reducers: {
     resetGame: () => initialState,
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload.diceNo;
      state.isDiceRolled = true;
    },
    updatePlayerChance: (state, action) => {
      state.chancePlayer = action.payload.chancePlayer;
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    
  },
});

export const {updateDiceNo ,updatePlayerChance ,resetGame} = gameSlice.actions;
export default gameSlice.reducer;
