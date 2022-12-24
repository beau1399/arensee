import Movement from './Movement';
import {PieceProps} from './PieceProps';


const Bishop = {
    CanMove: (blackness:boolean, x:number, y:number, toX:number, toY:number, pieces:PieceProps[])=> (Math.abs(toX-x)==Math.abs(toY-y))
					 && !pieces.some((t)=>
					     t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //Can't move atop same color piece
					 && Movement.NoInterveningPiece(x,y,toX,toY,pieces),

    White: 
    [
	"   @     ",
	"  `@@    ",
	' `@@@@   ',
	'`@@...`  ',
	' `@@@@   ',
	'  `@"    ',
	'  `@"    ',
	'  `@"    ',
	'  `@"    ',
	'  `@"    ',
	' `@@@@"  ',
	'`@@@@@@" '
    ],    
    
    Black:
    [
	"   0     ",
	"  000    ",
	" o0000   ",
	"o00...0  ",
	" o0000   ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	" ,0000o  ",
	",000000o "
    ],

};

export {Bishop as default};
