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
import React, {useState, useEffect, Component } from 'react';
import {Pressable, Text,  View, Modal} from 'react-native';
import {Game} from './Game';
import Sprite from './Sprite';
import Rook from './Rook';
import Pawn from './Pawn';
import Bishop from './Bishop';
import Knight from './Knight';
import King from './King';
import Queen from './Queen';
import Constants from './Constants';
import Movement from './Movement';
import {styles} from './Styles'

const App = ()=>{
    const [boardState, setBoardState] = useState(Constants.StartingBoard())
    const [moveCount, setMoveCount] = useState(0)
    const [modalVisible,setModalVisible]=useState(undefined);

    const isChecked = (blackness)=> {
	//King of the color that might be checked. We assume this exists.
	const k=boardState.filter((t,i)=>t.blackness==blackness && t.kingness && !t.deadness)[0];
	let returnable = false;
	if(k) {
            returnable=
		boardState.filter((t)=>!t.deadness).some(
		    (t,i)=>t.blackness!=blackness && t.canMove(t.blackness,t.x,t.y,k.x,k.y,boardState));
	}
	return returnable;
    }

    const causesCheck = (n, x, y)=> {
	let prime=[...boardState]

	const movingPiece = boardState.filter(t=>t.n==n)[0]
	
	//Capture anything there 
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != movingPiece.blackness && !t.deadness)
	if(enemy.length==1) { enemy[0].deadness=true; }

	//enpassant
	const {enpassant,capturedX,capturedY} = Pawn.EnPassant(movingPiece.blackness,movingPiece.pawnness,movingPiece.x,movingPiece.y,x,y,boardState) 
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }
	
	let savex=movingPiece.x; let savey=movingPiece.y;
	movingPiece.x=x; movingPiece.y=y;
	let returnable = isChecked(movingPiece.blackness);
	movingPiece.x=savex;
	movingPiece.y=savey;
	if(enemy.length==1) { enemy[0].deadness=false; }
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }

	setBoardState(prime)
	return returnable
    }

    const ResetBoard = ()=>{
	setBoardState(Constants.StartingBoard())
	setMoveCount(0)
    }
    
    const movePiece = (n, x, y, prechecked)=> {

	let prime=[...boardState]
	const movingPiece = boardState.filter(t=>t.n==n)[0]
	//Capture anything there
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != movingPiece.blackness && !t.deadness)
	if(enemy.length==1) { enemy[0].deadness=true; }

	//enpassant
	const {enpassant,capturedX,capturedY} = Pawn.EnPassant(movingPiece.blackness,movingPiece.pawnness,movingPiece.x,movingPiece.y,x,y,boardState) 
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }
	
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
	    if(!Movement.CanMakeAMove(!movingPiece.blackness, causesCheck, boardState)){
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
    
    return(<Game boardState={boardState} movePiece={movePiece} causesCheck={causesCheck}   
	moveCount={moveCount} setMoveCount={setMoveCount} setBoardState={setBoardState}
	modalVisible={modalVisible} setModalVisible={setModalVisible} ResetBoard={ResetBoard} />);    
}    

export default App;
