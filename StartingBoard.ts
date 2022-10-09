import Rook from './Rook';
import Pawn from './Pawn';
import Bishop from './Bishop';
import Knight from './Knight';
import King from './King';
import Queen from './Queen';

const StartingBoard = {

 State: ()=> [
	{ sprite:Pawn.Black, x:0, y:1, n:0, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value, dirtiness: false ,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:1, y:1, n:1, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: 1 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:2, y:1, n:2, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:3, y:1, n:3, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:4, y:1, n:4, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:5, y:1, n:5, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:6, y:1, n:6, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.Black, x:7, y:1, n:7, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Rook.Black, x:0, y:0,n:16, canMove: Rook.CanMove, blackness: true,  kingness: false, deadness: false, value: 5 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Rook.Black, x:7, y:0,n:17, canMove: Rook.CanMove, blackness: true,  kingness: false, deadness: false, value: 5 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Bishop.Black, x:2, y:0, n:18, canMove: Bishop.CanMove, blackness: true,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Bishop.Black, x:5, y:0, n:19, canMove: Bishop.CanMove, blackness: true,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Queen.Black, x:3, y:0, n:20, canMove: Queen.CanMove, blackness: true, kingness: false,  deadness: false, value: 9 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:King.Black, x:4, y:0, n:21, canMove: King.CanMove, blackness: true,  kingness: true,deadness: false, value: 0 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Knight.Black, x:1, y:0, n:30, canMove: Knight.CanMove, blackness: true,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Knight.Black, x:6, y:0, n:31, canMove: Knight.CanMove, blackness: true,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:0, y:6, n:8, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:1, y:6, n:9, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:2, y:6, n:10, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:3, y:6, n:11, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:4, y:6, n:12, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:5, y:6, n:13, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:6, y:6, n:14, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Pawn.White, x:7, y:6, n:15, canMove: Pawn.CanMove, blackness: false, kingness: false,  deadness: false, pawnness: true, value: Pawn.Value , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Rook.White, x:7, y:7, n:22, canMove: Rook.CanMove, blackness: false,  kingness: false, deadness: false, value: 5 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Rook.White, x:0, y:7, n:23, canMove: Rook.CanMove, blackness: false,  kingness: false, deadness: false, value: 5 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Bishop.White, x:2, y:7, n:24, canMove: Bishop.CanMove, blackness: false,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Bishop.White, x:5, y:7, n:25, canMove: Bishop.CanMove, blackness: false,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Queen.White, x:3, y:7, n:26, canMove: Queen.CanMove, blackness: false, kingness: false,  deadness: false, value: 9 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:King.White, x:4, y:7, n:27, canMove: King.CanMove, blackness: false,  kingness: true,deadness: false, value: 0 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Knight.White, x:1, y:7, n:28, canMove: Knight.CanMove, blackness: false,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
	{ sprite:Knight.White, x:6, y:7, n:29, canMove: Knight.CanMove, blackness: false,  kingness: false, deadness: false, value: 4 , dirtiness: false,justAdvancedTwo: false },
    ],
};

export {StartingBoard as default};