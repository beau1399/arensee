# arensee
**R**eact **N**ative **C**hess


<img width="271" alt="Screen Shot 2022-03-26 at 11 34 51 AM" src="https://user-images.githubusercontent.com/42191239/160246582-225041a3-402f-4b69-b8f4-8fa57c172fb7.png">
 
Arensee is a computer chess game written in React Native. As cloned, it will build to an app where the human user plays white and the computer responds by playing black. Build-time parameters in file Constants.js can be tweaked to support two human players, or even computer-versus-computer play.

The chess engine used by the computer "player(s)" is rudimentary in nature. It is aggressive and lacks foresight. However, an obvious locus and interface are provided for chess engine improvements, in file Engine.js.

Arensee is noteworthy for its lack of dependencies. Other than React Native itself, I've added just a single NPM package called **react-native-draggable**. This seems pretty atypical of React Native applications to me, but as things unfolded I found that React Native provided ample facilities "right out of the box" for a chess game. In fact, the react user interface paradigm struck me as well-suited to a chess game, where state is central, evolving over time, and prominently presented visually. 

**Component *Sprite*** 

I will describe Arensee's code as I wrote it: from the bottom up, beginning with the question "how do I render a chessboard and pieces on the screen?". In the past I've used OpenGL ES and **react-native-canvas** with good results, but I didn't think what I needed here was a drawing engine per se. Rather, it seemed to me that these rendering tasks could be accomplished using a very raster-centric "pixel art" style reminiscent of the 8-bit era of home computing. Consider the image below, where a magnified version of my white bishop is shown with some illustrative guidelines:

![chessboard2](https://user-images.githubusercontent.com/42191239/160249174-86069be6-6d3d-47dd-8adf-649752f57c84.png)

This figure attempts to demonstrate how easy it is to use React Native's "View" component and its flexbox layout to divide a rectangular area into regularly sized cells of designated colors, creating a "sprite." If one takes such a rectangular area and places within it a horizontal flexbox consisting of View components having equal **flex** values, this will naturally break the rectangular area up into columns. Then, each column can similarly be used to contain a vertical flexbox of View components having equal **flex** values, with these used as raster cells to establish virtual pixels of a designated color. 

Here, this concept has been baked into a component called Sprite, in file Sprite.js, and the resulting idiom is quite intuitive. Note that appearance definitions are done using multi-dimension character arrays. Consider for example, the partial declaration shown below, in which the appearance definition of the black knight sprite is evident:

```
    Black: [
	"    0     ",
	"   o000   ",
	" o0000000 ",
	"o000000kk ",
	"o000 00000",
	" o000  000",
	"  o0000   ",
	"  o00000  ",
	"  o000000 ",
	" oo000000 ",
	"o00000000o",
	"o00000000o"],
```

Here's an example of the overall usage of the Sprite component:
```
  <Sprite pixelSize=24
          sprite={["x.",".x"]}
          letterToColor={"x":"yellow", ".":"brown"} />
```
The properties seen in the markup above establish, in order, the size of each virtual pixel in device pixels, the appearance definition of the sprite, and a mapping object that gives the necessary context to render the sprite from its textual appearance definition.

**Components *Piece* and *Board*** 

For Arensee, the Sprite component is mostly invoked from component "Piece," where the JSX seen below is present:
```
   <Sprite sprite={this.props.sprite} pixelSize={Constants.SpritePixelSize} letterToColor={Constants.LetterToColor} />
```
The Piece component is, in turn, contained by component "Board," which emits a React fragment containing Pieces:
```
//
// Component "Board"
//
//  This renders the pieces as they stand at any given point in the game. As such it's
//  just a "map" from props.boardState to a bunch of "Piece" components.
//
//
export function Board(props){
    return(<>
        {props.boardState.map((t)=>(
            <Piece n={t.n} key={t.n} deadness={t.deadness} x={t.x} y={t.y} sprite={t.sprite}
            causesSelfCheck={props.causesSelfCheck} causesEnemyCheck={props.causesEnemyCheck} movePiece={props.movePiece}  
            moveCount={props.moveCount} board={props.boardState}
            />))}
        </>
    )
}

```
Several key aspects of the Arensee design are in evidence in the snippet above. The data format of the "boardState" prop is a scheme that is pervasive throughout the Arensee codebase. As hinted by its name, it tells where the pieces are located on the board, whether they are dead and can be ignored ("deadness"), whether they are black or white ("blackness"), and so on. Within this data format there are also members that define the aspects of piece that are specific to its type: what it looks like on the screen, how it moves, etc.

**The Piece Data Format**

Some specifics are in order, from a couple of other JS files. From Constants.js:

```
    StartingBoard: ()=> [
	{ sprite:Pawn.Black, x:0, y:1, n:0, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: 1 },
	{ sprite:Pawn.Black, x:1, y:1, n:1, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: 1 },
	{ sprite:Pawn.Black, x:2, y:1, n:2, canMove: Pawn.CanMove, blackness: true, kingness: false,  deadness: false, pawnness: true, value: 1 },

```
This "StartingBoard" function returns the initial value at game start for what ultimately becomes "props.boardState" in "Board.js." I have covered "deadness" and "blackness"; above we also see "kingness" and "pawnness"- kings and pawns are special, viz. capture-en-passant, castling, checkmate, rules around pawn movement and forced draws, etc.

Note that member "value" reflects the value of each piece (pawn=1, queen=9, etc.); this is key to the chess engine seen in Engine.js. Members "x" and "y" extend down and right from the back (black) left corner of the board. 

Finally, we see properties coming in from a "Pawn" module. Prop "sprite" (the appearance of the picece rendering) comes from "Pawn.Black", seen in Pawn.js. Similarly, we have "Rook.Black" in Rook.js, "Knight.White" in Knight.js, and so on for all the piece types.

Here is Bishop.js, with ellipses as commented:
```
import Movement from './Movement';
const Bishop = {
    CanMove: (blackness,x,y,toX,toY,pieces)=> (Math.abs(toX-x)==Math.abs(toY-y))
					 && !pieces.some((t)=>
					     //Can't move atop same color piece
					     t.x==toX && t.y==toY && t.blackness==blackness && !t.deadness) 
					 && Movement.NoInterveningPiece(x,y,toX,toY,pieces),
    Black:
    [
	"   0     ",
	"  000    ",
	" o0000   ",
	"o00...0  ",
	" o0000   ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	"  o0o    ",
	" ,0000o  ",
	",000000o "
    ],
  // There's also a "Black" member, removed for brevity
};
export {Bishop as default};
```

In addition to the sprite appearance members, we have just "CanMove," which defines how a bishop moves. All "CanMove" members receive the same parameters, respectively:
* The color of the piecess (blackness bit)
* The x and y position of the piece's current square
* The x and y position of some hypothetical board square where the piece might move
* The state of the chessboard, called "pieces" here but in the same format as "boardState" mentioned earlier

Each "CanMove" member returns a boolean telling the caller whether the hypothetical move envisioned by the actual parameters passed in is legal. Note, though, that this is not where we worry about causing check; rules around check are handled are centralized within the top-level "App" component. This is appropriate; it doesn't matter whether your moving a bishop, a rook, or anything else- you can't make a move if it puts your own color in check.

The actual implementation of "CanMove" seen in Bishop.js reflects the rules of the game, where there are three rules of bishop movement:

* The bishop moves diagonally (e.g. over one square and up one, or over one and down one, or over two and up two, etc.).
* The bishop cannot move to a square occupied by another piece of the same color
* The bishop cannot jump over other pieces

The first rule is enforced on line 97, the second on lines 98-100, and the third on line 101. 
