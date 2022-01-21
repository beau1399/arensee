import React from 'react';
import { View } from 'react-native';

const letterToColor={"r":"red",
		     "b":"blue",
		     "g":"green",
		     "p":"pink",
		     "w":"white",
		     "y":"yellow",
		     "k":"black",
		     ".":"rgb(20,20,20)",
		     ",":"rgb(70,70,70)",
		     "o":"rgb(120,120,120)",
		     "0":"rgb(170,170,170)",
		     "`":"rgb(190,190,190)",
		     "'":"rgb(210,210,210)",
		     '"':"rgb(230,230,230)",
		     "@":"rgb(250,250,250)",
		     " ":undefined
}

function Sprite(props) {
    let markup=[];
    if(Array.isArray(props.sprite[0])){
	markup = (<View style={{flexDirection: "column"}}>				    
	    {props.sprite.map((t,i)=>{
		return (<View key={i} style={{width:1, height:props.pixelSize, flexDirection: "row"}}>
		    {t.map((u,j)=>{return (<View key={j+","+i}  style={{width:props.pixelSize, height:props.pixelSize,backgroundColor:u}} />);})}
		    </View>);})}
	    </View>
	);
    }else{
	markup = (<View style={{flexDirection: "column"}}>				    
	    {props.sprite.map((t,i)=>{
		return (<View key={i} style={{width:1, height:props.pixelSize, flexDirection: "row"}}>
		    {t.split('').map((u,j)=>{
			return (<View key={j+","+i}  style={{width:props.pixelSize, height:props.pixelSize,
							     backgroundColor:letterToColor[u]}} />);})}
		    </View>);})}
	    </View>
	);
    }
    
    return <View>{markup}</View>
}

export default Sprite;
