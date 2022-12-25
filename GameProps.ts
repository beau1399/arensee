export interface GameProps {
    modalVisible: string | undefined;
    moveCount: number;
    causesSelfCheck: (n:number, i:number, j:number)=>boolean;
    causesEnemyCheck:(n:number, i:number, j:number)=>boolean;
    boardState: any;
    movePiece:(n:number, x:number, y:number, checked:boolean)=>void;
    setModalVisible: (value: string|undefined | ((prevVar: string|undefined) => string|undefined)) => void; 
    ResetBoard:()=>void;
}
