import React, {Component} from 'react';
import {View} from 'react-native';
import Constants from './Constants';
import Movement from './Movement';
import Sprite from './Sprite';
import Draggable from 'react-native-draggable';
import {styles} from './Styles'

//
// Component "Piece" - a single instance of a piece. 
//
//
export class Piece extends Component {
    constructor(props){super(props);}
    
    render(){
	if(this.props.deadness) return null; // No rendering if piece has been captured
	return (
	    <Draggable shouldReverse={true /*We'll handle the positioning*/ }
	    renderSize={Constants.SquareWidth } x={ this.props.x * Constants.SquareWidth + (Constants.SpriteWidth / 2.0)}
	    y={this.props.y * Constants.SquareHeight + (Constants.SquareHeight / 2.0)} onDragRelease={(event)=>{Movement.Release(event,this)}}>
	    
	    {/*This view immediately inside draggable seems to be required to establish the rectangle in which your finger will grab it.*/}
	    <View>
	    <View style={styles.pieceWrapper}>
  	    <Sprite sprite={this.props.sprite} pixelSize={Constants.SpritePixelSize} letterToColor={Constants.LetterToColor} />
	    </View>
	    </View>

	    </Draggable>
	);
    }
}
