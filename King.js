import Movement from './Movement';

const King = {
    CanMove: (blackness,x,y,toX,toY,pieces)=> {
	return (Math.abs(toX-x)<=1 && Math.abs(toY-y)<=1
	     && !pieces.some((t)=>t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness)
    )},

    Castling : (targetX, targetY, piecesn, pieces, n, t) => {
        // Castling... if this were in kingCanMove, then the computer could use it...
        if(piecesn.kingness && Math.abs(targetX-piecesn.x)==2 && Math.abs(targetY-piecesn.y)==0){
            if(!Movement.NoInterveningPiece(piecesn.x,piecesn.y,targetX,targetY,pieces)){
                // Piece in way
            }else{
                const left = (targetX==2);
                if(left){
                    let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==0)[0]
                    if(castle && !castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
                        if(!t.props.causesSelfCheck(n,piecesn.x-1,targetY) && !t.props.causesSelfCheck(n,piecesn.x-2,targetY)){
                            t.props.movePiece(n,piecesn.x-2,targetY);
                            t.props.movePiece(castle.n,castle.x+3,castle.y); }}
                }else{
                    let castle=pieces.filter(u=>u.blackness==piecesn.blackness && u.y==piecesn.y && u.x==7)[0]
                    if(castle && !castle.dirtiness && !piecesn.dirtiness && !castle.deadness && !piecesn.deadness) {
                        if(!t.props.causesSelfCheck(n,piecesn.x+1,targetY) && !t.props.causesSelfCheck(n,piecesn.x+2,targetY)){
                            t.props.movePiece(n,piecesn.x+1,targetY);
                            t.props.movePiece(n,piecesn.x+2,targetY);
                            t.props.movePiece(castle.n,castle.x-2,castle.y); }}
                }
            }
        }
    },
    
    White: 
    [
	"         ",
	"         ",
	"    0    ",
	"   000   ",
	"    0    ",
	"  ``0``  ",
	" `@@0@@` ",
	"`@@@@@@@`",
	"`@@@@@@@`",
	"``@@@@@``",
	" 0000000 ",
	"`````````"
    ],    
    
    Black:
    [
	"         ",
	"         ",
	"    ,    ",
	"   ,,,   ",
	"    ,    ",
	"  ,,,,,  ",
	" ,00,00, ",
	",0000000,",
	",0000000,",
	",o00000o,",
	" ,,,,,,, ",
	",,,,,,,,,"
    ],

};

export {King as default};
