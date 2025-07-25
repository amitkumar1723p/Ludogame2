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


/**
 * AI या player के लिए नया position calculate करता है।
 * @param {number} pos - current position (1-52)
 * @param {number} steps - dice number
 * @param {number} playerNo - player number (1 to 4)
 * @returns {number} new position after dice move
 */

 
// ✅ Piece का नया position calculate करता है (AI और move दोनों के लिए)
export function getNewPos(pos, steps, playerNo) {
  let newPos = pos;
  for (let i = 0; i < steps; i++) {
    
    newPos++;

    // ✅ Victory track पर redirect करें अगर turning point पर पहुंचे
    if (turningPoints.includes(newPos) && turningPoints[playerNo - 1] === newPos) {
      newPos = victoryStart[playerNo - 1];
    }

    // ✅ Circular board: 52 के बाद फिर से 1
    if (newPos > 52) {
      newPos -= 52;
    }
  }
  return newPos;
}


/**
 * AI decision maker: सबसे बेहतर move return करता है
 * @param {Array} playerPieces - current AI player की pieces
 * @param {number} dice - current dice roll (1-6)
 * @param {number} playerNo - player number (1 to 4)
 * @param {Array} opponentPieces - सभी opponents की pieces
 * @returns {string|null} - best piece ID to move
 */



// ✅ Main AI Logic – Flowchart के हर step को follow करता है
export function findBestMove({ playerPieces, dice, playerNo, opponentPieces }) {
  // const movable = playerPieces.filter(p => p.pos !== 57 && p.travelCount + dice <= 57);
  const movable = playerPieces.filter(p =>
  p.pos !== 57 && p.travelCount + dice <= 57 && (p.pos !== 0 || dice === 6)
);
    
     
  if (movable.length === 0) return null;

  const isSafe = pos => SafeSpots.includes(pos) || StarSpots.includes(pos);
  let bestScore = -Infinity;
  let bestMoveId = null;


  for (let p of movable) {
     
    const newPos = getNewPos(p.pos, dice, playerNo);
     
    let score = 0;

    // ✅ Danger detection
    const isInDanger = opponentPieces.some(op => {
      if (op.pos === 0 || op.pos === 57) return false;
      const threatRange = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
      
      return threatRange.includes(p.pos) && !isSafe(p.pos);
       
    });

    // ✅ Escape to safe
    const willBeSafe = !opponentPieces.some(op => {
      const threatRange = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
       
      return threatRange.includes(newPos) && !isSafe(newPos);
      
    });

    if (isInDanger && willBeSafe) {
      score += 150; // 🛡️ PRIORITY 1: Escape Danger
    }

    // ✅ Home reached
    if (p.travelCount + dice === 57) {
      score += 100; // 🏠 PRIORITY 2: Reaching Home
     
    }

    // ✅ Unlock new piece
    if (dice === 6 && p.pos === 0) {
     
      score += 90; // 🔓 PRIORITY 3: Unlock
    }

    // ✅ Cutting opponent
    const cutEnemy = opponentPieces.find(op => op.pos === newPos && !isSafe(newPos));
    if (cutEnemy) {
       
      score += 80; // ⚔️ PRIORITY 4: Cut Enemy
    }

    // ✅ Move to Safe or Star
    if (isSafe(newPos)) {
        
      score += 60; // ⭐ PRIORITY 5
    }

    // ✅ Stack with own
    const ownStack = playerPieces.find(pp => pp.id !== p.id && pp.pos === newPos);
    if (ownStack) {
      
      score += 40; // 🌀 PRIORITY 6: Stack
    }

    // ✅ Progress based score
    score += p.travelCount * 0.5; // 🚀 PRIORITY 7: Progress
    
    // ❌ Penalty if newPos is under threat
    const willBeInDanger = opponentPieces.some(op => {
      const range = Array.from({ length: 6 }, (_, i) => (op.pos + i + 1) % 53 || 1);
      return range.includes(newPos) && !isSafe(newPos);
    });
  
    if (willBeInDanger){
     
score -= 80; // ⚠️ DANGER ZONE
    } 

    
    // 🧠 Select best scored move
    if (score > bestScore) {
      bestScore = score;
  
      bestMoveId = p.id;
    }
  }

  // ✅ If 6 and piece is locked — prefer unlocking only if no better move
  if (dice === 6) {
    const locked = playerPieces.find(p => p.pos === 0);
    if (locked && bestScore < 80) {
      return locked.id; // Unlock if nothing else is smarter
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















