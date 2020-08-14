import {Color} from './color'

export class Vector{
	x:number=0;
	y:number=0;
	constructor(x:number,y:number){
		this.x=x;
		this.y=y;
	}
	add(v:Vector):Vector{
		return new Vector(this.x+v.x,this.y+v.y)
	}
	sub(v:Vector):Vector{
		return new Vector(this.x-v.x,this.y-v.y)
	}
	mul(s:number):Vector{
		return new Vector(this.x*s,this.y*s)	
	}
	dist(to:Vector):number{
		let diff = this.sub(to);
		return  math.sqrt( diff.x*diff.x+diff.y*diff.y ) 
	}
	dot(v:Vector):number{
		return this.x*v.x-this.y*v.y	
	}
	vect(v:Vector):number{
		return this.x*v.y-this.y*v.x
	}
	normalize():Vector{
		return this.mul(1/this.dist(new Vector(0,0)))
	}
	draw(c:Color = new Color(1,0,0),s:number= 4){
		love.graphics.setColor(c.r,c.g,c.b,0.5)
		love.graphics.rectangle("fill",this.x-s/2,this.y-s/2,s,s,s/2,s/2)
	}
}
