export interface GameProps {
    modalVisible: booean;
    moveCount: number;
    causesSelfCheck: (n:number, i:number, j:number)=>boolean;
    causesEnemyCheck:(n:number, i:number, j:number)=>boolean;
    boardState: any;
    movePiece:(n:number, x:number, y:number, checked:boolean)=>void;
    setModalVisible:Dispatch<SetStateAction<string | undefined>>;
    ResetBoard:()=>void;
}
