import {Vector} from './vector'
import {Color} from './color'

export class Quad{
	points:[number,number,number,number]
	color:Color
	constructor(p1:number,p2:number,p3:number,p4:number,c:Color){
		this.points = [p1,p2,p3,p4]
		this.color=c
	}
	draw(points:Vector[]){
		let p0:Vector = points[this.points[0]]
		let p1:Vector = points[this.points[1]]
		let p2:Vector = points[this.points[2]]
		let p3:Vector = points[this.points[3]]

		let center:Vector = p0.add(p1).add(p2).add(p3).mul(1/4)

		love.graphics.setColor(this.color.r,this.color.g,this.color.b,1)
		love.graphics.line(p0.x,p0.y,p1.x,p1.y)
		love.graphics.line(p1.x,p1.y,p2.x,p2.y)
		love.graphics.line(p2.x,p2.y,p3.x,p3.y)
		love.graphics.line(p3.x,p3.y,p0.x,p0.y)
	}

	stretch(points:Vector[],factor:number):[Vector,Vector,Vector,Vector]{
		let p0:Vector = points[this.points[0]]
		let p1:Vector = points[this.points[1]]
		let p2:Vector = points[this.points[2]]
		let p3:Vector = points[this.points[3]]


		let sign:number = (p0.sub(p1).vect(p2.sub(p1))) > 0 ? 1 : -1

		let diagonals:[Vector,Vector,Vector,Vector]=[
			p1.sub(p3),
			p2.sub(p0),
			p3.sub(p1),
			p0.sub(p2),
		]

		let normals:[Vector,Vector,Vector,Vector] = [
			new Vector(-diagonals[0].y,diagonals[0].x).normalize().mul(sign),
			new Vector(-diagonals[1].y,diagonals[1].x).normalize().mul(sign),
			new Vector(-diagonals[2].y,diagonals[2].x).normalize().mul(sign),
			new Vector(-diagonals[3].y,diagonals[3].x).normalize().mul(sign),
		]

		return [
			p0.add(normals[0].mul(factor)),
			p1.add(normals[1].mul(factor)),
			p2.add(normals[2].mul(factor)),
			p3.add(normals[3].mul(factor)),
		]
	}

	shrink(points:Vector[],factor:number):[Vector,Vector,Vector,Vector]{
		let p0:Vector = points[this.points[0]]
		let p1:Vector = points[this.points[1]]
		let p2:Vector = points[this.points[2]]
		let p3:Vector = points[this.points[3]]

		let center:Vector = p0.add(p1).add(p2).add(p3).mul(1/4)

		return [
			p0.sub(center).mul(factor).add(center),
			p1.sub(center).mul(factor).add(center),
			p2.sub(center).mul(factor).add(center),
			p3.sub(center).mul(factor).add(center),
		]
	}


	quality(points:Vector[]):number{
		let q1 =this.quality1(points)
		let q2 =this.quality2(points) 
		return q1*q2
	}

	quality1(points:Vector[]):number{
		let p0:Vector = points[this.points[0]]
		let p1:Vector = points[this.points[1]]
		let p2:Vector = points[this.points[2]]
		let p3:Vector = points[this.points[3]]

		let center:Vector = p0.add(p1).add(p2).add(p3).mul(1/4)

		let d0:number = center.dist(p0)
		let d1:number = center.dist(p1)
		let d2:number = center.dist(p2)
		let d3:number = center.dist(p3)

		let mean:number = (d0+d1+d2+d3)/4

		let stdDeviation:number = (d0-mean)*(d0-mean)
								+ (d1-mean)*(d1-mean)
								+ (d2-mean)*(d2-mean)
								+ (d3-mean)*(d3-mean)
		stdDeviation = stdDeviation/4
		stdDeviation = math.sqrt(stdDeviation)

		return 1-stdDeviation/mean
	}


	quality2(points:Vector[]):number{
		let p0:Vector = points[this.points[0]]
		let p1:Vector = points[this.points[1]]
		let p2:Vector = points[this.points[2]]
		let p3:Vector = points[this.points[3]]


		let dir0 = p0.sub(p2).normalize()
		let dir1 = p1.sub(p3).normalize()

		let angle = math.abs(math.acos(dir0.dot(dir0)))

		return 1-math.abs(angle-math.pi/2)/(math.pi/2)
	}
}