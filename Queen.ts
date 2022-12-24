import Movement from './Movement';
import Rook from './Rook'; //Is this really how we want to do this TODO?
import Bishop from './Bishop';
import {PieceProps} from './PieceProps';

const Queen = {
    CanMove: (blackness: boolean, x:number, y:number, toX:number, toY:number, pieces:PieceProps[])=> 
        Rook.CanMove(blackness,x,y,toX,toY,pieces) || Bishop.CanMove(blackness,x,y,toX,toY,pieces),
    
        Value: 9,
        White: 
         [
	     '         ',
	     '@ @ @ @ @',
	     ' @ @ @ @ ',
	     '  """""  ',
	     ' "@@@@@" ',
	     '`"""@"""`',
	     '"@@@"@@@"',
	     '`@@@@@@@`',
	     '``@@@@@``',
	     '``0@@@0``',
	     ' @@@@@@@ ',
	     '`````````'
         ],    
        
        Black:
         [
	     '         ',
	     'k k k k k',
	     ' k k0k k ',
	     '  kkkkk  ',
	     ' "ooooo" ',
	     '`okkokko`',
	     '"oookooo"',
	     '`ooooooo`',
	     '``ooooo``',
	     '```ooo```',
	     ' ooooooo ',
	     'ooooooooo'	
         ],

    };

export {Queen as default};
