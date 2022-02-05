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
import {Pressable, StyleSheet, Text, Button, View, FlatList, TouchableOpacity, TextInput, NativeModules, Modal} from 'react-native';
import Canvas from 'react-native-canvas';
import Draggable from 'react-native-draggable';
import Sprite from './Sprite';
import * as Art from './Art';
import Rook from './Rook';

const { RNPlayNative } = NativeModules;

const noInterveningPiece = function(x,y,toX,toY) {
    var returnable=true;
    const signX=Math.sign(toX-x);
    const signY=Math.sign(toY-y);
    for(let i=1; i<Math.max(Math.abs(toX-x),Math.abs(toY-y)); i+=1){
	pieces.forEach((pt,pi)=>{ if(pt.x==x+signX*i && pt.y==y+signY*i && !pt.deadness){returnable=false;}   });
    }
    return returnable;
};


const releaseServer = (e,t) => {
    const targetX = (Math.floor((e.nativeEvent.pageX-9) / 42));
    const targetY = (Math.floor((e.nativeEvent.pageY-138) / 42));
    if (targetX>7 || targetY>7 || targetX<0 || targetY<0) { return; }
    let n=t.props.n; //Should we really access stuff this way? TODO
    let piecesn=pieces.filter((u)=>u.n==n)[0];
    const blackGo = t.props.moveCount%2==1
    if(blackGo != piecesn.blackness){return}
    // Castling... if this were in kingCanMove, then the computer could use it...
    if(piecesn.kingness && Math.abs(targetX-piecesn.x)==2 && Math.abs(targetY-piecesn.y)==0){
	if(!noInterveningPiece(piecesn.x,piecesn.y,targetX,targetY)){
	    // Piece in way
	}else{
	    left = (targetX==2);
	    if(left){
		let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==0)[0]
		if(!castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
		    if(!t.props.causesCheck(n,piecesn.x-1,targetY) && !t.props.causesCheck(n,piecesn.x-2,targetY)){
			t.props.movePiece(n,piecesn.x-2,targetY);
			t.props.movePiece(castle.n,castle.x+3,castle.y); }}
	    }else{
		let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==7)[0]
		if(!castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
		    if(!t.props.causesCheck(n,piecesn.x+1,targetY) && !t.props.causesCheck(n,piecesn.x+2,targetY)){
			t.props.movePiece(n,piecesn.x+1,targetY);
			t.props.movePiece(n,piecesn.x+2,targetY);
			t.props.movePiece(castle.n,castle.x-2,castle.y); }}
	    }
	}
    }
    if(piecesn.canMove(piecesn.blackness,piecesn.x,piecesn.y,targetX,targetY,pieces)){
	t.props.movePiece(n,targetX,targetY); }
}

class Piece extends Component {
    constructor(props){super(props);}
    
    render(){
	if(this.props.deadness) return null;
	return (
	    <Draggable shouldReverse={true /*We'll handle the positioning*/ }
	    renderSize={92 } x={ this.props.x * 42 + 9} y={this.props.y * 42 + 138} onDragRelease={(event)=>{releaseServer(event,this)}}>
	    <View>
	    {/*This wrapping view immediately inside draggable seems to be required to establish the rectangle in which your finger will grab it.*/}
	    <View style={{width:35, height:45}}>
	    <Sprite sprite={this.props.sprite} pixelSize={3 } />
	    </View></View></Draggable>
	);
    }
}

const bishopCanMove = (blackness,x,y,toX,toY,pieces)=> (Math.abs(toX-x)==Math.abs(toY-y))
					   && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor
					   && !pieces.some((t)=>
					       t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //Can't move atop same color piece
					   && noInterveningPiece(x,y,toX,toY)


      
function isChecked(blackness) {
    //King of the color that might be checked. We assume this exists.
    const k=pieces.filter((t,i)=>t.blackness==blackness && t.kingness && !t.deadness)[0];
    let returnable = false;
    if(k) {
	//TODO abstract the deadness thing away
	returnable= pieces.filter((t)=>!t.deadness).some((t,i)=>t.blackness!=blackness && t.canMove(t.blackness,t.x,t.y,k.x,k.y,pieces));
    }
    return returnable;
}

const kingCanMove = (blackness,x,y,toX,toY,pieces)=> {
    return (Math.abs(toX-x)<=1 && Math.abs(toY-y)<=1
	 && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor	
	 && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //TODO refactor
)}

const knightCanMove = (blackness,x,y,toX,toY,pieces)=> {
    return (Math.abs(toX-x) + Math.abs(toY-y)==3)
	&& toX!=x && toY!=y
	&& !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness)
}


const enPassant = (blackness,pawnness,x,y,toX,toY)=> {
    //TODO this should be called by pawnCanMove

    const happened = pawnness && (
	//Black
	(toY-y==1 && blackness && Math.abs(toX-x)==1 &&
	 pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness))||
	//White
	(toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
	 pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness)));

    return {enpassant:happened, capturedX:toX, capturedY:y}
}

