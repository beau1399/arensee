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
				if(cm && nocheck) { returnable.push({n:t.n, x:i, y:j}); }
			    }
			}
	}}}});
	return returnable;
    },
    
};

export {Engine as default};
