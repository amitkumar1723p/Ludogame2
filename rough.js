// ... (existing imports)
import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helpers/PlotData';
import { playSound } from '../../helpers/SoundUtility';
import {
  selectCurrentPosition,
  selectDiceNo,
} from './gameSelectors';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// ✅ AI helper: getNewPos
function getNewPos(pos, steps, playerNo) {
  let newPos = pos;
  for (let i = 0; i < steps; i++) {
    newPos++;
    if (
      turningPoints.includes(newPos) &&
      turningPoints[playerNo - 1] === newPos
    ) {
      newPos = victoryStart[playerNo - 1];
    }
    if (newPos > 52) {
      newPos -= 52;
    }
  }
  return newPos;
}

// ✅ AI helper: findBestMove
export function findBestMove({ playerPieces, dice, playerNo, opponentPieces }) {
  const movable = playerPieces.filter(p => p.pos !== 57 && p.travelCount + dice <= 57);

  const isSafe = pos => SafeSpots.includes(pos) || StarSpots.includes(pos);

  // 1. Try to cut
  for (let p of movable) {
    const newPos = getNewPos(p.pos, dice, playerNo);
    const willCut = opponentPieces.find(op => op.pos === newPos && !isSafe(newPos));
    if (willCut) return p.id;
  }

  // 2. Try to reach home
  const home = movable.find(p => p.travelCount + dice === 57);
  if (home) return home.id;

  // 3. Unlock new piece
  if (dice === 6) {
    const locked = playerPieces.find(p => p.pos === 0);
    if (locked) return locked.id;
  }

  // 4. Go to safe spot
  const safe = movable.find(p => isSafe(getNewPos(p.pos, dice, playerNo)));
  if (safe) return safe.id;

  // 5. Default fallback
  return movable[0]?.id;
}

// ✅ (Already included) checkWinningCriteria remains same
function checkWinningCriterial(pieces) {
  for (const piece of pieces) {
    if (piece.travelCount < 57) {
      return false;
    }
  }
  return true;
}

// ✅ Your existing thunk: handleForwardThunk stays as-is (no changes needed)
// ✅ Just import and use findBestMove where required
