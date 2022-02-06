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
    canMakeAMove: (blackness,causesCheck,pieces) => {
	let returnable = false;
	pieces.filter((t)=>t.blackness==blackness && !t.deadness).forEach((t)=> {
	    for(let i=0; i<8; ++i){
		for(let j=0; j<8; ++j){
		    if(!returnable){
			let cm=t.canMove(t.blackness,t.x,t.y,i,j,pieces);
			if(cm) {
			    let nocheck= !causesCheck(t.n,i,j);
			    if(cm && nocheck) { returnable = true; }
			}
		    }}}});
	return returnable;
    },
};

export {Movement as default};
