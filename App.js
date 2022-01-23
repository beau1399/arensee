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
import { StyleSheet, Text, Button, View, FlatList, TouchableOpacity, TextInput} from 'react-native';
import Canvas from 'react-native-canvas';
import Draggable from 'react-native-draggable';
import Sprite from './Sprite';
import * as Art from './Art';

const noInterveningPiece = function(x,y,toX,toY) {
    var returnable=true;
    const signX=Math.sign(toX-x);
    const signY=Math.sign(toY-y);
    for(let i=1; i<Math.max(Math.abs(toX-x),Math.abs(toY-y)); i+=1){
	pieces.forEach((pt,pi)=>{ if(pt.x==x+signX*i && pt.y==y+signY*i && !pt.dead){returnable=false;}   });
    }
    return returnable;
};


const releaseServer = (e,t,movePiece,canMove,causesCheck) => {
    const targetX = (Math.floor((e.nativeEvent.pageX-9) / 42));
    const targetY = (Math.floor((e.nativeEvent.pageY-138) / 42));
    let n=t.props.n;
    let piecesn=pieces.filter((u)=>u.n==n)[0];
    const blackGo = t.props.moveCount%2==1
    if(blackGo != piecesn.blackness){return}
    if(piecesn.kingness && Math.abs(targetX-piecesn.x)==2 && Math.abs(targetY-piecesn.y)==0){
	alert('CASTLE ATTEMPT')
	if(!noInterveningPiece(piecesn.x,piecesn.y,targetX,targetY)){
	    alert('PIECE IN WAY')
	}else{
	    left = (targetX==2);
	    if(left){
		let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==0)[0]
		if(!castle.dirtiness && !piecesn.dirtiness && !castle.dead && !piecesn.dead) {
		    if(!causesCheck(n,piecesn.x-1,targetY) && !causesCheck(n,piecesn.x-2,targetY)){
			movePiece(n,piecesn.x-2,targetY);
			movePiece(castle.n,castle.x+3,castle.y); }}
	    }else{
		let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==7)[0]
		if(!castle.dirtiness && !piecesn.dirtiness && !castle.dead && !piecesn.dead) {
		    if(!causesCheck(n,piecesn.x+1,targetY) && !causesCheck(n,piecesn.x+2,targetY)){
			movePiece(n,piecesn.x+1,targetY);
			movePiece(n,piecesn.x+2,targetY);
			movePiece(castle.n,castle.x-2,castle.y); }}
	    }
	}
    }
    if(canMove(n,targetX,targetY)){
	movePiece(n,targetX,targetY); }
}

class Piece extends Component {
    constructor(props){super(props);
		       //We "curry" releaseServer with the values that are fixed here, i.e. the three functions
		       // related to piece-moving. Left unbound are the event parameter and the instance of
		       // Piece, which will vary at runtime.
		       this.pieceReleaser = (event,t)=>
		       {releaseServer(event,t,props.movePiece,props.canMove,props.causesCheck)};
    }
    
    render(){
//	alert('11 '+this.props.moveCount)
	if(this.props.dead) return null;
	return (
	    <Draggable shouldReverse={true /*We'll handle the positioning*/ }
	    renderSize={92 } x={ this.props.x * 42 + 9} y={this.props.y * 42 + 138} onDragRelease={(event)=>{this.pieceReleaser(event,this)}}>
	    <View>
	    {/*This wrapping view immediately inside draggable seems to be required to establish the rectangle in which your finger will grab it.*/}
	    <View style={{width:35, height:45}}>
		<Sprite sprite={this.props.sprite} pixelSize={3 } />
	    </View></View></Draggable>
	);
    }
}

const bishopCanMove = (blackness,x,y,toX,toY)=> (Math.abs(toX-x)==Math.abs(toY-y))
					   && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor
					   && !pieces.some((t)=>
					       t.x==toX && t.y==toY && t.blackness==blackness && !t.dead) //Can't move atop same color piece
					   && noInterveningPiece(x,y,toX,toY)

