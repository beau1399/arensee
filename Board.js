import React, {Component} from 'react';
import {View} from 'react-native';
import Constants from './Constants';
import Movement from './Movement';
import Sprite from './Sprite';
import Draggable from 'react-native-draggable';
import {styles} from './Styles'
import {Piece} from './Piece'

export function Board(props){
    return(<>
	{props.boardState.map((t)=>(
	    <Piece n={t.n} key={t.n} deadness={t.deadness} x={t.x} y={t.y} sprite={t.sprite}
	    causesCheck={props.causesCheck} movePiece={props.movePiece}  
	    moveCount={props.moveCount} board={props.boardState}
	    />))}
	</>
    )
}
