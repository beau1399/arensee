export interface TileProps {
    x:number;
    y:number;
    sprite:string[];
    pixelSize:number;
    letterToColor(l:string):string|undefined;
}