// ARENSEE - React Native Chess
//
// If you have just cloned the repo, you need to run (from repo root "arensee"):
//
// npm install
// npx patch-package
// rm ./node_modules/react-native-draggable/Draggable.js
//
// That "npx patch-package" fixes react-native-draggable's broken
//  "shouldReverse" feature. As things stand in the repo, the promised
//  "onReverse" callback doesn't ever run. The patch also removes the
//  gimmicky snap-back animation.
//
// You may also need something like:
//
//  echo sdk.dir=$ANDROID_SDK_ROOT > ./android/local.properties
//
// By default the user will play against the computer. To build for 2 players (or 0)
//  you will need to edit Constants.js.
//
import React, {useState, useEffect, Component } from 'react';
import {Game} from './Game';
import Constants from './Constants';
import Movement from './Movement';
import Pawn from './Pawn';
import Queen from './Queen';

// Outermost "App" component- the place to which state is "lifted up" and where check and mate are detected
const App = ()=>{
    const [boardState, setBoardState] = useState(Constants.StartingBoard())
    const [moveCount, setMoveCount] = useState(0)
    const [modalVisible, setModalVisible]=useState(undefined);

    const isChecked = (blackness)=> {
        //Find king of the color that might be checked.
        const k=boardState.filter((t,i)=>t.blackness==blackness && t.kingness && !t.deadness)[0];
        let returnable = false;
        if(k) {
            // Look for a piece of the opposite color that can move where the king is.
            returnable=
                boardState.filter((t)=>!t.deadness).some(
                    (t,i)=>t.blackness!=blackness && (t.x!=k.x || t.y!=k.y) && t.canMove(t.blackness,t.x,t.y,k.x,k.y,boardState));
        }
        return returnable;
    }

    // Answers question "Does move of piece n to (x,y) cause check?". We can check for own-color check (opponent=false)
    //  or other-color check (opponent=true). 
    const causesCheck = (n, x, y, opponent)=> {
        //Construct next board state so we can simulate the move to gauge impact
        let prime=[...boardState]
        
        //Find moving piece
        const movingPiece = prime.filter(t=>t.n==n)[0]
        
        //Capture anything already where it's moving to 
        const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != movingPiece.blackness && !t.deadness)
        if(enemy.length==1) { enemy[0].deadness=true; }

        //Check for and enforce capture en passant
        const {enpassant,capturedX,capturedY} =
              Pawn.EnPassant(movingPiece.blackness, movingPiece.pawnness, movingPiece.x, movingPiece.y, x, y, boardState) 
        if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }

        //Move is performed hypothetically so we save state of piece n
        let savex=movingPiece.x;
        let savey=movingPiece.y;
        movingPiece.x=x;
        movingPiece.y=y;

        //Get a verdict
        let returnable = isChecked(opponent ? !movingPiece.blackness : movingPiece.blackness);

        //Restore state
        movingPiece.x=savex;
        movingPiece.y=savey;
        if(enemy.length==1) { enemy[0].deadness=false; }
        if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }
        setBoardState(prime)
        
        return returnable
    }

    const causesSelfCheck = (n, x, y)=> causesCheck(n,x,y,false)
    
    const causesEnemyCheck = (n, x, y)=> causesCheck(n,x,y,true)

    // E.g. at game end
    const ResetBoard = ()=>{
        setBoardState(Constants.StartingBoard())
        setMoveCount(0)
    }

    // Piece move handler
    //
    // Beyond mutating board state, this is also the locus of some bookkeeping code (marking dirty,
    //  notating two-square pawn moves for subsequnet en passant) and the place where illegal
    //  self-checking moves by human players are rejected (in which case param "prechecked" is false...
    //  the computer's chess engine will already have filtered out any self-checking moves as part of
    //  its analysis).
    const movePiece = (n, x, y, prechecked)=> {

        //Construct new board state
        let prime=[...boardState]

        //Get piece n, the moving piece
        const movingPiece = prime.filter(t=>t.n==n)[0]

        //Capture anything there
        const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != movingPiece.blackness && !t.deadness)
        if(enemy.length==1) { enemy[0].deadness=true; }

        //Detect and enforce enpassant
        const {enpassant,capturedX,capturedY} =
            Pawn.EnPassant(movingPiece.blackness, movingPiece.pawnness, movingPiece.x, movingPiece.y, x, y, boardState) 
        if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }

        //Save state in case the (human's) move attempt is illegal
        let savex=movingPiece.x;
        let savey=movingPiece.y;
        movingPiece.x=x;
        movingPiece.y=y;

        if(!prechecked && isChecked(movingPiece.blackness)){
            //Uh-oh! Revert illegal check-causing move. (This is for moves attempted by
            //  humans. The computer has already considered this possibility.)
            movingPiece.x=savex;
            movingPiece.y=savey;
            if(enemy.length==1) { enemy[0].deadness=false; }
            if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }
            setBoardState(prime)
        }else{
            // Successful move
            //

            // Mark piece dirty
            movingPiece.dirtiness=true;
            
            // Maintain "just advanced two" flag for enpassant logic
            prime.forEach((t)=>t.justAdvancedTwo=false);           
            movingPiece.justAdvancedTwo=Math.abs(movingPiece.y-savey)==2;

            // Mutate state
            setBoardState(prime)

            //Pawn Promotion
            if(movingPiece.pawnness && ((movingPiece.blackness && movingPiece.y==7)||(!movingPiece.blackness && movingPiece.y==0))){
                movingPiece.sprite=movingPiece.blackness?Queen.Black:Queen.White;
                movingPiece.canMove=Queen.CanMove;
            }

            // Check for mate
            if(!Movement.CanMakeAMove(!movingPiece.blackness, causesSelfCheck, boardState)){
                if(isChecked(!movingPiece.blackness)){
                    setModalVisible(('CHECKMATE! WINNER: ' + (movingPiece.blackness?'BLACK':'WHITE') ))
                }else{
                    setModalVisible('STALEMATE')                    
                }               
            }else{
                setMoveCount(moveCount+1);
            }
        }
    } 
    
    return(<Game boardState={boardState} movePiece={movePiece} causesSelfCheck={causesSelfCheck} causesEnemyCheck={causesEnemyCheck}   
        moveCount={moveCount} setMoveCount={setMoveCount} setBoardState={setBoardState}
        modalVisible={modalVisible} setModalVisible={setModalVisible} ResetBoard={ResetBoard} />);    
}    

export default App;
