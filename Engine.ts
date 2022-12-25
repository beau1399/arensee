import Pawn from './Pawn';
import Constants from './Constants';
import {BoardStatePiece} from './BoardStatePiece';

interface PossibleMove {
    //Piece index to move
    n: number;
    //Where to send it
    x: number;
    y: number;
    //Value of taken piece if any
    takenPiece: number;
}

const Engine = {
    // Returns possible moves for a color, sorted from best to worst.
        PossibleMoves: (blackness: boolean,
                        causesSelfCheck: (n:number, i:number, j:number)=>boolean,
                        causesEnemyCheck:(n:number, i:number, j:number)=>boolean,
                        max:number,
                        pieces:BoardStatePiece[]) : PossibleMove[] =>{
                            let returnable:PossibleMove[] = [];
                            pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
                                if(returnable.length<max){
                                    // A chessboard is 8x8...
                                    for(let i=0; i<8; ++i){
                                        for(let j=0; j<8; ++j){
                                            if(returnable.length<max){
                                                const cm= (t.x!=i || t.y!=j) && t.canMove(t.blackness,t.x,t.y,i,j,pieces);
                                                if(cm){
                                                    const noSelfCheck= !causesSelfCheck(t.n,i,j);
                                                    if(noSelfCheck) {
                                                        let takenPiece=pieces.filter(u=>u.blackness!=blackness && !u.deadness && u.x==i && u.y==j)[0]?.value ?? 0;
                                                        const enemyCheck= causesEnemyCheck(t.n,i,j);

                                                        if(enemyCheck){ takenPiece += Constants.CheckValue; /*Valuate any check-causing move*/ }

                                                        //Account for capture en passant 
                                                        const {enpassant,capturedX,capturedY} =
                                                            Pawn.EnPassant(t.blackness,t?.pawnness||false,t.x,t.y,i,j,pieces);                                    
                                                        if(enpassant) { takenPiece=Pawn.Value; }                                
                                                        returnable.push({n:t.n, x:i, y:j, takenPiece:takenPiece});
                                                    }
                                                }
                                            }
                            }}}});
                            returnable = returnable.sort((a,b) => b.takenPiece - a.takenPiece);
                            return returnable;
                        },
};

export {Engine as default};
