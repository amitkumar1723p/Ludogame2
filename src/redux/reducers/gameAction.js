import { useSelector } from 'react-redux';
import {
  SafeSpots,
  StarSpots,
  startingPoints,
  turningPoints,
  victoryStart,
} from '../../helpers/PlotData';
import { playSound } from '../../helpers/SoundUtility';
import { selectCurrentPosition, selectDiceNo } from './gameSelectors';
import {
  announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue,
} from './gameSlice';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


// ✅ Position calculate करने का helper — नया पॉज़िशन निकालता है
function getNewPos(pos, steps, playerNo) {
  let newPos = pos;
  for (let i = 0; i < steps; i++) {
    newPos++;
    
    // टर्निंग पॉइंट आने पर victory track में redirect कर दो
    if (turningPoints.includes(newPos) && turningPoints[playerNo - 1] === newPos) {
      newPos = victoryStart[playerNo - 1];
    }

    // बोर्ड circular है, इसलिए 52 के बाद वापस 1 से शुरू
    if (newPos > 52) {
      newPos -= 52;
    }
  }
  return newPos;
}



// ✅ AI helper: findBestMove
// SMART AI LOGIC
// ✅ AI का दिमाग: सबसे बेस्ट मूव ढूंढता है
export function findBestMove({ playerPieces, dice, playerNo, opponentPieces }) {
  // सिर्फ वही pieces consider करो जो move कर सकते हैं (57 reached ना हो और move वैलिड हो)
  const movable = playerPieces.filter(p => p.pos !== 57 && p.travelCount + dice <= 57);
  if (movable.length === 0) return null;

  const isSafe = pos => SafeSpots.includes(pos) || StarSpots.includes(pos);

  let bestScore = -Infinity;
  let bestMoveId = null;

  for (let p of movable) {
    const newPos = getNewPos(p.pos, dice, playerNo);
    let score = 0;

    // 1️⃣ बचाव: अगर piece खतरे में है और move करके safe हो सकता है, तो high score दो
    const inDanger = opponentPieces.some(op => {
      if (op.pos === 0 || op.pos === 57) return false;
      const threatRange = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
      return threatRange.includes(p.pos) && !isSafe(p.pos);
    });

    const isEscapingDanger =
      inDanger && !opponentPieces.some(op => {
        const threatRange = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
        return threatRange.includes(newPos) && !isSafe(newPos);
      });

    if (inDanger && isEscapingDanger) score += 150; // 🔴 PRIORITY 1

    // 2️⃣ घर पहुंचाना (travelCount + dice == 57)
    if (p.travelCount + dice === 57) score += 100; // 🏠 PRIORITY 2

    // 3️⃣ नया piece unlock करना (सिर्फ तब जब ये बेहतर हो)
    if (dice === 6 && p.pos === 0) score += 90; // 🔓 PRIORITY 3

    // 4️⃣ दुश्मन को काटना (अगर वो safe spot पर ना हो)
    const willCut = opponentPieces.find(op => op.pos === newPos && !isSafe(newPos));
    if (willCut) score += 80; // ⚔️ PRIORITY 4

    // 5️⃣ safe या star spot पर जाना
    if (isSafe(newPos)) score += 60; // ⭐ PRIORITY 5

    // 6️⃣ अपने ही pile के ऊपर stack करना (defense के लिए अच्छा)
    const ownStack = playerPieces.find(pp => pp.id !== p.id && pp.pos === newPos);
    if (ownStack) score += 40; // 🌀 PRIORITY 6

    // 7️⃣ ज़्यादा चला हुआ piece को preference दो (fast progress)
    score += p.travelCount * 0.5; // 🚀 PRIORITY 7

    // 8️⃣ अगर move के बाद piece खतरे में जाएगा तो penalty दो
    const willBeInDanger = opponentPieces.some(op => {
      const dangerZone = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
      return dangerZone.includes(newPos) && !isSafe(newPos);
    });
    if (willBeInDanger) score -= 80; // ⚠️ DANGER PENALTY

    // 🔍 इस move का score compare करो और bestMoveId update करो
    if (score > bestScore) {
      bestScore = score;
      bestMoveId = p.id;
    }
  }

  // 🎲 अगर 6 आया है, और कोई piece lock है, तो unlock करो — सिर्फ तब जब बाकी कोई move valuable ना हो
  if (dice === 6) {
    const locked = playerPieces.find(p => p.pos === 0);
    if (locked && bestScore < 80) {
      return locked.id; // 🔓 Unlock priority only if no smarter option
    }
  }

  return bestMoveId;
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








export const handleForwardThunk = (playerNo, id, pos) => async (dispatch, getState) => {




  const state = getState();
  const plottedPieces = selectCurrentPosition(state);
  const diceNo = selectDiceNo(state);
  const PlayerActive = state.game.activePlayer


  const piecesAtPosition = plottedPieces.filter(item => item.pos === pos);

  let alpha = playerNo == 1 ? 'A' : playerNo == 2 ? 'B' : playerNo == 3 ? 'C' : 'D';
  const piece =
    piecesAtPosition[
    piecesAtPosition.findIndex(item => item.id.slice(0, 1) == alpha)
    ];

  dispatch(disableTouch());
  let finalPath = piece.pos;

  const beforePlayerPieces = state.game[`player${playerNo}`].find(
    item => item.id == id,
  );

  let travelCount = beforePlayerPieces.travelCount;

  for (let i = 0; i < diceNo; i++) {
    const updatePosition = getState();
    const playerPiece = updatePosition.game[`player${playerNo}`].find(
      item => item.id == id,
    );

    let path = playerPiece.pos + 1;

    if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
      path = victoryStart[playerNo - 1];
    }
    if (path == 53) {
      path = 1;
    }

    finalPath = path;
    travelCount += 1;

    dispatch(
      updatePlayerPieceValue({
        playerNo: `player${playerNo}`,
        pieceId: playerPiece.id,
        pos: path,
        travelCount: travelCount,
      }),
    );

    playSound('pile_move');
    await delay(200); // ✅ FIXED: valid delay
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
          travelCount: 0,
        }),
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
        travelCount: 0,
      }),
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


  }
  else {
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















