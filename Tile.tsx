//
// "Tile" is similar to "Sprite," but instead of relying on the
//   "pixelSize" property for sizing, it simply expands (and distorts)
//   to fill its container.
//
/*
          <Tile sprite={["x.",".x"]}
                  letterToColor={{"x":"yellow", ".":"brown"}} />
*/

import React from 'react';
import { View } from 'react-native';

function Tile(props) {
    const markup = (<View style={{flexDirection: "column", height:"100%", width:"100%"}}>				    
	                {props.sprite.map((t,i)=>{
		            return (<View key={"tile-outer-" + i + props.x + props.y} style={{height:props.pixelSize, flexDirection: "row", flex:1, flexGrow: 1}}>
		                        {t.split('').map((u,j)=>{
			                    return (<View key={"tile-inner-" + (i * 100 + j) + props.x + props.y}  style={{ flex:1, flexGrow: 1,
							                          backgroundColor:props.letterToColor[u]}} />);})}
		                    </View>);})}
	            </View>
	           );
    return <View>{markup}</View>
}

export default Tile;