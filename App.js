// TODO GITIGNORE
// TODO PATCH FILE LOOKS WEIRD
// TODO EMACS WEBMODE AT START
//
// npm install react-native-webview
//
// react-native link react-native-webview
//
// npm install react-native-canvas

// npm install react-native-canvas
//
// npm install react-native-draggable
//
// Run "npx patch-package" to fix react-native-draggable's broken
//  "shouldReverse" feature. As things stand in the repo, the promised
//  "onReverse" callback doesn't ever run. My patch fixes that, and
//  also removes the gimmicky snap-back animation.
//

import React, {useState, useEffect, Component, useCallback} from 'react';
import {Pressable, StyleSheet, Text, Button, View, TouchableOpacity, TextInput, NativeModules, Modal} from 'react-native';
import Canvas from 'react-native-canvas';
import Draggable from 'react-native-draggable';
import Sprite from './Sprite';
import * as Art from './Art';
import Rook from './Rook';
import Pawn from './Pawn';
import Bishop from './Bishop';
import Knight from './Knight';
import King from './King';
import Queen from './Queen';
import Engine from './Engine';
import Constants from './Constants';
import Movement from './Movement';

const { RNPlayNative } = NativeModules;

// The requirement to maintain N here sucks TODO

class Piece extends Component {
    constructor(props){super(props);}
    
    render(){
	if(this.props.deadness) return null;
	return (
		<Draggable shouldReverse={true /*We'll handle the positioning*/ }
	    renderSize={Constants.SquareSize } x={ this.props.x * Constants.SquareSize + (Constants.SpriteWidth / 2.0)}
	    y={this.props.y * Constants.SquareSize + Constants.BoardTop} onDragRelease={(event)=>{Movement.Release(event,this)}}>
		<View>
		{/*This view immediately inside draggable seems to be required to establish the rectangle in which your finger will grab it.*/}
		<View style={styles.pieceWrapper}>
  		<Sprite sprite={this.props.sprite} pixelSize={Constants.SpritePixelSize} />
		</View>
		</View>
		</Draggable>
	);
    }
}

function Board(props){
    return(<>
	   {props.boardx.map((t)=>(
		   <Piece n={t.n} key={t.n} deadness={t.deadness} x={t.x} y={t.y} sprite={t.sprite}
	       causesCheck={props.causesCheck} movePiece={props.movePiece}  
	       moveCount={props.moveCount} board={props.boardx}
		   />))}
	   </>
	  )
}

function Game(props){
    const players=1;

    // Computer movement
    if(!props.modalVisible) {
	if(players==1) {
	    useEffect(() => {
		if(props.moveCount%2==1) {
		    let pm = Engine.PossibleMoves(true,props.causesCheck,10,pieces)
		    let move = pm[Math.floor(Math.random()*pm.length)];
		    props.movePiece(move.n, move.x, move.y, true);
		    RNPlayNative.runMethod();		
		}
	    },[props.moveCount]);

	}else if(players==2){
	    //We don't need to do any computer-driven moving if 2 players

	}else{
	    useEffect(() => {
		setTimeout(()=>{
		    if(props.moveCount%2==1) {
			let pm = Engine.PossibleMoves(true,props.causesCheck,10,pieces)
			let move = pm[Math.floor(Math.random()*pm.length)];
			props.movePiece(move.n, move.x, move.y, true);
		    }else{
			let pm = Engine.PossibleMoves(false,props.causesCheck,10,pieces)
			let move = pm[Math.floor(Math.random()*pm.length)];
			props.movePiece(move.n, move.x, move.y, true);  
		    }
		},250);
	    },[props.moveCount]);
	}
    }
    
    return(
	    <View style={styles.gameWrapper}><View style={styles.boardWrapper}/>
	    <View>
	    <Sprite pixelSize={Constants.SquareSize} sprite={Art.board} ></Sprite>	     
	    </View>
	    <Board boardx={props.boardx} movePiece={props.movePiece} causesCheck={props.causesCheck} moveCount={props.moveCount} />
	    <View style={styles.textBanner} ><Text>{"MOVE " + (props.moveCount+1) + (props.moveCount%2>0?' BLACK':' WHITE')}</Text></View>

	    <View style={styles.centeredView}>
	    <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible?true:false}
        onRequestClose={() => {
            setModalVisible(undefined);
        }}
	    >
            <View style={styles.centeredView} >
            <Text style={styles.modalText}>{props.modalVisible}</Text>
            <Pressable
        style={styles.modalButton}
        onPress={() => {props.setModalVisible(undefined)
			props.ResetBoard();
		       }}
            >
            <Text>OK</Text>
            </Pressable>
            </View>

	</Modal>
	    </View>
	    </View>);
}

//let count=0;
let pieces=Constants.StartingBoard();

