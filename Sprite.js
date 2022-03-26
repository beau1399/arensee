import React from 'react';
import { View } from 'react-native';

function Sprite(props) {
    let markup=[];
	markup = (<View style={{flexDirection: "column"}}>				    
	    {props.sprite.map((t,i)=>{
		return (<View key={i} style={{width:1, height:props.pixelSize, flexDirection: "row"}}>
		    {t.split('').map((u,j)=>{
			return (<View key={j+","+i}  style={{width:props.pixelSize, height:props.pixelSize,
							     backgroundColor:props.letterToColor[u]}} />);})}
		    </View>);})}
	    </View>
	);
    return <View>{markup}</View>
}

export default Sprite;
