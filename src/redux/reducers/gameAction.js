import { Alert } from "react-native"
import { selectCurrentPosition, selectDiceNo } from "./gameSelectors"
import {   announceWinner,
  disableTouch,
  unfreezeDice,
  updateFireworks,
  updatePlayerChance,
  updatePlayerPieceValue, } from './gameSlice'
import { turningPoints, victoryStart, startingPoints } from '../../helpers/PlotData'
export const handleForwardThunk = (playerNo, id, pos) => {



  return async (dispatch, getState) => {
    const state = getState()
    const plottedPieces = selectCurrentPosition(state)
    const diceNo = selectDiceNo(state);
    const piecesAtPosition = plottedPieces.filter(item => item.pos === pos);

    console.log(piecesAtPosition, "piecesAtPosition")
    let alpha = playerNo == 1 ? 'A' : playerNo == 2 ? 'B' : playerNo == 3 ? 'C' : 'D';




    const piece =
      piecesAtPosition[
      piecesAtPosition.findIndex(item => item.id.slice(0, 1) == alpha)
      ];

    console.log(piece, "PIECE")

    dispatch(disableTouch());
    let finalPath = piece.pos;
    const beforePlayerPieces = state.game[`player${playerNo}`].find(
      item => item.id == id,
    );
    console.log(beforePlayerPieces, "beforePlayerPieces")
    console.log(finalPath, "FinalPath")
    //  let finalPath = piece.pos;

    let travelCont = beforePlayerPieces.travelCont;

    console.log(diceNo, "diceNo")

    for (let i = 0; i < diceNo; i++) {
      const updatePosition = getState();
      const playerPieces = updatePosition.game[`player${playerNo}`].find(
        item => item.id == id,
      );

      let path = playerPieces.pos + 1;

      if (turningPoints.includes(path) && turningPoints[playerNo - 1] == path) {
        path = victoryStart(playerNo - 1);
      }
      if (path == 53) {
        path = 1;
      }

      finalPath = path;
      travelCont += 1;

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${playerNo}`,
          pieceId: playerPieces.id,
          pos: path,
          travelCont: travelCont,
        }),
      );

      playSound('pile_move');
      await delay(200); // consider reducing delay if possible
    }

    const updateState = getState();
    const updatePlottedPieces = selectCurrentPosition(updateState)
    const finalPlot = updatePlayerPieceValue.filter(item => item.pos == finalPath);

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
            travelCont: 0,
          }),
        );

        await delay(0, 4);
        i--;
        if (i == 0) {
          i = 52; // Reset i to 52 if it reaches 0
        }
      }

      dispatch(
        updatePlayerPieceValue({
          playerNo: `player${no}`,
          pieceId: enemyPiece.id,
          pos: 0,
          travelCont: 0,
        }),
      );

      dispatch(unfreezeDice());
      return;
    }

       // Check Six Dice

    if (diceNo == 6 || travelCont == 57) {
      dispatch(updatePlayerChance({chancePlayer: playerNo}));

      if (travelCont == 57) {
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
      let chancePlayer = playerNo + 1;
      if (chancePlayer > 4) {
        chancePlayer = 1;
      }
      dispatch(updatePlayerChance({chancePlayer}));
    }

  }



}