import {Vector} from './vector'
import {Quad} from './quad'
import {Color,Colors} from './color'

export class Mesh{
	points:Vector[]
	quads:Quad[]
	pointsToQuads:Quad[][]

	constructor(){
		this.points=[]
		this.quads=[]
		this.pointsToQuads=[]
	}

	draw(){
		for(let i:number=0;i<this.quads.length;i++){
			this.quads[i].draw(this.points)
		}
		for(let i:number=0;i<this.points.length;i++){
			this.points[i].draw()
		}
	}

	insterQuad(points:[Vector,Vector,Vector,Vector],c:Color=Colors.White){
		let p1:number = this.insertPoint(points[0])
		let p2:number = this.insertPoint(points[1])
		let p3:number = this.insertPoint(points[2])
		let p4:number = this.insertPoint(points[3])

		let q = new Quad(p1,p2,p3,p4,c)

		this.quads.push(q)
		this.pointsToQuads[p1].push(q)
		this.pointsToQuads[p2].push(q)
		this.pointsToQuads[p3].push(q)
		this.pointsToQuads[p4].push(q)
	}

	private findPoint(p:Vector,dist:number):number|null{
		for(let i:number=0;i<this.points.length;i++){
			let d:number = p.dist(this.points[i])
			if(d<dist){
				return i;
			}
		}
		return null
	}
	private insertPoint(p:Vector):number{
		let index = this.findPoint(p,0.01)
		if(index != null){
			return index
		}
		this.points.push(p)
		this.pointsToQuads.push([])
		return this.points.length-1
	}


}