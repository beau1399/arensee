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
};

export {Movement as default};
