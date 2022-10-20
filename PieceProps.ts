export interface PieceProps {
    x:number;
    y:number;
    sprite:string[];
    n:number;
    blackness:boolean;
    kingness:boolean;
    deadness:boolean;
    pawnness?:boolean;
    dirtiness:boolean;
    justAdvancedTwo:boolean;
    value:number;
    canMove?(blackness: boolean, x: number, y: number, targetX: number, targetY: number, pieces: PieceProps[]): any;
}