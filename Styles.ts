import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    centeredView: {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
	marginTop: 22
    },
    chessboardView: {width:"100%", height:"100%", flexDirection:"column"},
    boardSquare: {flex:1, flexGrow:1},
    button:{backgroundColor:"rgba(192,192,192,0.8)", borderRadius:4},
    pieceWrapper: {width:35, height:45},
    gameWrapper: {width: '100%', height:'100%'},
    modalButton: {padding:10, backgroundColor:"rgba(32,32,32,0.2)", color:"black"},
    textBanner: {flex:0.2},
    boardCenterer: {flexDirection:"row"},
    modalText: {color:"black", fontSize:22, fontWeight:"bold"},
    whiteSquareColor: "pink",
    blackSquareColor: "red",
    boardRow: {flexDirection:"row", flex:1},
});

