import Movement from './Movement';
import {BoardStatePiece} from './BoardStatePiece';

const King = {
    CanMove: (blackness: boolean, x:number, y:number, toX:number, toY:number, pieces:BoardStatePiece[])=> {
	return (Math.abs(toX-x)<=1 && Math.abs(toY-y)<=1
	     && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness)
    )},
    
    White: 
    [
	"         ",
	"         ",
	"    0    ",
	"   000   ",
	"    0    ",
	"  ``0``  ",
	" `@@0@@` ",
	"`@@@@@@@`",
	"`@@@@@@@`",
	"``@@@@@``",
	" 0000000 ",
	"`````````"
    ],    
    
    Black:
    [
	"         ",
	"         ",
	"    ,    ",
	"   ,,,   ",
	"    ,    ",
	"  ,,,,,  ",
	" ,00,00, ",
	",0000000,",
	",0000000,",
	",o00000o,",
	" ,,,,,,, ",
	",,,,,,,,,"
    ],

};

export {King as default};
