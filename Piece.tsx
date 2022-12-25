import React, {Component} from 'react';
import {View} from 'react-native';
import Constants from './Constants';
import Movement from './Movement';
import Sprite from './Sprite';
import Draggable from 'react-native-draggable';
import {styles} from './Styles';
import {PieceProps} from './PieceProps';

//
// Component "Piece" - a single instance of a piece. 
//
//
export class Piece extends React.Component<PieceProps,{}> {
    constructor(props: PieceProps){super(props);}
    
    render(){
	if(this.props.deadness) return null; // No rendering if piece has been captured
        //TODO THIS PATTERN OF (?.||0) SHOULD BE REFACTORED!!!!

	return (
	    <Draggable shouldReverse={true /*We'll handle the positioning*/ }
 	               renderSize={Constants?.SquareWidth||0} x={ this.props.x * (Constants?.SquareWidth||0) + ((Constants?.SpriteWidth||0) / 2.0)}
	               y={this.props.y * (Constants?.SquareHeight||0) + ((Constants?.SquareHeight||0) / 2.0)} onDragRelease={(event)=>{Movement.Release(event,this)}}>
	        
	        {/*This view immediately inside draggable seems to be required to establish the rectangle in which your finger will grab it.*/}
	        <View>
	            <View style={styles.pieceWrapper}>
  	                <Sprite x={0} y={0} sprite={this.props.sprite} pixelSize={Constants?.SpritePixelSize||0} letterToColor={Constants.LetterToColor} />
	            </View>
	        </View>

	    </Draggable>
	);
    }
}