const App = ()=>{
    const [boardx, setBoardx] = useState(pieces)
    const [moveCount, setMoveCount] = useState(0)
    const [modalVisible,setModalVisible]=useState(undefined);

    const isChecked = (blackness)=> {
	//King of the color that might be checked. We assume this exists.
	const k=pieces.filter((t,i)=>t.blackness==blackness && t.kingness && !t.deadness)[0];
	let returnable = false;
	if(k) {
	    //TODO abstract the deadness thing away
	    returnable= pieces.filter((t)=>!t.deadness).some((t,i)=>t.blackness!=blackness && t.canMove(t.blackness,t.x,t.y,k.x,k.y,pieces));
	}
	return returnable;
    }

    const causesCheck = (n, x, y)=> {
	let prime=[...boardx]

	const boardxn = boardx.filter(t=>t.n==n)[0]
	
	//Capture anything there 
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != boardxn.blackness && !t.deadness)
	if(enemy.length==1) { enemy[0].deadness=true; }

	//enpassant
	const {enpassant,capturedX,capturedY} = Pawn.EnPassant(boardxn.blackness,boardxn.pawnness,boardxn.x,boardxn.y,x,y,boardx) 
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }
	
	let savex=boardxn.x; let savey=boardxn.y;
	boardxn.x=x; boardxn.y=y;
	let returnable = isChecked(boardxn.blackness);
	boardxn.x=savex;
	boardxn.y=savey;
	if(enemy.length==1) { enemy[0].deadness=false; }
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }

	setBoardx(prime)
	return returnable
    }

    const ResetBoard = ()=>{
	pieces=Constants.StartingBoard()
	setBoardx(pieces)
//	count=0;
	setMoveCount(0)
    }
    
    const movePiece = (n, x, y, prechecked)=> {

	// A word about state...
	//  Ultimately boardx, prime, and pieces all end up referring to the same, fixed
	//  storage locations. These are established in the const declaration of pieces
	//  (somewhere above here) and do not change. We do need setBoardx() to inform the
	//  virtual DOM when it should re-render, and setBoardX() is called exclusively by
	//  this movePiece() function. It is in fact a sort of middleware tier, in that it
	//  can do things like manage the threateningly cyclical "does a proposed move 
	//  cause check?" question. In areas of the code where challenges are less
	//  threatening, it is fine for various code to inspect pieces directly, so long
	//  as all changes to piece position (which is, of course, precisely what would
	//  cause the need for re-rendering) are directed here. Yes, there is the canMove()
	//  member of each piece defininition, e.g. Bishop.CanMove, but this is purely
	//  physical in nature vs. being about other rules... that's where we set up the
	//  fact that bishops move diagonally and can't jump pieces, not where we enforce
	//  rules around moving into check). So, the toggle to "prime" is done once we have
	//  attempted the move "in-memory," and reverted the move if check was found.
	let prime=[...boardx]
	const boardxn = boardx.filter(t=>t.n==n)[0]
	//Capture anything there
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != boardxn.blackness && !t.deadness)
	if(enemy.length==1) { enemy[0].deadness=true; }

	//enpassant
	const {enpassant,capturedX,capturedY} = Pawn.EnPassant(boardxn.blackness,boardxn.pawnness,boardxn.x,boardxn.y,x,y,boardx) 
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }
	
	let savex=boardxn.x;
	let savey=boardxn.y;
	boardxn.x=x;
	boardxn.y=y;

	if(!prechecked && isChecked(boardxn.blackness)){
	    //Uh-oh! Revert illegal check-causing move. (This is for moves attempted by
	    //  humans. The computer has already considered this possibility.)
	    boardxn.x=savex;
	    boardxn.y=savey;
	    if(enemy.length==1) { enemy[0].deadness=false; }
	    if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }
	    setBoardx(prime)
	}else{
	    // Successful move
	    //

	    // Mark piece dirty
	    boardxn.dirtiness=true;
	    
	    // Maintain "just advanced two" flag for enpassant logic
	    prime.forEach((t)=>t.justAdvancedTwo=false);	   
	    boardxn.justAdvancedTwo=Math.abs(boardxn.y-savey)==2;

	    // Mutate state
	    setBoardx(prime)

	    //Pawn Promotion
	    if(boardxn.pawnness && ((boardxn.blackness && boardxn.y==7)||(!boardxn.blackness && boardxn.y==0))){
		boardxn.sprite=boardxn.blackness?Queen.Black:Queen.White;
		boardxn.canMove=Queen.CanMove;
	    }

	    // Check for mate
	    if(!Movement.CanMakeAMove(!boardxn.blackness, causesCheck, boardx)){
		if(isChecked(!boardxn.blackness)){
		    setModalVisible(('CHECKMATE! WINNER: ' + (boardxn.blackness?'BLACK':'WHITE') ))
		}else{
		    setModalVisible('STALEMATE')		    
		}		
	    }else{
		setMoveCount(moveCount+1);
	    }
	}
    } 
    
    return(<Game boardx={boardx} movePiece={movePiece} causesCheck={causesCheck}   
	   moveCount={moveCount} setMoveCount={setMoveCount} setBoardx={setBoardx}
	   modalVisible={modalVisible} setModalVisible={setModalVisible} ResetBoard={ResetBoard} />);    
}    

const styles = StyleSheet.create({
    centeredView: {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
	marginTop: 22
    },
    button:{backgroundColor:"rgba(192,192,192,0.8)", borderRadius:4},
    pieceWrapper: {width:35, height:45},
    gameWrapper: {width: 1000, height:1000},
    boardWrapper: {flex:0.315},
    modalButton: {padding:10, backgroundColor:"rgba(32,32,32,0.2)", color:"black"},
    textBanner: {flex:0.2},
    modalText: {color:"black"},
});

export default App;
