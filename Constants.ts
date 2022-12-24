import {Dimensions, StatusBar} from 'react-native';

interface thingtype {
    a:any;
    b:string;

}

const thing:thingtype={a:null, b:''};

interface ArenseeConstants {
    Difficulty: number;
    Players: number;
    CheckValue: number;
    BoardWidthInSquares: number;
    SquareWidth: number | undefined;
    SquareHeight: number | undefined;
    SpritePixelSize: number;
    SpriteWidth: number;
    UserPerspectiveCompensator: number;
    LetterToColor: (l:string)=>string|undefined;
}

const Constants:ArenseeConstants = {
    
    //Tweakable parameters for build
    Difficulty: 100000, // How many potential moves should chess engine iterate over
    Players: 1,
    CheckValue: 10,     // How highly does the chess engine value putting opponent in check, in points (pawn=1, bishop=4, etc.)
    BoardWidthInSquares: 8,

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
    // At the lowest, smallest level, both the Sprite and Tile components (used to bld the pieces and the board,
    //  respectively) use flexbox to achieve raster effects.
        //
    SquareWidth: Dimensions.get('window').width / 8.0,
    SquareHeight: (1.0 / 8.0) * (Dimensions.get('window').height - (StatusBar?.currentHeight || 0)),

    SpritePixelSize: 3,
    SpriteWidth: 10,
    
    // Ease piece movement by adding some slight, static perspective to compensate of relative position
    //  of user and phone. Some fraction of a single board square works well.
        UserPerspectiveCompensator: 10, //any) : (Dimensions.get('window').height ?? 0 - StatusBar.currentHeight ?? 0) / 8.0 / 5.0,

    LetterToColor:(l:string):string|undefined => {return (
        {"r":"red",
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
        }
    )[l]},
};

export {Constants as default};
