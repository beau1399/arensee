import {Dimensions} from 'react-native';

const Constants = {
    
    //Tweakable parameters for build
    Difficulty: 100000, // How many potential moves should chess engine iterate over
    Players: 1,
    CheckValue: 10, // How highly does the chess engine value putting opponent in check, in points (pawn=1, bishop=4, etc.)

    //Things you probably don't need to change (dimensions, initial piece position, etc.) 
    SquareWidth: Dimensions.get('window').width / 8.0,
    SquareHeight: Dimensions.get('window').height / 8.0,
    SpritePixelSize: 3,
    SpriteWidth: 10,
    // Ease piece movement by adding some slight, static perspective to compensate of relative position
    //  of user and phone. Some fraction of a single board square works well.
    UserPerspectiveCompensator: Dimensions.get('window').height / 8.0 / 4.0,
    LetterToColor: {"r":"red",
		   "b":"blue",
		   "g":"green",
		   "p":"pink",
		   "w":"white",
		   "y":"yellow",
		   "k":"black",
		   ".":"rgb(20,20,20)",
		   ",":"rgb(70,70,70)",
		   "o":"rgb(120,120,120)",
		   "0":"rgb(170,170,170)",
		   "`":"rgb(190,190,190)",
		   "'":"rgb(210,210,210)",
		   '"':"rgb(230,230,230)",
		   "@":"rgb(250,250,250)",
		   " ":undefined
    },

};

export {Constants as default};
