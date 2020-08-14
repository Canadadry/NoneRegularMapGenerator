import {Mesh} from './mesh'
import {Vector} from './vector'
import {Quad} from './quad'
import {Colors} from './color'

function closest(point:Vector,distanceMax:number,points:Vector[]):number{
	let min = distanceMax
	let selectedMin = -1
	for(let i:number=0;i<points.length;i++){
		let d:number = point.dist(points[i])
		if(d<min){
			selectedMin = i;
			min = d
		}
	}
	return selectedMin
}

function mapping(before:[Vector,Vector,Vector,Vector],after:[Vector,Vector,Vector,Vector],strechFactor:number):number{
	return closest(after[0],strechFactor*10,before)
}

export function smooth(mesh:Mesh,strechFactor:number,shrinkFactor:number,steps:number):[Mesh,Mesh]{
	let intermediaryMesh:Mesh = new Mesh()	
	let smoothedMesh:Mesh = new Mesh()	
	smoothedMesh.quads = mesh.quads
	smoothedMesh.pointsToQuads = mesh.pointsToQuads

	let newPoints:[number,Vector][] = []
	for(let i:number=0;i<mesh.points.length;i++){
		newPoints.push([0,new Vector(0,0)])
	}

	let fakeQuad = new Quad(0,1,2,3,Colors.White)

	for(let i:number=0;i<mesh.quads.length;i++){
		let quad = mesh.quads[i]
		let qualityBefore = quad.quality(mesh.points)
	 	let newP = fakeQuad.shrink(quad.stretch(mesh.points,strechFactor),shrinkFactor)
	 	for(let j:number=1;j<steps;j++){
	 		newP = fakeQuad.shrink(fakeQuad.stretch(newP,strechFactor),shrinkFactor)
		}
	 	let quality = fakeQuad.quality1(newP)

		intermediaryMesh.insterQuad(newP,quad.color)

		let map = mapping(quad.extract(mesh.points),newP,strechFactor)

	 	newPoints[quad.points[0]][0] += quality
	 	newPoints[quad.points[0]][1]  = newP[(0+map)%4].mul(quality).add(newPoints[quad.points[0]][1]) 
	 	newPoints[quad.points[1]][0] += quality
	 	newPoints[quad.points[1]][1]  = newP[(1+map)%4].mul(quality).add(newPoints[quad.points[1]][1]) 
	 	newPoints[quad.points[2]][0] += quality
	 	newPoints[quad.points[2]][1]  = newP[(2+map)%4].mul(quality).add(newPoints[quad.points[2]][1]) 
	 	newPoints[quad.points[3]][0] += quality
	 	newPoints[quad.points[3]][1]  = newP[(3+map)%4].mul(quality).add(newPoints[quad.points[3]][1]) 
	}

	for(let i:number=0;i<newPoints.length;i++){
		smoothedMesh.points.push(newPoints[i][1].mul(1/newPoints[i][0]))
	}
	return [intermediaryMesh,smoothedMesh]
}
