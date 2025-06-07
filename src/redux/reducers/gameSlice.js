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

    //  Winner code  
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    updateFireworks :()=>{

    }
       ,
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

    enableCellSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = action.payload.playerNo;
    },
    updatePlayerPieceValue: (state, action) => {
      const { playerNo, pieceId, pos, travelCount   } = action.payload;
        console.log(playerNo ,pieceId ,pos ,travelCount,"piececd" ,"pos" ,"Player")
      const playerPieces = state[playerNo];
      const piece = playerPieces.find(p => p.id === pieceId);
      state.pileSelectionPlayer = -1; //pile disable



      if (piece) {
        piece.pos = pos;
        piece.travelCount = travelCount;


        const currentPositionIndex = state.currentPositions.findIndex(p => p.id === pieceId)


        if (pos == 0) {

          // If the piece is going back to home/start, remove it from current positions

          if (currentPositionIndex !== -1) {
            state.currentPositions.splice(currentPositionIndex, 1)
          }
        } else {
          // Otherwise, update or add it in the current positions

          if (currentPositionIndex !== -1) {
            state.currentPositions[currentPositionIndex] = { id: pieceId, pos };
          } else {
            state.currentPositions.push({ id: pieceId, pos });
          }
        }
      }

    },
    disableTouch: state => {

      state.touchDiceBlock = true;
      state.cellSelectionPlayer = -1
      state.pileSelectionPlayer = -1
    }


  },
});

export const {
  updateDiceNo,
  updatePlayerChance,
  resetGame,
  enablePileSelection,
  updatePlayerPieceValue,
  unfreezeDice,
  disableTouch,
  enableCellSelection
} = gameSlice.actions;
export default gameSlice.reducer;
