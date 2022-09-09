import React from 'react';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    centeredView: {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
	marginTop: 22
    },
    button:{backgroundColor:"rgba(192,192,192,0.8)", borderRadius:4},
    pieceWrapper: {width:35, height:45},
    gameWrapper: {width: '100%', height:'100%'},
    boardWrapper: {flex:0.315},
    modalButton: {padding:10, backgroundColor:"rgba(32,32,32,0.2)", color:"black"},
    textBanner: {flex:0.2},
    verticalShim: {flex:0.0125},
    boardCenterer: {flexDirection:"row"},
    modalText: {color:"black"},
});

