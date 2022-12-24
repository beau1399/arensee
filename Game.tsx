import React, {Component, useEffect} from 'react';
import {View, Text, Modal, Pressable, NativeModules} from 'react-native';
import Constants from './Constants';
import Sprite from './Sprite';
import Tile from './Tile';
import {Board} from './Board'
import {styles} from './Styles'
import Engine from './Engine';
import {GameProps} from './GameProps';

const { RNPlayNative } = NativeModules;

//
// Component "Game"
//
// This is the outermost container in the component hierarchy, and also where computer chess engine is invoked
//  for 0-player and 1-player games.
//
export function Game(props:GameProps){

    // Handle computer movement when necessary
    if(!props.modalVisible) { // Modal presents game result; don't make any computer moves while it's open
        if(Constants.Players==1) { // Human-vs.-computer mode... 
            useEffect(() => {
                if(props.moveCount%2==1) {
                    // Run the engine and make a computer move for moves 1,3,5 etc. (human is white pieces)
                    const pm = Engine.PossibleMoves(true,props.causesSelfCheck,props.causesEnemyCheck,Constants.Difficulty,props.boardState)
                    const move = pm[0];
                    setTimeout(()=>{props.movePiece(move.n, move.x, move.y, true);}, 500)
                }
            },[props.moveCount]);

        }else if(Constants.Players==2){
            //We don't need to do any computer-driven moving if 2 players

        }else{ // Computer vs. computer
            useEffect(() => {
                setTimeout(()=>{
                    if(props.moveCount%2==1) {
                        // Black's turn
                        const pm = Engine.PossibleMoves(true,props.causesSelfCheck,props.causesEnemyCheck,Constants.Difficulty,props.boardState)
                        const move = pm[0];
                        props.movePiece(move.n, move.x, move.y, true);
                    }else{
                        // White's turn... either way, we're running the engine and moving based on result
                        const pm = Engine.PossibleMoves(false,props.causesSelfCheck,props.causesEnemyCheck,Constants.Difficulty,props.boardState)
                        const move = pm[0];
                        props.movePiece(move.n, move.x, move.y, true);  
                    }
                },250);
            },[props.moveCount]);
        }
    }

    let keyMaker=0;
    return(
        <View style={styles.gameWrapper}>

            {/*The chessboard*/}
            <View style={styles.chessboardView}>{
                [...Array(Constants.BoardWidthInSquares).keys()].map((t,i)=>            
                    (<View style={styles.boardRow} key={"board0" + ++keyMaker}>
                        {[...Array(Constants.BoardWidthInSquares).keys()].map((u,j)=>
                            {                            let squareColoration=i%2==j%2 ? styles.whiteSquareColor : styles.blackSquareColor;
                                
                                return (<View key={"board1" + ++keyMaker}
                                              style={{ ...styles.boardSquare, ...squareColoration }}>           
                                </View>
                            )}
                        )}                   
                    </View>)                
                )}</View>
            
            {/*The pieces*/}
            <Board boardState={props.boardState} movePiece={props.movePiece} causesSelfCheck={props.causesSelfCheck}
                   causesEnemyCheck={props.causesEnemyCheck} moveCount={props.moveCount} />

            {/*Modal, to announce mate &c.*/}
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} visible={props.modalVisible?true:false} >
                    <View style={styles.centeredView} >
                        <Text style={styles.modalText}>{props.modalVisible}</Text>
                        <Pressable style={styles.modalButton} onPress={() => {props.setModalVisible(undefined); props.ResetBoard();}} >
                            <Text>OK</Text>
                        </Pressable>
                    </View>
                </Modal>
            </View>
        </View>);
}
