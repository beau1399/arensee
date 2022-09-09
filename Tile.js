import React from 'react';
import { View } from 'react-native';
/*
          <Tile pixelSize={24}
                  sprite={["x.",".x"]}
                  letterToColor={{"x":"yellow", ".":"brown"}} />
*/

function Tile(props) {
    const markup = (<View style={{flexDirection: "column", height:"100%", width:"100%"}}>				    
	                {props.sprite.map((t,i)=>{
		            return (<View key={i} style={{height:props.pixelSize, flexDirection: "row", flex:1, flexGrow: 1}}>
		                        {t.split('').map((u,j)=>{
			                    return (<View key={j+","+i}  style={{ flex:1, flexGrow: 1,
							                          backgroundColor:props.letterToColor[u]}} />);})}
		                    </View>);})}
	            </View>
	           );
    return <View>{markup}</View>
}

export default Tile;