const rookCanMove = (blackness,x,y,toX,toY)=> (x==toX || y==toY)
					 && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor
					 && !pieces.some((t)=>
					     t.x==toX && t.y==toY && t.blackness==blackness && !t.dead) //Can't move atop same color piece
					 && noInterveningPiece(x,y,toX,toY)

function isChecked(blackness, setDbg, dbgString) {
    //King of the color that might be checked. We assume this exists.
    const k=pieces.filter((t,i)=>t.blackness==blackness && t.kingness && !t.dead)[0];
    let returnable = false;
    if(k) {
	//TODO abstract the dead thing away
	returnable= pieces.filter((t)=>!t.dead).some((t,i)=>t.blackness!=blackness && t.canMove(t.blackness,t.x,t.y,k.x,k.y));
    }
    setDbg && setDbg(dbgString + '/' + (blackness?'BLACK':'WHITE')+' '+ (returnable?'IS':'IS NOT') + ' CHECKED')
    return returnable;
}

const kingCanMove = (blackness,x,y,toX,toY)=> {
    return (Math.abs(toX-x)<=1 && Math.abs(toY-y)<=1
	 && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor	
	 && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.dead) //TODO refactor
)}

const knightCanMove = (blackness,x,y,toX,toY)=> {
    return (Math.abs(toX-x) + Math.abs(toY-y)==3)
	&& toX!=x && toY!=y
	&& !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.dead)
}

const pawnCanMove = (blackness,x,y,toX,toY)=> {
    return ((toY-y==1 && blackness) ||
	    (toY-y==-1 && !blackness) ||
	    (toY-y==2 && blackness && y==1  ) ||
	    (toY-y==-2 && !blackness && y==6  ) 	   
    ) && (toX==x
	||(toY-y==1 && blackness && Math.abs(toX-x)==1 &&
	   pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.dead))
	||(toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
	   pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.dead))
    ) &&
	   //No straight-on capture
	   (!( pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.dead) && toX==x	   ))

	&& !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.dead) //TODO refactor    
}

const queenCanMove = (blackness,x,y,toX,toY)=>rookCanMove(blackness,x,y,toX,toY) || bishopCanMove(blackness,x,y,toX,toY)

// The requirement to maintain N here sucks TODO
const pieces=[
    { sprite:Art.pawnb, x:0, y:1, n:0, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:1, y:1, n:1, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:2, y:1, n:2, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:3, y:1, n:3, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:4, y:1, n:4, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:5, y:1, n:5, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:6, y:1, n:6, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnb, x:7, y:1, n:7, canMove: pawnCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:0, y:6, n:8, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:1, y:6, n:9, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:2, y:6, n:10, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:3, y:6, n:11, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:4, y:6, n:12, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:5, y:6, n:13, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:6, y:6, n:14, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.pawnw, x:7, y:6, n:15, canMove: pawnCanMove, blackness: false, kingness: false,  dead: false },

    { sprite:Art.rookb, x:0, y:0,n:16, canMove: rookCanMove, blackness: true,  kingness: false, dead: false },
    { sprite:Art.rookb, x:7, y:0,n:17, canMove: rookCanMove, blackness: true,  kingness: false, dead: false },

    { sprite:Art.bishopb, x:2, y:0, n:18, canMove: bishopCanMove, blackness: true,  kingness: false, dead: false },
    { sprite:Art.bishopb, x:5, y:0, n:19, canMove: bishopCanMove, blackness: true,  kingness: false, dead: false },

    { sprite:Art.queenb, x:3, y:0, n:20, canMove: queenCanMove, blackness: true, kingness: false,  dead: false },
    { sprite:Art.kingb, x:4, y:0, n:21, canMove: kingCanMove, blackness: true,  kingness: true,dead: false },

    { sprite:Art.knightb, x:1, y:0, n:30, canMove: knightCanMove, blackness: true,  kingness: false, dead: false },
    { sprite:Art.knightb, x:6, y:0, n:31, canMove: knightCanMove, blackness: true,  kingness: false, dead: false },
    
    { sprite:Art.rookw, x:7, y:7, n:22, canMove: rookCanMove, blackness: false,  kingness: false, dead: false },
    { sprite:Art.rookw, x:0, y:7, n:23, canMove: rookCanMove, blackness: false,  kingness: false, dead: false },

    { sprite:Art.bishopw, x:2, y:7, n:24, canMove: bishopCanMove, blackness: false,  kingness: false, dead: false },
    { sprite:Art.bishopw, x:5, y:7, n:25, canMove: bishopCanMove, blackness: false,  kingness: false, dead: false },

    { sprite:Art.queenw, x:3, y:7, n:26, canMove: queenCanMove, blackness: false, kingness: false,  dead: false },
    { sprite:Art.kingw, x:4, y:7, n:27, canMove: kingCanMove, blackness: false,  kingness: true,dead: false },

    { sprite:Art.knightw, x:1, y:7, n:28, canMove: knightCanMove, blackness: false,  kingness: false, dead: false },
    { sprite:Art.knightw, x:6, y:7, n:29, canMove: knightCanMove, blackness: false,  kingness: false, dead: false },

    
]

