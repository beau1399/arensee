import Movement from './Movement';
import {BoardStatePiece} from './BoardStatePiece';

const Rook = {

    CanMove: (blackness: boolean, x:number, y:number, toX:number, toY:number, pieces:BoardStatePiece[])=> 
        (x==toX || y==toY) &&                                                                                                   
        !pieces.some((t)=> t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) &&
        Movement.NoInterveningPiece(x,y,toX,toY,pieces),
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

export {Rook as default};
