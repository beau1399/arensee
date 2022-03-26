# arensee
**R**eact **N**ative **C**hess


<img width="271" alt="Screen Shot 2022-03-26 at 11 34 51 AM" src="https://user-images.githubusercontent.com/42191239/160246582-225041a3-402f-4b69-b8f4-8fa57c172fb7.png">
 
Arensee is a computer chess game written in React Native. As cloned, it will build to an app where the human user plays white and the computer responds by playing black. Build-time parameters in file Constants.js can be tweaked to support two human players, or even computer-versus-computer play.

The chess engine used by the computer "player(s)" is rudimentary in nature. It is aggressive and lacks foresight. However, an obvious locus and interface are provided for chess engine improvements, in file Engine.js.

Arensee is noteworthy for its lack of dependencies. Other than React Native itself, I've added just a single NPM package called **react-native-draggable**. This seems pretty atypical of React Native applications to me, but as things unfolded I found that React Native provided ample facilities "right out of the box" for a chess game. In fact, the react user interface paradigm struck me as well-suited to a chess game, where state is central, evolving over time, and prominently presented visually. 

**Component *Sprite*** 

I will describe Arensee's code as I wrote it: from the bottom up, beginning with the question "how do I render a chessboard and pieces on the screen?". In the past I've used OpenGL ES and **react-native-canvas** with good results, but I didn't think what I needed here was a drawing engine per se. Rather, it seemed to me that these rendering tasks could be accomplished using a very raster-centric "pixel art" style reminiscent of the 8-bit era of home computing. Consider the image below, where a magnified version of my white bishop is shown with some illustrative guidelines:


![chessboard2](https://user-images.githubusercontent.com/42191239/160249174-86069be6-6d3d-47dd-8adf-649752f57c84.png)

