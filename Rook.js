import Movement from './Movement';

export default Rook = {
    CanMove:  (blackness,x,y,toX,toY,pieces)=> (x==toX || y==toY)
					  && (!(x==toX && y==toY)) //It is helpful for game logic to exclude the identity TODO refactor
					  && !pieces.some((t)=>
					      t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) //Can't move atop same color piece
					  && Movement.NoInterveningPiece(x,y,toX,toY,pieces),
    Black:
    [
	"         ",
	"0 0 0 0 0",
	"000000000",
	"o0000000o",
	" o00000o ",
	"  o000o  ",
	"  o000o  ",
	"  o000o  ",
	"  o000o  ",
	"  o000o  ",
	",0000000,",
	",0000000,"],

    White: 
    [
	"         ",
	"@ @ @ @ @",
	"@@@@@@@@@",
	"`@@@@@@@`",
	" `@@@@@` ",
	"  o@@@o  ",
	"  o@@@o  ",
	"  o@@@o  ",
	"  o@@@o  ",
	"  o@@@o  ",
	"`@@@@@@@`",
	"`@@@@@@@`"],    
};
