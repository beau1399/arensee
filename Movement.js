import King from './King'

const Movement = {

    NoInterveningPiece: (x,y,toX,toY,pieces) =>
        {
            var returnable=true;
            const signX=Math.sign(toX-x);
            const signY=Math.sign(toY-y);
            for(let i=1; i<Math.max(Math.abs(toX-x),Math.abs(toY-y)); i+=1){
                pieces.forEach((pt,pi)=>{ if(pt.x==x+signX*i && pt.y==y+signY*i && !pt.deadness){returnable=false;}   });
            }
            return returnable;
        },

    CanMakeAMove: (blackness,causesSelfCheck,pieces) => {
        let returnable = false;
        pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
            for(let i=0; i<8; ++i){
                for(let j=0; j<8; ++j){
                    if(!returnable){
                        // We call canMove, and also exclude the "null" or "identity" move
                        let cm=(t.x!=i || t.y!=j) &&  t.canMove(t.blackness,t.x,t.y,i,j,pieces);
                        if(cm) {
                            let nocheck= !causesSelfCheck(t.n,i,j);
                            if(cm && nocheck) { returnable = true; }
                        }
        }}}});
        return returnable;
    },
    
    Release: (e,t) => {
        const pieces = t.props.board;
        const targetX = (Math.floor((e.nativeEvent.pageX-9) / 42));
        const targetY = (Math.floor((e.nativeEvent.pageY-138) / 42));
        if (targetX>7 || targetY>7 || targetX<0 || targetY<0) { return; }
        const n=t.props.n; //Should we really access stuff this way? TODO
        const piecesn=pieces.filter((u)=>u.n==n)[0];
        const blackGo = t.props.moveCount%2==1
        if(blackGo != piecesn.blackness){return}
        King.Castling (targetX, targetY, piecesn, pieces, n, t);
        if((targetX!=piecesn.x || targetY!=piecesn.y) &&
           piecesn.canMove(piecesn.blackness,piecesn.x,piecesn.y,targetX,targetY,pieces)){
            t.props.movePiece(n,targetX,targetY); }
    }
};

export {Movement as default};