function GameInner(props){
    return(<>
	{props.boardx.map((t)=>(
	    <Piece n={t.n} key={t.n} dead={t.dead} x={t.x} y={t.y} sprite={t.sprite}
	    canMove={props.canMove}  causesCheck={props.causesCheck} movePiece={props.movePiece}  dbgString={props.dbgString}
	    moveCount={props.moveCount}  
	    />))}
	</>
    )
}

//let blacksTurn=false;

//Can be in App?
function possibleMoves(blackness,causesCheck,max,setDbg,dbgString){
    let returnable = [];
    pieces.filter((t)=>t.blackness==blackness && !t.dead).forEach((t)=> {
	if(returnable.length<max){
	    for(let i=0; i<8; ++i){
		for(let j=0; j<8; ++j){
		    if(returnable.length<max){
			let cm=t.canMove(t.blackness,t.x,t.y,i,j);
			if(cm){
			    let nocheck= !causesCheck(t.n,i,j);
			    if(cm && nocheck) { returnable.push({n:t.n, x:i, y:j}); }
			}
		    }
    }}}});
    setDbg(dbgString + '\r\n' + returnable.length + ' possible moves')
    return returnable;
}

function Game(props){

    if(true) { //COMPUTERPLAYS
	useEffect(() => {
	setTimeout(()=>{
	    if(props.moveCount%2==1) {
		let pm = possibleMoves(true,props.causesCheck,10,props.setDbg, props.dbgString)
		let move = pm[Math.floor(Math.random()*pm.length)];
		props.movePiece(move.n, move.x, move.y, true);
		//		props.setBlacksTurn(false);
	    }else{
		//		props.setBlacksTurn(true);
		if(true) { //ZEROPLAYER
		    let pm = possibleMoves(false,props.causesCheck,10,props.setDbg, props.dbgString)
		    let move = pm[Math.floor(Math.random()*pm.length)];
		    props.movePiece(move.n, move.x, move.y, true);  
		    //		    props.setBlacksTurn(true);
		}
	    }
	},1);	},[props.moveCount]);}
    //		  /*,[props.moveCount]*/);}
    

    return(
	<View style={{width:1000, height:1000}}><View style={{flex:0.2}}/><View>
	<Sprite pixelSize={42} sprite={Art.board} ></Sprite>	     
	</View>
	<GameInner boardx={props.boardx} canMove={props.canMove} movePiece={props.movePiece} setDbg={props.setDbg} dbgString={props.dbgString}
	causesCheck={props.causesCheck} moveCount={props.moveCount}
	/>
	    <View style={{flex:0.2}} ><Text>{"MOVE " + props.moveCount + (props.moveCount%2>0?' BLACK':' WHITE')}</Text></View>
	</View>);
}

