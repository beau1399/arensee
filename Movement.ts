import Constants from './Constants';
import {BoardStatePiece} from './BoardStatePiece';
import {Piece} from './Piece';
import {GestureResponderEvent} from "react-native";

const Movement = {

    NoInterveningPiece: (x:number, y:number, toX:number, toY:number, pieces:BoardStatePiece[]) =>
        {
            var returnable=true;
            const signX=Math.sign(toX-x);
            const signY=Math.sign(toY-y);
            for(let i=1; i<Math.max(Math.abs(toX-x),Math.abs(toY-y)); i+=1){
                pieces.forEach((pt,pi)=>{ if(pt.x==x+signX*i && pt.y==y+signY*i && !pt.deadness){returnable=false;}   });
            }
            return returnable;
        },

    CanMakeAMove: (blackness:boolean, causesSelfCheck:(x: number, y: number, n: number)=>boolean, pieces:BoardStatePiece[]) => {
        let returnable = false;
        pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
            //A chessboard is 8x8...
            for(let i=0; i<8; ++i){
                for(let j=0; j<8; ++j){
                    if(!returnable){
                        // We call canMove, and also exclude the "null" or "identity" move
                        let cm=(t.x!=i || t.y!=j) &&  t.canMove(t.blackness,t.x,t.y,i,j,pieces);
                        if(cm) {
                            let nocheck= !causesSelfCheck(t.n,i,j);
                            if(cm && nocheck) { returnable = true; }
                        }
        }}}});
        return returnable;
    },
    
    Castling : (targetX:number, targetY:number, piecesn:BoardStatePiece, pieces:BoardStatePiece[], n:number, t:Piece) => {
        // Castling... if this were in kingCanMove, then the computer could use it...
        if(piecesn.kingness && Math.abs(targetX-piecesn.x)==2 && Math.abs(targetY-piecesn.y)==0){
            if(!Movement.NoInterveningPiece(piecesn.x,piecesn.y,targetX,targetY,pieces)){
                // Piece in way
            }else{
                const left = (targetX==2);
                if(left){
                    const castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==0)[0]
                    if(castle && !castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
                        if(!t.props.causesSelfCheck(n,piecesn.x-1,targetY) && !t.props.causesSelfCheck(n,piecesn.x-2,targetY)){
                            t.props.movePiece(n,piecesn.x-2,targetY,false);
                            t.props.movePiece(castle.n,castle.x+3,castle.y,false); }}
                }else{
                    const castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==7)[0]
                    if(castle && !castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
                        if(!t.props.causesSelfCheck(n,piecesn.x+1,targetY) && !t.props.causesSelfCheck(n,piecesn.x+2,targetY)){
                            t.props.movePiece(n,piecesn.x+1,targetY,false);
                            t.props.movePiece(n,piecesn.x+2,targetY,false);
                            t.props.movePiece(castle.n,castle.x-2,castle.y,false); }}
                }
            }
        }
    },
    
    Release: (e:GestureResponderEvent, t:Piece) => {
        const pieces = t.props.board;
        const targetX = (Math.floor((e.nativeEvent.pageX) / (Constants?.SquareWidth||0)));
        const targetY = (Math.floor((e.nativeEvent.pageY-Constants.UserPerspectiveCompensator) / (Constants?.SquareHeight||0)));
        if (targetX>7 || targetY>7 || targetX<0 || targetY<0) { return; }
        const n=t.props.n;
        const piecesn=pieces.filter((u:BoardStatePiece)=>u.n==n)[0];
        const blackGo = t.props.moveCount%2==1
        if(blackGo != piecesn.blackness){return}
        Movement.Castling (targetX, targetY, piecesn, pieces, n, t);
        if((targetX!=piecesn.x || targetY!=piecesn.y) &&
           piecesn.canMove(piecesn.blackness,piecesn.x,piecesn.y,targetX,targetY,pieces)){
            t.props.movePiece(n,targetX,targetY,false); }
    }
};

export {Movement as default};
