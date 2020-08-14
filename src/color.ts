export class Color{
	r:number;
	g:number;
	b:number;

	constructor(r:number,g:number,b:number){
		this.r = r;
		this.g = g;
		this.b = b;
	}
}


export let Colors:Record<string,Color> = {
	"White" : new Color(1,1,1),
	"Red" : new Color(1,0,0),
	"Green" : new Color(0,1,0),
	"Blue" : new Color(0,0,1),
	"Black" : new Color(0,0,0),
	"Gray": new Color(0.5,0.5,0.5)
}
