import {Mesh} from './mesh'
import {Vector} from './vector'

type Tile = [Vector,Vector,Vector,Vector]

function hexagonalToCartesian(row:number,col:number) : Vector{
	let VectorRow = new Vector(1,0);
	let VectorColumn = new Vector(
		math.cos(math.pi*2/6),
		math.sin(math.pi*2/6)
	); 
	return VectorRow.mul(row).add(VectorColumn.mul(col))
}

class Edge{
	points:[Vector,Vector]
	constructor(t1:Vector,t2:Vector){
		this.points = [t1,t2]
	}
	getCommonPoint(edge:Edge):Vector|null{
		let p11 = this.points[0]
		let p12 = this.points[1]
		let p21 = edge.points[0]
		let p22 = edge.points[1]
		
		if (edge==this) return null
		if (p11 == p21) { return p11 }
		if (p12 == p21) { return p12 }
		if (p11 == p22) { return p11 }
		if (p12 == p22) { return p12 }
		return null
	}
}

class Triangle{
	edges:[Edge,Edge,Edge]
	points:[Vector,Vector,Vector]
	center:Vector
	mergedWith:Triangle|null

	constructor(e1:Edge,e2:Edge,e3:Edge,p1:Vector,p2:Vector,p3:Vector){
		this.edges = [e1,e2,e3]
		this.points = [p1,p2,p3]
		this.center = p1.add(p2).add(p3).mul(1.0/3.0)
		this.mergedWith = null
	}
	getCommonEdge(tri:Triangle):Edge|null{
		for(let i:number=0;i<this.edges.length;i++){
			for(let j:number=0;j<this.edges.length;j++){
				if (this.edges[i]==tri.edges[j]){
					return this.edges[i]
				}
			}			
		}
		return null
	}
	getOppositePointOf(edge:Edge):Vector{
		for(let i:number=0;i<this.points.length;i++){
			if (edge.points[0]==this.points[i]){
				continue
			}
			if (edge.points[1]==this.points[i]){
				continue
			}
			return this.points[i]
		}
		print("failing to find the oppotise point")
		return this.points[0];
	}	
	subivide():Tile[]{
		let middles:[Vector,Vector,Vector] = [
			this.points[0].add(this.points[1]).mul(1.0/2.0),
			this.points[1].add(this.points[2]).mul(1.0/2.0),
			this.points[2].add(this.points[0]).mul(1.0/2.0),
		]
		return [
			[this.points[0],middles[0],this.center,middles[2]],
			[this.points[1],middles[1],this.center,middles[0]],
			[this.points[2],middles[2],this.center,middles[1]],
		]
	}
}

class Link{
	t1:number
	t2:number
	edge:Edge
	selectedToMerge:boolean
	constructor(t1:number,t2:number,edge:Edge){
		this.t1 = t1
		this.t2 = t2
		this.edge = edge
		this.selectedToMerge=false
	}
}

function permut(len:number,maxPerm:number): number[]{
	let permutation:number[] =[]
	for(let i:number=0;i<len;i++){
		permutation.push(i)
	}
	for(let step:number=0;step<maxPerm;step++){
		let i:number = math.floor(math.random() * len);
		let j:number = math.floor(math.random() * len);
		let valI:number = permutation[i];
		let valJ:number = permutation[j];
		permutation[i] = valJ;
		permutation[j] = valI;
	}
	return permutation;
}

class Quad{
	points:[Vector,Vector,Vector,Vector]
	constructor(t1:Triangle,t2:Triangle,edge:Edge){
		let t1MissingPoint = t1.getOppositePointOf(edge)
		let t2MissingPoint = t2.getOppositePointOf(edge)
		this.points = [
			t1MissingPoint,
			edge.points[0],
			t2MissingPoint,
			edge.points[1]
		]
	}

	subivide():Tile[]{
		let middles:[Vector,Vector,Vector,Vector] = [
			this.points[0].add(this.points[1]).mul(1.0/2.0),
			this.points[1].add(this.points[2]).mul(1.0/2.0),
			this.points[2].add(this.points[3]).mul(1.0/2.0),
			this.points[3].add(this.points[0]).mul(1.0/2.0),
		]
		let center = middles[0].add(middles[2]).mul(1.0/2.0)
		return [
			[this.points[0],middles[0],center,middles[3]],
			[this.points[1],middles[1],center,middles[0]],
			[this.points[2],middles[2],center,middles[1]],
			[this.points[3],middles[3],center,middles[2]],
		]
	}
}

export function generate(depth:number,scale:number,center:Vector) : Mesh{
	let hexaTiles:Vector[] = []
	let edges:Edge[] = []
	let triangles:Triangle[]=[]
	let connexion:Link[] = []
	let quads:Quad[] = []
	let mesh:Mesh = new Mesh


	for(let r:number=-depth;r<=depth;r++){	
		for(let c:number=-depth;c<=depth;c++){
			if (math.abs(r+c)>depth){
				continue
			} 
			hexaTiles.push(hexagonalToCartesian(r,c).mul(scale).add(center))		
		}
	}
	for(let i:number=0;i<(hexaTiles.length)-1;i++){
		for(let j:number=i+1;j<hexaTiles.length;j++){
			let d:number= hexaTiles[i].dist(hexaTiles[j])/scale
			if( d<= 1.01){
				edges.push(new Edge(hexaTiles[i],hexaTiles[j]))
			}
		}
	}

	for(let i:number=0;i<edges.length-2;i++){
		let e1 = edges[i]
		for(let j:number=i+1;j<edges.length-1;j++){
			let e2 = edges[j]
			let firstPoint = e1.getCommonPoint(e2)
			if(firstPoint==null){
				continue
			}
			for(let k:number=j+1;k<edges.length;k++){
				let e3 = edges[k]		
				let secondPoint = e1.getCommonPoint(e3)
				if(secondPoint==null){
					continue
				}
				if(secondPoint==firstPoint){
					continue
				}		
				let thirdPoint = e2.getCommonPoint(e3)
				if(thirdPoint==null){
					continue
				}
				if(thirdPoint==firstPoint){
					continue
				}
				if(thirdPoint==secondPoint){
					continue
				}
				triangles.push(new Triangle(e1,e2,e3,firstPoint,secondPoint,thirdPoint))
			}
		}
	}

	for(let i:number=0;i<(triangles.length)-1;i++){
		for(let j:number=i+1;j<triangles.length;j++){
			let edge = triangles[i].getCommonEdge(triangles[j])
			if(edge != null){
				connexion.push(new Link(i,j,edge))
			}
		}
	}

	let permutation = permut(connexion.length,connexion.length*2)

	for(let i:number=0;i<permutation.length;i++){	
		let p = permutation[i];
		let l:Link = connexion[p];

		let t1:Triangle = triangles[l.t1]
		let t2:Triangle = triangles[l.t2]
		if(t1.mergedWith != null){
			continue
		}
		if(t2.mergedWith != null){
			continue
		}
		t1.mergedWith = t2
		t2.mergedWith = t1
		l.selectedToMerge = true

		quads.push(new Quad(t1,t2,l.edge))
	}

	for(let i:number=0;i<quads.length;i++){	
		let subs = quads[i].subivide()
		for(let j:number=0;j<subs.length;j++){
			mesh.insterQuad(subs[j])
		} 
	}
	for(let i:number=0;i<triangles.length;i++){
		if(triangles[i].mergedWith != null){
			continue
		}
		let subs = triangles[i].subivide()
		for(let j:number=0;j<subs.length;j++){
			mesh.insterQuad(subs[j])
		} 
	}

	return mesh
}