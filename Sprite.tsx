import React from 'react';
import { View } from 'react-native';

//
// Component "Sprite" - a raster component build around flexbox layout
//
// Props establish pixel size, appearance string, and the character-to-color mapping
//  that gives context to the appearance string and allows it to be rendered.
//
/*
          <Sprite pixelSize={24}
                  sprite={["x.",".x"]}
                  letterToColor={{"x":"yellow", ".":"brown"}} />
*/
//
function Sprite(props) {
    const markup = (<View style={{flexDirection: "column"}}>				    
	    {props.sprite.map((t,i)=>{
		return (<View key={"sprite-outer-" + i + props.x + props.y} style={{width:1, height:props.pixelSize, flexDirection: "row"}}>
		    {t.split('').map((u,j)=>{
			return (<View key={"sprite-inner-" + (i * 100 + j) + props.x + props.y} style={{width:props.pixelSize, height:props.pixelSize,
							     backgroundColor:props.letterToColor[u]}} />);})}
		    </View>);})}
	    </View>
	);
    return <View>{markup}</View>
}

export default Sprite;