const pawnCanMove = (blackness,x,y,toX,toY,pieces)=> {
    return ((toY-y==1 && blackness) ||
	    (toY-y==-1 && !blackness) ||
	    (toY-y==2 && blackness && y==1  && noInterveningPiece(x,y,toX,toY)) ||
	    (toY-y==-2 && !blackness && y==6  && noInterveningPiece(x,y,toX,toY)) 	   
	   )
        // No jumping by pawns
	&& noInterveningPiece(x,y,toX,toY)

	&&

	   (toX==x

	  //Capture (pawn)
	  // Customary diagonal capture, black
	  ||(toY-y==1 && blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness))

	  // Customary diagonal capture, white
	  ||(toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness))

	  //En passant
	  ||enPassant(blackness,true,x,y,toX,toY).enpassant

	   )


    &&
	   //No straight-on capture
	   (!( pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness) && toX==x	   ))
	&& !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //TODO refactor    
}

const queenCanMove = (blackness,x,y,toX,toY,pieces)=>Rook.CanMove(blackness,x,y,toX,toY,pieces) || bishopCanMove(blackness,x,y,toX,toY,pieces)

// The requirement to maintain N here sucks TODO
const initPieces=()=>[
    { sprite:Art.pawnb, x:0, y:1, n:0, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:1, y:1, n:1, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:2, y:1, n:2, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:3, y:1, n:3, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:4, y:1, n:4, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:5, y:1, n:5, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:6, y:1, n:6, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnb, x:7, y:1, n:7, canMove: pawnCanMove, blackness: true, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:0, y:6, n:8, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:1, y:6, n:9, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:2, y:6, n:10, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:3, y:6, n:11, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:4, y:6, n:12, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:5, y:6, n:13, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:6, y:6, n:14, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Art.pawnw, x:7, y:6, n:15, canMove: pawnCanMove, blackness: false, kingness: false,  deadness: false, pawnness: true },
    { sprite:Rook.Black, x:0, y:0,n:16, canMove: Rook.CanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Rook.Black, x:7, y:0,n:17, canMove: Rook.CanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Art.bishopb, x:2, y:0, n:18, canMove: bishopCanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Art.bishopb, x:5, y:0, n:19, canMove: bishopCanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Art.queenb, x:3, y:0, n:20, canMove: queenCanMove, blackness: true, kingness: false,  deadness: false },
    { sprite:Art.kingb, x:4, y:0, n:21, canMove: kingCanMove, blackness: true,  kingness: true,deadness: false },
    { sprite:Art.knightb, x:1, y:0, n:30, canMove: knightCanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Art.knightb, x:6, y:0, n:31, canMove: knightCanMove, blackness: true,  kingness: false, deadness: false },
    { sprite:Rook.White, x:7, y:7, n:22, canMove: Rook.CanMove, blackness: false,  kingness: false, deadness: false },
    { sprite:Rook.White, x:0, y:7, n:23, canMove: Rook.CanMove, blackness: false,  kingness: false, deadness: false },
    { sprite:Art.bishopw, x:2, y:7, n:24, canMove: bishopCanMove, blackness: false,  kingness: false, deadness: false },
    { sprite:Art.bishopw, x:5, y:7, n:25, canMove: bishopCanMove, blackness: false,  kingness: false, deadness: false },
    { sprite:Art.queenw, x:3, y:7, n:26, canMove: queenCanMove, blackness: false, kingness: false,  deadness: false },
    { sprite:Art.kingw, x:4, y:7, n:27, canMove: kingCanMove, blackness: false,  kingness: true,deadness: false },
    { sprite:Art.knightw, x:1, y:7, n:28, canMove: knightCanMove, blackness: false,  kingness: false, deadness: false },
    { sprite:Art.knightw, x:6, y:7, n:29, canMove: knightCanMove, blackness: false,  kingness: false, deadness: false },

    
]

let pieces=initPieces();

function GameInner(props){
    return(<>
	{props.boardx.map((t)=>(
	    <Piece n={t.n} key={t.n} deadness={t.deadness} x={t.x} y={t.y} sprite={t.sprite}
	    causesCheck={props.causesCheck} movePiece={props.movePiece}  
	    moveCount={props.moveCount}  
	    />))}
	</>
    )
}

//Can be in App?
function possibleMoves(blackness,causesCheck,max){
    let returnable = [];
    pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
	if(returnable.length<max){
	    for(let i=0; i<8; ++i){
		for(let j=0; j<8; ++j){
		    if(returnable.length<max){
			let cm=t.canMove(t.blackness,t.x,t.y,i,j,pieces);
			if(cm){
			    let nocheck= !causesCheck(t.n,i,j);
			    if(cm && nocheck) { returnable.push({n:t.n, x:i, y:j}); }
			}
		    }
    }}}});
    return returnable;
}

