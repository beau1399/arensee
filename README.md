# arensee
**R**eact **N**ative **C**hess

<img width="268" alt="cb1" src="https://user-images.githubusercontent.com/42191239/160251333-be2f7a53-40c2-44a4-ab61-373edef1f7f6.png">

Arensee is a computer chess game written in React Native. As cloned, the source code builds an app where the human user plays white and the computer responds by playing black. Build-time parameters in file Constants.js can be tweaked to support two human players, or even computer-versus-computer play.

The chess engine used by the computer is rudimentary in nature. Located in file Engine.js, it is aggressive and lacks foresight. That said, improvements here are on my own "to do" list, and the interface between the chess engine and the other parts of the system is designed to be obvious and extensible. Perhaps some other developer will insert a better engine. 

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

Another thing evident in the code snippet above is the passage from parent component to child of functions that are useful for running the chess game. Function "causesEnemyCheck" is an example. This is passed through under the same name in the code above. Ultimately it originates from the top-level App component, where check is managed, and gets passed down to 

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

**Piece Type Definition**

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

The first rule is enforced on line 3 of the snippet, the second on lines 4-6, and the third on line 7. 

Most of the piece types are similarly uncomplicated in their definitions. Where other piece-specific behavior must be defined, though, I have endeavored to do so within the appropriate piece definition file. In Pawn.js, for example, one finds member function EnPassant, which accepts parameters around a hypothetical move and returns a composite structure telling whether capture-en-passant happened, and where the captured piece was located if it did. Similarly, there is a "Castling" member in King.js that detects and arbitrates castling attempts. 

**The *App* Component**

The "App" component in App.js is a top-level container for the game components, and also the central locus for game state, enforcement of whole-board rules like those around checkmate, stalemate, and draw. In typical React fashion, much is established in App and then woven down into child components in their properties. This includes state, but also functions for game-level checks and for piece move attempts. Here is the App state setup:

```
    const [boardState, setBoardState] = useState(Constants.StartingBoard())
    const [moveCount, setMoveCount] = useState(0)
    const [drawMoveCount, setDrawMoveCount] = useState(0)
    const [modalVisible, setModalVisible] = useState(undefined);
    const [history, setHistory] = useState([])
```

* Member "boardState" maintains piece position / status as already described
* Member "moveCount" is presented to the end user, but also (modulus 2) determines which color must move next
* Member "drawMoveCount" is used to declare a draw after 50 moves without pawn movement or capture, per rules
* Member "modalVisible" controls the visibility of the modal used to communicate game end, and also to prevent further movement
* Member "history" is used to declare a draw when the same position has been repeated 5 times, per rule

The enforcement of the mandatory draw rules described in the bulleted list above is a perfect example of the sort of game-level logic that belongs in App.js, and these rules are indeed enforced entirely within App.js.

In addition to state, App.js declares several functions which are passed down into child components for game logic purposes:

Function "isChecked" checks whether a particular color is in check. 

Function "causesSelfCheck" tells whether a hypothetical move should be illegal because it would put the moving color in check. Function "causesOpponentCheck" tells whether a hypothetical move puts the opponent in check.

Function "movePiece" does what its name implies, and is thus largely responsible for the state members elucidated in the last code snippet. This includes not only piece position, but also the "deadness" property for captured pieces. Function "movePiece" is also the place where moves that would put the mover in check are refused, for human players; the computer's chess engine will already have excluded such moves before attempting them. Capture-en-passant is handled here, since it's really just a species of capture. (The computer chess engine calls into the same members of module "Pawn" that are used to detect capture-en-passant in "movePiece," and the engine will thus consider en passant in its machinations just like any other piece capture.)

Pawn promotion is checked for in "movePiece." This turns out to be pretty straightforward:

```
//Pawn Promotion
if(movingPiece.pawnness && 
   ((movingPiece.blackness && movingPiece.y==7)||
    (!movingPiece.blackness && movingPiece.y==0))){
   movingPiece.sprite = movingPiece.blackness ? Queen.Black : Queen.White;
   movingPiece.canMove = Queen.CanMove;
   movingPiece.value=Queen.Value;
}
```
In short, we check that the piece is a pawn, and then that it's either white and in row 0 or black and in row 7. The check for mates is similarly legible:

```
if(!Movement.CanMakeAMove(!movingPiece.blackness, causesSelfCheck, boardState)){
 if(isChecked(!movingPiece.blackness)){
  setModalVisible(('CHECKMATE! WINNER: ' + (movingPiece.blackness?'BLACK':'WHITE') ))
 }else{
  setModalVisible('STALEMATE')                    
 }               
}
```
The outermost "if" determines that the opponent (i.e. the color that is not moving) cannot respond to the move in play with a move of his own. This will either be a checkmate (if the opponent is in check) or a stalemate (if he is not). It is hoped that this code reads easily, and that this is particularly true of the high-level code in App.js.

One new wrinkle in evidence above is the existence of module "Movement.js." There is not much architectural magic in evidence here; Movement.js exists simply to remove somewhat complex, low-level logic from App.js (and other files) so that they can operate at a higher level-of-abstraction. For example, another of its functions is "NoInterveningPiece," which is shared by all the piece definition files for pieces that can't jump other pieces.

**The Computer Chess Engine**

Some readers will be most concerned with the logic used by the computer player's chess engine. For these people, the lead-up to this section may have seemed mundane. Sadly, if you endured everything above in hopes of learning about my latent, silicon-based Boris Spasky, you are destined for further disappointment. That said, if you are thinking about _developing_ a great chess engine, then you may be in luck, as I will now tell you exactly where and how to hook your code up.



**Development Process**

Arensee began mostly as a learning exercise. Having done pretty extensive React development, and pretty extensive Java / Android native development, I wanted a real project to help me bridge the knowledge gap between the two. I began with an Expo-based React Native app created on the Friday of a three-day weekend, and by Sunday evening the game had taken its final appearance and was mostly complete. 

As I recall things, castling, capture-en-passant, and the more obscure draw rules remained undone at the end of the weekend, but it was definitely possible to play games against the computer using the user interface depicted above. On Monday I moved my code from Expo to a more generic React Native codebase, and all of the unwritten logic for a full chess game followed pretty rapidly.

Having written a basic computer chess game in such a short time, I reiterate with confidence what I said right up front: React Native is emminently suited for this particular application. 

