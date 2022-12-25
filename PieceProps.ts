import {BoardStatePiece} from './BoardStatePiece';

export interface PieceProps {
    deadness:boolean;
    x:number;
    y:number;
    n:number;
    moveCount:number;
    board:BoardStatePiece[];
    causesSelfCheck: (n:number, i:number, j:number)=>boolean;
    causesEnemyCheck: (n:number, i:number, j:number)=>boolean;
    movePiece:(n:number, x:number, y:number, checked:boolean)=>void;
    sprite:string[];
}
