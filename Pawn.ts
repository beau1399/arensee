import Movement from './Movement';
import {PieceProps} from './PieceProps';

const Pawn = {
    // We don't define a "Value" in every piece definition file. For pieces where this value would only be used in Constants.js,
    //  I didn't see the value in adding such an extra layer. That said, Pawn.Value is something used in multiple places (b/c
    //  of the unique ways in which pawns move), so I saw a need to factor out the "1" constant for pawns.
    Value: 1,
    EnPassant:  (blackness:boolean, pawnness:boolean, x:number, y:number, toX:number, toY:number, pieces:PieceProps[])=> {
	const happened = pawnness && (
	    //Black
	    (toY-y==1 && blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness))||
	    //White
	    (toY-y==-1 && !blackness && Math.abs(toX-x)==1 &&
	     pieces.some((t)=>t.x==toX && t.justAdvancedTwo && t.y==y && t.pawnness  && t.blackness!=blackness && !t.deadness)));
	return {enpassant:happened, capturedX:toX, capturedY:y}
    },
    
    CanMove:  (blackness:boolean, x:number, y:number, toX:number, toY:number, pieces:PieceProps[])=> {
	return ((toY-y==1 && blackness) ||    //Start with the vertical movement rules...
		(toY-y==-1 && !blackness) ||
		(toY-y==2 && blackness && y==1  && Movement.NoInterveningPiece(x,y,toX,toY,pieces)) ||
		(toY-y==-2 && !blackness && y==6  && Movement.NoInterveningPiece(x,y,toX,toY,pieces)) 	   
	)
        
        // No jumping by pawns
	    && Movement.NoInterveningPiece(x,y,toX,toY,pieces)

        // Enforce the horizontal movement rules
             &&(toX==x // Move straight ahead is OK

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
	    && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness)

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