function Game(props){
    const players=1;
    if(!props.modalVisible) {
     if(players==1) {
	useEffect(() => {
	    if(props.moveCount%2==1) {
		let pm = possibleMoves(true,props.causesCheck,10)
		let move = pm[Math.floor(Math.random()*pm.length)];
		props.movePiece(move.n, move.x, move.y, true);
		RNPlayNative.runMethod();		
	    }
	},[props.moveCount]);

     }else if(players==2){


     }else{
	useEffect(() => {
	    setTimeout(()=>{
		if(props.moveCount%2==1) {
		    let pm = possibleMoves(true,props.causesCheck,10)
		    let move = pm[Math.floor(Math.random()*pm.length)];
		    props.movePiece(move.n, move.x, move.y, true);
		}else{
		    let pm = possibleMoves(false,props.causesCheck,10)
		    let move = pm[Math.floor(Math.random()*pm.length)];
		    props.movePiece(move.n, move.x, move.y, true);  
		}
	    },250);	},[props.moveCount]);
     }
    }
    return(
	<View style={{width:1000, height:1000}}><View style={{flex:0.315}}/><View>
	<Sprite pixelSize={42} sprite={Art.board} ></Sprite>	     
	</View>
	<GameInner boardx={props.boardx} movePiece={props.movePiece}
	causesCheck={props.causesCheck} moveCount={props.moveCount}
	/>
	<View style={{flex:0.2}} ><Text>{"MOVE " + props.moveCount + (props.moveCount%2>0?' BLACK':' WHITE')}</Text></View>

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
            <Text style={{color:"black"}}>{props.modalVisible}</Text>
            <Pressable
        style={{padding:10, backgroundColor:"rgba(32,32,32,0.2)", color:"black"}}
        onPress={() => {props.setModalVisible(undefined)
			props.ResetBoard();
		       }}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>

	</Modal>
</View>
	</View>);
}

//Can be in App?
function canMakeAMove(blackness,causesCheck){
    let returnable = false;
    pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
	for(let i=0; i<8; ++i){
	    for(let j=0; j<8; ++j){
		if(!returnable){
		    let cm=t.canMove(t.blackness,t.x,t.y,i,j,pieces);
		    if(cm) {
			let nocheck= !causesCheck(t.n,i,j);
			if(cm && nocheck) { returnable = true; }
		    }
    }}}});
    return returnable;
}


let count=0;
const App = ()=>{
    const [boardx, setBoardx] = useState(pieces)
    const [moveCount, setMoveCount] = useState(count)
    const [modalVisible,setModalVisible]=useState(undefined);
    
    const causesCheck = (n, x, y)=> {
	let prime=[...boardx]

	const boardxn = boardx.filter(t=>t.n==n)[0]
	
	//Capture anything there 
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != boardxn.blackness && !t.deadness)
	if(enemy.length==1) { enemy[0].deadness=true; }

	//enpassant
	const {enpassant,capturedX,capturedY} = enPassant(boardxn.blackness,boardxn.pawnness,boardxn.x,boardxn.y,x,y) 
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
	pieces=initPieces()
	setBoardx(pieces)
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
	//  member of each piece defininition, e.g. bishopCanMove, but this is purely
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
	const {enpassant,capturedX,capturedY} = enPassant(boardxn.blackness,boardxn.pawnness,boardxn.x,boardxn.y,x,y) 
	if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=true; }
	
	let savex=boardxn.x;
	let savey=boardxn.y;
	boardxn.x=x;
	boardxn.y=y;

	//TODO PRECHECKED LOGIC IS ALLOWING UNCORRECTED CHECK RESPONSES!!!
	if(!prechecked && isChecked(boardxn.blackness)){
	    //Uh-oh! Revert illegal check-causing move.
	    boardxn.x=savex;
	    boardxn.y=savey;
	    if(enemy.length==1) { enemy[0].deadness=false; }
	    if(enpassant) { prime.filter((t)=>t.x==capturedX && t.y==capturedY )[0].deadness=false; }
	    setBoardx(prime)
	}else{
	    // Mark piece dirty
	    boardxn.dirtiness=true;
	    // Mark piece (and nothing else) "last moved"
	    prime.forEach((t)=>t.justAdvancedTwo=false);	   
	    boardxn.justAdvancedTwo=Math.abs(boardxn.y-savey)==2;
	    // Mutate state
	    setBoardx(prime)

	     //Pawn Promotion
	     if(boardxn.pawnness && ((boardxn.blackness && boardxn.y==7)||(!boardxn.blackness && boardxn.y==0))){
		boardxn.sprite=boardxn.blackness?Art.queenb:Art.queenw;
		boardxn.canMove=queenCanMove;
	     }

	    // Check for mate
	    if(!canMakeAMove(!boardxn.blackness, causesCheck)){
		if(isChecked(!boardxn.blackness)){
		    setModalVisible(('CHECKMATE! WINNER: ' + (boardxn.blackness?'BLACK':'WHITE') ))
		}else{
		    setModalVisible('STALEMATE')		    
		}
		
	    }else{
	     setMoveCount(++count);
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
  button:{backgroundColor:"rgba(192,192,192,0.8)", borderRadius:4}
});

export default App;
