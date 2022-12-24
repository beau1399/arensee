import React, {Component} from 'react';
import {View} from 'react-native';
import {Piece} from './Piece'
import {BoardProps} from './BoardProps';

//
// Component "Board"
//
//  This renders the pieces as they stand at any given point in the game. As such it's
//  just a "map" from props.boardState to a bunch of "Piece" components.
//
//
export function Board(props:BoardProps){
    return(<>
        {props.boardState.map((t)=>(
            <Piece n={t.n} key={t.n} deadness={t.deadness} x={t.x} y={t.y} sprite={t.sprite}
                   causesSelfCheck={props.causesSelfCheck} causesEnemyCheck={props.causesEnemyCheck} movePiece={props.movePiece}  
                   moveCount={props.moveCount} board={props.boardState}
            />))}
    </>
    )
}
