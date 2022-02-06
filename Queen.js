import Movement from './Movement';
import Rook from './Rook'; //Is this really how we want to do this TODO?
import Bishop from './Bishop';

const Queen = {
    CanMove: (blackness,x,y,toX,toY,pieces)=>Rook.CanMove(blackness,x,y,toX,toY,pieces) || Bishop.CanMove(blackness,x,y,toX,toY,pieces),    

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
