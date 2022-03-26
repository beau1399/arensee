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
	"o00000000o"
    ],

```

Here's an example of the overall usage of the Sprite component:
```
  <Sprite pixelSize=24
          sprite={["x.",".x"]}
          letterToColor={"x":"yellow", ".":"brown"} />
```
The properties seen in the markup above establish, in order, the size of each virtual pixel in device pixels, the appearance definition of the sprite, and 
