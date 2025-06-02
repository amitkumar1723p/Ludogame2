import { Alert } from "react-native"
import { selectCurrentPosition, selectDiceNo } from "./gameSelectors"
import { disableTouch } from './gameSlice'
import {turningPoints} from '../../helpers/PlotData'
export const handleForwardThunk = (playerNo, id, pos) => {



  return (dispatch, getState) => {
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

    // dispatch(disableTouch());
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
      console.log(updatePosition, "updatePosition")
      // const playerPieces = updatePosition.game[`player${playerNo}`].find(
      //   item => item.id == id,
      // );
      //    let path = playerPieces.pos + 1;

      console.log(id, "id")

      const playerPieces = updatePosition.game[`player${playerNo}`].find(
        item => item.id == id,
      );

       let path = playerPieces.pos + 1;
 console.log(playerNo ,"playerNo")
       if(turningPoints.includes(path) ){

       }
    //  console.log(path,"path")
    }

   
  }



}