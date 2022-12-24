import Movement from './Movement';
import {PieceProps} from './PieceProps';

const Knight = {
    CanMove: (blackness: boolean, x:number, y:number, toX:number, toY:number, pieces:PieceProps[])=> 
        (Math.abs(toX-x) + Math.abs(toY-y)==3) && toX!=x && toY!=y &&
            !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness),

    Black: [
        "    0     ",
        "   o000   ",
        " o0000000 ",
        "o000000kk ",
        "o000 00000",
        " o000  000",
        "  o0000   ",
        "  o00000  ",
        "  o000000 ",
        " oo000000 ",
        "o00000000o",
        "o00000000o"
    ],

    White: [
        "    @     ",
        "   o@@@   ",
        " o@@@@@@@ ",
        "o@@@@@@kk ",
        "o@@@ @@@@@",
        " o@@@  @@@",
        "  o@@@@   ",
        "  o@@@@@  ",
        "  o@@@@@@ ",
        " oo@@@@@@ ",
        "o@@@@@@@@o",
        "o@@@@@@@@o"
    ],    
};

export {Knight as default};
