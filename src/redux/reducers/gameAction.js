import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart
} from '../../helpers/PlotData';
import { playSound } from '../../helpers/SoundUtility';
import { selectCurrentPosition, selectDiceNo } from './gameSelectors';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 📌 Ludo board पर नया position calculate करता है
 * @param {number} pos - current position (1-52 or 0)
 * @param {number} steps - dice number (1-6)
 * @param {number} playerNo - player number (1 to 4)
 * @returns {number} - new position after dice move
 */

export function getNewPos(pos, steps, playerNo) {
  let newPos = pos;
  for (let i = 0; i < steps; i++) {
    newPos++;
    if (
      turningPoints.includes(newPos) &&
      turningPoints[playerNo - 1] === newPos
    ) {
      newPos = victoryStart[playerNo - 1];
    }
    if (newPos > 52) newPos -= 52;
  }
  return newPos;
}

/**
 * 🧠 Final unbeatable Ludo AI move-decider
 */
export function findBestMoveUnbeatable({
  playerPieces,
  dice,
  playerNo,
  opponentPieces,
  allOpponentsActive
}) {
  const isSafe = pos => SafeSpots.includes(pos) || StarSpots.includes(pos);

  const getDangerZone = pos =>
    Array.from({ length: 6 }, (_, i) => (pos - i - 1 + 52) % 52 || 52);

  const movable = playerPieces.filter(
    p =>
      p.pos !== 57 && p.travelCount + dice <= 57 && (p.pos !== 0 || dice === 6)
  );

  if (!movable.length) return null;

  let bestScore = -Infinity;
  let bestMove = null;

  movable.sort((a, b) => b.travelCount - a.travelCount); // सबसे आगे वाली piece पहले

  for (const piece of movable) {
    const newPos = getNewPos(piece.pos, dice, playerNo);
    let score = 0;

    const dangerBehind = opponentPieces.some(
      op =>
        op.pos !== 0 &&
        op.pos !== 57 &&
        getDangerZone(piece.pos).includes(op.pos) &&
        !isSafe(piece.pos)
    );

    const willEscape = !opponentPieces.some(
      op => getDangerZone(newPos).includes(op.pos) && !isSafe(newPos)
    );

    // 1️⃣ Reach Home
    if (piece.travelCount + dice === 57) score += 200;

    // 2️⃣ Continue progressing if safe
    if (!dangerBehind) score += piece.travelCount * 1.5;

    // 3️⃣ Escape from danger
    if (dangerBehind && willEscape) score += 150;

    // 4️⃣ Cut opponent
    const cut = opponentPieces.find(op => op.pos === newPos && !isSafe(newPos));
    if (cut) score += 100;

    // 5️⃣ Unlock if no danger
    if (dice === 6 && piece.pos === 0) {
      const anyUnlockedInDanger = playerPieces.some(
        p =>
          p.pos !== 0 &&
          opponentPieces.some(
            op => getDangerZone(p.pos).includes(op.pos) && !isSafe(p.pos)
          )
      );
      if (!anyUnlockedInDanger) score += 80;
      else score -= 80;
    }

    // 6️⃣ Safe / Star spot
    if (isSafe(newPos)) score += 60;

    // 7️⃣ Stack with own
    const stack = playerPieces.find(p => p.id !== piece.id && p.pos === newPos);
    if (stack) score += 40;

    // 8️⃣ Enemy door danger
    for (const enemy of allOpponentsActive) {
      const door = startingPoints[enemy.playerNo - 1];
      if (newPos === door) score -= 120;
    }

    // 9️⃣ Prioritize escaping progressing piece
    if (dangerBehind && piece.travelCount > 30) score += 25;

    if (score > bestScore) {
      bestScore = score;
      bestMove = piece.id;
    }
  }

  return bestMove;
}

// ✅ travelCount check fix — don't return true inside loop
function checkWinningCriterial(pieces) {
  for (const piece of pieces) {
    if (piece.travelCount < 57) {
      return false;
    }
  }
  return true;
}

