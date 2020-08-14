import {Mesh} from './mesh'
import {Vector} from './vector'
import {Quad} from './quad'
import {Colors} from './color'

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
		let quality = quad.quality(mesh.points)
	 	let newP = fakeQuad.shrink(quad.stretch(mesh.points,strechFactor),shrinkFactor)
	 	for(let j:number=1;j<steps;j++){
	 		newP = fakeQuad.shrink(fakeQuad.stretch(newP,strechFactor),shrinkFactor)
		}
	 	quality = fakeQuad.quality(newP)

		intermediaryMesh.insterQuad(newP,quad.color)

	 	newPoints[quad.points[0]][0] += quality
	 	newPoints[quad.points[0]][1]  = newP[0].mul(quality).add(newPoints[quad.points[0]][1]) 
	 	newPoints[quad.points[1]][0] += quality
	 	newPoints[quad.points[1]][1]  = newP[1].mul(quality).add(newPoints[quad.points[1]][1]) 
	 	newPoints[quad.points[2]][0] += quality
	 	newPoints[quad.points[2]][1]  = newP[2].mul(quality).add(newPoints[quad.points[2]][1]) 
	 	newPoints[quad.points[3]][0] += quality
	 	newPoints[quad.points[3]][1]  = newP[3].mul(quality).add(newPoints[quad.points[3]][1]) 
	}

	for(let i:number=0;i<newPoints.length;i++){
		smoothedMesh.points.push(newPoints[i][1].mul(1/newPoints[i][0]))
	}
	return [intermediaryMesh,smoothedMesh]
}