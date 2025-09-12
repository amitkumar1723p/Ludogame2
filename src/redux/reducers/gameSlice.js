import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

export const gameSlice = createSlice({
  name: 'game',

  initialState: initialState,

  reducers: {
    // resetGame: () => initialState,

    resetGame: (state, action) => {
      const { PlayerActive, gameType } = action.payload || {};

      return {
        ...initialState,
        activePlayer: PlayerActive || [1, 2, 3, 4],
        gameType: gameType || 'default'
      };
    },
    updateDiceNo: (state, action) => {
      state.diceNo = action.payload.diceNo;

      state.isDiceRolled = true;
    },

    //  Winner code
    announceWinner: (state, action) => {
      state.winner = action.payload;
    },
    updateFireworks: () => {
      state.fireworks = action.payload;
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
    unfreezeDice: state => {
      state.touchDiceBlock = false;
      state.isDiceRolled = false;
    },

    enableCellSelection: (state, action) => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = action.payload.playerNo;
    },
    updatePlayerPieceValue: (state, action) => {
      const { playerNo, pieceId, pos, travelCount } = action.payload;

      const playerPieces = state[playerNo];
      const piece = playerPieces.find(p => p.id === pieceId);
      state.pileSelectionPlayer = -1; //pile disable

      if (piece) {
        piece.pos = pos;
        piece.travelCount = travelCount;

        const currentPositionIndex = state.currentPositions.findIndex(
          p => p.id === pieceId
        );

        if (pos == 0) {
          // If the piece is going back to home/start, remove it from current positions

          if (currentPositionIndex !== -1) {
            state.currentPositions.splice(currentPositionIndex, 1);
          }
        } else {
          // Otherwise, update or add it in the current positions

          if (currentPositionIndex !== -1) {
            state.currentPositions[currentPositionIndex] = {
              id: pieceId,
              pos,
              travelCount
            };
          } else {
            state.currentPositions.push({ id: pieceId, pos, travelCount });
          }
        }
      }
    },
    disableTouch: state => {
      state.touchDiceBlock = true;
      state.cellSelectionPlayer = -1;
      state.pileSelectionPlayer = -1;
    },

    PlayActivePlayer: (state, action) => {
      state.activePlayer = action.payload.PlayingActivePlayer;
      state.gameType = action.payload.gameType;
    },

    ManageActivePlayer: (state, action) => {
      state.activePlayer = action.payload;
    }
  }
});

export const {
  updateDiceNo,
  updatePlayerChance,
  resetGame,
  enablePileSelection,
  updatePlayerPieceValue,
  unfreezeDice,
  disableTouch,
  enableCellSelection,
  updateFireworks,
  announceWinner,
  PlayActivePlayer,
  ManageActivePlayer
} = gameSlice.actions;
export default gameSlice.reducer;
