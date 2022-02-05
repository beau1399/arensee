import Movement from './Movement';


const Pawn = {

    EnPassant:  (blackness,pawnness,x,y,toX,toY,pieces)=> {
	const happened = pawnness && (
	    //Black
	    (toY-y==1 && blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness))||
	    //White
	    (toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness)));
	return {enpassant:happened, capturedX:toX, capturedY:y}
    },
    
    CanMove:  (blackness,x,y,toX,toY,pieces)=> {
	return ((toY-y==1 && blackness) ||
		(toY-y==-1 && !blackness) ||
		(toY-y==2 && blackness && y==1  && Movement.NoInterveningPiece(x,y,toX,toY,pieces)) ||
		(toY-y==-2 && !blackness && y==6  && Movement.NoInterveningPiece(x,y,toX,toY,pieces)) 	   
	)
        // No jumping by pawns
	    && Movement.NoInterveningPiece(x,y,toX,toY,pieces)

   &&(toX==x

		   //Capture (pawn)
		   // Customary diagonal capture, black
	      ||(toY-y==1 && blackness && Math.abs(toX-x)==1 &&
		 pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness))

		   // Customary diagonal capture, white
	      ||(toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
		 pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness))

		   //En passant
	      ||Pawn.EnPassant(blackness,true,x,y,toX,toY,pieces).enpassant

	       )


    &&
	       //No straight-on capture
	       (!( pieces.some((t)=>t.x==toX && t.y==toY && t.blackness!=blackness && !t.deadness) && toX==x	   ))
	    && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //TODO refactor    

    },

    Black:
    [
	"         ",
	"         ",
	"         ",
	"         ",
	"   0     ",
	"  000    ",
	" o0000   ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	" ,000o   ",
	",00000o  "
    ],

    White: 
    [
	"         ",
	"         ",
	"         ",
	"         ",
	"   @     ",
	"  @@@    ",
	" `@@@'   ",
	"  `@'    ",
	"  `@'    ",
	"  `@'    ",
	" `@@@'  ",
	"`@@@@@' "
    ],    
};

export {Pawn as default};