export const handleForwardThunk =
  (playerNo, id, pos) => async (dispatch, getState) => {
    const state = getState();
    const plottedPieces = selectCurrentPosition(state);
    const diceNo = selectDiceNo(state);
    const PlayerActive = state.game.activePlayer;

    const piecesAtPosition = plottedPieces.filter(item => item.pos === pos);

    let alpha =
      playerNo == 1 ? 'A' : playerNo == 2 ? 'B' : playerNo == 3 ? 'C' : 'D';
    const piece =
      piecesAtPosition[
        piecesAtPosition.findIndex(item => item.id.slice(0, 1) == alpha)
      ];

    dispatch(disableTouch());
    let finalPath = piece.pos;

    const beforePlayerPieces = state.game[`player${playerNo}`].find(
      item => item.id == id
    );

    let travelCount = beforePlayerPieces.travelCount;

    for (let i = 0; i < diceNo; i++) {
      const updatePosition = getState();
      const playerPiece = updatePosition.game[`player${playerNo}`].find(
        item => item.id == id
      );

      if (!playerPiece) break; // 🧠 safety check — agar piece mil hi nahi raha toh loop se bahar

      let path = playerPiece.pos + 1;

      // 🌀 Turning point condition
      if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
        path = victoryStart[playerNo - 1];
      }

      // 🏁 If piece reached end path
      if (path > 52 || path === 53) {
        path = 1;
        break; // ✅ stop loop if path exceeds board range
      }

      finalPath = path;
      travelCount += 1;

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPiece.id,
          pos: path,
          travelCount: travelCount
        })
      );

      playSound('pile_move');

      await delay(200);

      // ✅ optional: agar kisi reason se stop karna hai (example — reached goal)
      if (travelCount >= diceNo) {
        break;
      }
    }

    // ✅ Update state after movement
    const updateState = getState();
    const updatePlottedPieces = selectCurrentPosition(updateState);

    const finalPlot = updatePlottedPieces.filter(item => item.pos == finalPath);
    const ids = finalPlot?.map(item => item.id[0]);
    const uniqueIds = new Set(ids);
    const areDifferentIds = uniqueIds.size > 1;

    if (SafeSpots.includes(finalPath) || StarSpots.includes(finalPath)) {
      playSound('safe_spot');
    }

    if (
      areDifferentIds &&
      !SafeSpots.includes(finalPlot[0].pos) &&
      !StarSpots.includes(finalPlot[0].pos)
    ) {
      const enemyPiece = finalPlot.find(piece => piece.id[0] !== id[0]);

      const enemyId = enemyPiece.id[0];
      let no = enemyId == `A` ? 1 : enemyId == `B` ? 2 : enemyId == 'C' ? 3 : 4;

      let backwardPath = startingPoints[no - 1];
      let i = enemyPiece.pos;

      playSound('collide');

      while (i !== backwardPath) {
        dispatch(
          updatePlayerPieceValue({
            playerNo: `player${no}`,
            pieceId: enemyPiece.id,
            pos: i,
            travelCount: 0
          })
        );

        await delay(0.4); // ✅ FIXED: valid delay
        i--;
        if (i == 0) {
          i = 52;
        }
      }

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${no}`,
          pieceId: enemyPiece.id,
          pos: 0,
          travelCount: 0
        })
      );

      dispatch(unfreezeDice());
      return;
    }

    // ✅ Dice 6 or Reached home
    if (diceNo == 6 || travelCount == 57) {
      dispatch(updatePlayerChance({ chancePlayer: playerNo }));

      if (travelCount == 57) {
        playSound('home_win');
        const finalPlayerState = getState();
        const playerAllPieces = finalPlayerState.game[`player${playerNo}`];

        if (checkWinningCriterial(playerAllPieces)) {
          dispatch(announceWinner(playerNo));
          playSound('cheer', true);
          return;
        }

        dispatch(updateFireworks(true));
        dispatch(unfreezeDice());
        return;
      }
    } else {
      // ✅ FIXED: turn rotation working for 1 → 2 → 3 → 4 → 1
      // let chancePlayer = playerNo + 1;
      // if (chancePlayer > 4) {
      //   chancePlayer = 1;
      // }

      let currentIndex = PlayerActive.indexOf(playerNo);
      let nextIndex = (currentIndex + 1) % PlayerActive.length;

      let chancePlayer = PlayerActive[nextIndex];

      dispatch(updatePlayerChance({ chancePlayer }));
    }
  };
