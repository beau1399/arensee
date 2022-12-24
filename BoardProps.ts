import {PieceProps} from './PieceProps';

export interface BoardProps {
    boardState: PieceProps[];
    causesSelfCheck: (x: number, y: number, n: number)=>boolean;
    causesEnemyCheck: (n:number, x:number, y:number)=>boolean;
    movePiece: (n:number, x:number, y:number, checked:boolean)=>void;
    moveCount: number;
}