//Can be in App?
function canMakeAMove(blackness,causesCheck){
    let returnable = false;
    pieces.filter((t)=>t.blackness==blackness && !t.dead).forEach((t)=> {
	for(let i=0; i<8; ++i){
	    for(let j=0; j<8; ++j){
		if(!returnable){
		    let cm=t.canMove(t.blackness,t.x,t.y,i,j);
		    if(cm) {
			let nocheck= !causesCheck(t.n,i,j);
			if(cm && nocheck) { returnable = true; }
		    }
    }}}});
    return returnable;
}


let dbg='INIT'
//let count=0;
const App = ()=>{
    const [boardx, setBoardx] = useState(pieces)
    const [dbgString, setDbg] = useState(dbg)
    const [moveCount, setMoveCount] = useState(0)
    
    const causesCheck=/*useCallback(*/(n, x, y)=> {
	let prime=[...boardx]

	const boardxn = boardx.filter(t=>t.n==n)[0]
	
	//Capture anything there
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != boardxn.blackness && !t.dead)
	if(enemy.length==1) { enemy[0].dead=true; }

	let savex=boardxn.x; let savey=boardxn.y;
	boardxn.x=x; boardxn.y=y;
	let returnable = isChecked(boardxn.blackness/*, setDbg, dbgString*/);
	boardxn.x=savex;
	boardxn.y=savey;
	if(enemy.length==1) { enemy[0].dead=false; }
	setBoardx(prime)
	return returnable
    }//,[boardx,moveCount])
    
    const movePiece = /*useCallback(*/(n, x, y, prechecked)=> {

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
	const enemy=prime.filter((t)=>t.x==x && t.y==y && t.blackness != boardxn.blackness && !t.dead)
	if(enemy.length==1) { enemy[0].dead=true; }

	let savex=boardxn.x;
	let savey=boardxn.y;
	boardxn.x=x;
	boardxn.y=y;

	//TODO PRECHECKED LOGIC IS ALLOWING UNCORRECTED CHECK RESPONSES!!!
	if(!prechecked && isChecked(boardxn.blackness/*,setDbg, dbgString*/)){
	    //Uh-oh! Revert illegal check-causing move.
	    boardxn.x=savex;
	    boardxn.y=savey;
	    if(enemy.length==1) { enemy[0].dead=false; }
	    setBoardx(prime)
	}else{
	    //SUCCESSFUL MOVE
	    boardxn.dirtiness=true;
	    setBoardx(prime)
	    if(!canMakeAMove(!boardxn.blackness, causesCheck)){
		if(isChecked(!boardxn.blackness/*,setDbg,dbgString*/)){
		    alert('CHECKMATE! WINNER: ' + (boardxn.blackness?'BLACK':'WHITE') )
		}else{
		    alert('STALEMATE')
		}
	    }
	    //	    isChecked(!boardxn.blackness,setDbg,dbgString)	    
	    //	    setBlacksTurn(!prechecked); //TODO may be superfluous
	   	    setMoveCount(moveCount+1);
	    //	    if(moveCount>0)	    alert(moveCount)
	}
    }/*)*/

    //    useEffect(()=>alert(moveCount),[moveCount])
    
    const canMove = /*useCallback(*/(n, toX, toY) => {
	const boardxn = boardx.filter(t=>t.n==n)[0]	
	return boardxn.canMove(boardxn.blackness,boardxn.x,boardxn.y,toX,toY)
    }//,[boardx,moveCount])
    
    return(<Game boardx={boardx} movePiece={movePiece} causesCheck={causesCheck} setDbg={setDbg} dbgString={dbgString}  canMove={canMove}
	moveCount={moveCount} setMoveCount={setMoveCount} boardx={boardx}
	/>);    
}    

export default App;
