const Engine = {

    PossibleMoves: (blackness,causesCheck,max,pieces)=>{
	let returnable = [];
	pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
	    if(returnable.length<max){
		for(let i=0; i<8; ++i){
		    for(let j=0; j<8; ++j){
			if(returnable.length<max){
			    let cm=t.canMove(t.blackness,t.x,t.y,i,j,pieces);
			    if(cm){
				let nocheck= !causesCheck(t.n,i,j);
				if(nocheck) {
				    //TODO this doesn't really encompass enpassant. Hurts performance in some mild way.
				    let takenPiece=pieces.filter(u=>u.blackness!=blackness && !u.deadness && u.x==i && u.y==j)[0]?.value ?? 0;
				    returnable.push({n:t.n, x:i, y:j, takenPiece:takenPiece});				    
				}
			    }
			}
		    }}}});
	returnable = returnable.sort((a,b) => b.takenPiece - a.takenPiece);
//	alert(JSON.stringify(returnable));
	return returnable;
    },
};

export {Engine as default};
