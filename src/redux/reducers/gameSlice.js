import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

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
    enablePileSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.pileSelectionPlayer = action.payload.playerNo;
    },
    unfreezeDice: (state) => {
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },
    updatePlayerPieceValue: (state, action) => {
    const { playerNo, pieceId, pos, travelCount } = action.payload;
     
    console.log(state[playerNo][0])

      
    
    }


  },
});

export const {
  updateDiceNo,
  updatePlayerChance,
  resetGame,
  enablePileSelection,
  updatePlayerPieceValue,
  unfreezeDice
} = gameSlice.actions;
export default gameSlice.reducer;
