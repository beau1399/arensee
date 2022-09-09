import {Dimensions} from 'react-native';

const Constants = {
    
    //Tweakable parameters for build
    Difficulty: 100000, // How many potential moves should chess engine iterate over
    Players: 1,
    CheckValue: 10, // How highly does the chess engine value putting opponent in check, in points (pawn=1, bishop=4, etc.)

    //A few things you probably don't need to change (dimensions, initial piece position, etc.) are grouped below.
    // However, this section does give some insight into the overall rendering scheme used. The Draggable component
    // (from react-native-draggable) really works best when it's positioned in screen coordinates,
    // independent of everything else.
    //
    // Here, such a drag-and-drop coordinate system, based around board squares and piece renderings one-eighth
    // of the screen dimensions (since a chessboard is 8x8), is used. This screen / drag coordinate system is
    // superimposed atop the chessboard, which is build using flexboxes with flexGrow set to 1 and the sizes set
    // to 100%. Because both the flexbox matrix and the drag-and-drop renderings span the entire screen, they are
    // synchronized, i.e. movement and positioning of pieces (screen coordinate driven) lines up correctly with
    // the flexbox-based board.
    //
    // At the lowest, smallest level, both the Sprite and Tile components (used to build the pieces and the board,
    //  respectively) use flexbox to achieve raster effects.
    //
    SquareWidth: Dimensions.get('window').width / 8.0,
    SquareHeight: Dimensions.get('window').height / 8.0,
    SpritePixelSize: 3,
    SpriteWidth: 10,
    
    // Ease piece movement by adding some slight, static perspective to compensate of relative position
    //  of user and phone. Some fraction of a single board square works well.
    UserPerspectiveCompensator: Dimensions.get('window').height / 8.0 / 5.0,

    // Game-wide color palette for Tile and Sprite components
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
