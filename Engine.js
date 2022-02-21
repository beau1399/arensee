import Pawn from './Pawn';

const Engine = {
    // Returns possible moves for a color, sorted from best to worst.
    PossibleMoves: (blackness,causesCheck,max,pieces)=>{
	let returnable = [];
	pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
	    if(returnable.length<max){
		for(let i=0; i<8; ++i){
		    for(let j=0; j<8; ++j){
			if(returnable.length<max){
			    let cm=t.canMove(t.blackness,t.x,t.y,i,j,pieces);
			    if(cm){
				let nocheck= !causesCheck(t.n,i,j);
				if(nocheck) {
				    let takenPiece=pieces.filter(u=>u.blackness!=blackness && !u.deadness && u.x==i && u.y==j)[0]?.value ?? 0;

				    //Account for capture en passant 
				    const {enpassant,capturedX,capturedY} =
					  Pawn.EnPassant(t.blackness,t.pawnness,t.x,t.y,i,j,pieces);
				    

				    // BIG TODO - give +++ credit for moves that cause check

				    if(enpassant) { takenPiece=1; }				   
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
