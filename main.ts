
class Vector{
	x:number=0;
	y:number=0;
	constructor(x:number,y:number){
		this.x=x;
		this.y=y;
	}
	add(v:Vector):Vector{
		return new Vector(this.x+v.x,this.y+v.y)
	}
	mul(s:number):Vector{
		return new Vector(this.x*s,this.y*s)	
	}
}

let scale:number = 50
let depth:number = 6
let center:Vector = new Vector(400,300)

let VectorRow = new Vector(scale,0);
let VectorColumn = new Vector(
	scale*math.cos(math.pi*2/6),
	scale*math.sin(math.pi*2/6)
); 

function Point(x:number,y:number){
	love.graphics.setColor(1,1,1,1)
	love.graphics.rectangle("fill",x-2,y-2,4,4,2,2)
}

class HexagonalTile{
	r:number;
	c:number;
	pos:Vector;

	constructor(r:number,c:number){
		this.r = r
		this.c = c
		this.pos = center.add(VectorRow.mul(this.r).add(VectorColumn.mul(this.c)))
	}

	draw(){ 
		Point(this.pos.x,this.pos.y)
	}
}

class Edge{
	points:[HexagonalTile,HexagonalTile]
	constructor(t1:HexagonalTile,t2:HexagonalTile){
		this.points = [t1,t2]
	}
	getCommonPoint(edge:Edge):HexagonalTile|null{
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
	draw(){	
		love.graphics.setColor(1,1,1,1)
		love.graphics.line(
			this.points[0].pos.x,this.points[0].pos.y,
			this.points[1].pos.x,this.points[1].pos.y
		)
	}
}

function Dist(t1:HexagonalTile,t2:HexagonalTile):number{
	return  (   (t1.pos.x-t2.pos.x)*(t1.pos.x-t2.pos.x) 
			  + (t1.pos.y-t2.pos.y)*(t1.pos.y-t2.pos.y)
			) / (scale*scale)
}

class Triangle{
	edges:[Edge,Edge,Edge]
	points:[HexagonalTile,HexagonalTile,HexagonalTile]
	center:Vector
	mergedWith:Triangle|null

	constructor(e1:Edge,e2:Edge,e3:Edge,p1:HexagonalTile,p2:HexagonalTile,p3:HexagonalTile){
		this.edges = [e1,e2,e3]
		this.points = [p1,p2,p3]
		this.center = p1.pos.add(p2.pos).add(p3.pos).mul(1.0/3.0)
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
	getOppositePointOf(edge:Edge):HexagonalTile{
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
	draw(){
		this.edges[0].draw()
		this.edges[1].draw()
		this.edges[2].draw()
		Point(this.center.x,this.center.y)
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
	math.randomseed(os.time())
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
		// we might want to check if the order is direct or indirect
		this.points = [
			t1MissingPoint.pos,
			edge.points[0].pos,
			t2MissingPoint.pos,
			edge.points[1].pos
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
			new Tile(this.points[0],middles[0],center,middles[3]),
			new Tile(this.points[1],middles[1],center,middles[0]),
			new Tile(this.points[2],middles[2],center,middles[1]),
			new Tile(this.points[3],middles[3],center,middles[2])
		]
	}

	draw(){
		love.graphics.setColor(1,1,1,1)
		love.graphics.line(
			this.points[0].x,this.points[0].y,
			this.points[1].x,this.points[1].y
		)
		love.graphics.line(
			this.points[1].x,this.points[1].y,
			this.points[2].x,this.points[2].y
		)
		love.graphics.line(
			this.points[2].x,this.points[2].y,
			this.points[3].x,this.points[3].y
		)
		love.graphics.line(
			this.points[3].x,this.points[3].y,
			this.points[0].x,this.points[0].y
		)
	}
}

class Tile{
	points:[Vector,Vector,Vector,Vector]
	constructor(p1:Vector,p2:Vector,p3:Vector,p4:Vector){
		this.points = [p1,p2,p3,p4]
	}
	draw(){
		love.graphics.setColor(1,1,1,1)
		love.graphics.line(
			this.points[0].x,this.points[0].y,
			this.points[1].x,this.points[1].y
		)
		love.graphics.line(
			this.points[1].x,this.points[1].y,
			this.points[2].x,this.points[2].y
		)
		love.graphics.line(
			this.points[2].x,this.points[2].y,
			this.points[3].x,this.points[3].y
		)
		love.graphics.line(
			this.points[3].x,this.points[3].y,
			this.points[0].x,this.points[0].y
		)
	}
}

let hexaTiles:HexagonalTile[] = []
let edges:Edge[] = []
let triangles:Triangle[]=[]
let connexion:Link[] = []
let quads:Quad[] = []
let tiles:Tile[] = []

love.update = (dt) =>{}

love.draw = function() {
	love.graphics.clear(0,0,0)
	// for(let i:number=0;i<hexaTiles.length;i++){
	// 	hexaTiles[i].draw()
	// }
	// for(let i:number=0;i<edges.length;i++){
	// 	edges[i].draw()
	// }
	// for(let i:number=0;i<triangles.length;i++){
	// 	triangles[i].draw()
	// }
	// for(let i:number=0;i<connexion.length;i++){
	// 	let l:Link = connexion[i]
	// 	let c1 = triangles[l.t1].center
	// 	let c2 = triangles[l.t2].center
	// 	if(l.selectedToMerge){
	// 		love.graphics.setColor(1,0,0,1)
	// 	}else{
	// 		love.graphics.setColor(0,1,1,1)
	// 	}
	// 	love.graphics.line(
	// 		c1.x,c1.y,
	// 		c2.x,c2.y
	// 	)
	// }
	// for(let i:number=0;i<quads.length;i++){
	// 	quads[i].draw()
	// }
	for(let i:number=0;i<tiles.length;i++){
		tiles[i].draw()
	}

}

love.mousepressed = function( x:number, y:number, button:number,isTouch:boolean ){
}

love.mousereleased = function( x:number, y:number, button:number,isTouch:boolean ){
}

love.load = ()=>{
	for(let r:number=-depth;r<=depth;r++){	
		for(let c:number=-depth;c<=depth;c++){
			if (math.abs(r+c)>depth){
				continue
			} 
			hexaTiles.push(new HexagonalTile(r,c))		
		}
	}
	for(let i:number=0;i<(hexaTiles.length)-1;i++){
		for(let j:number=i+1;j<hexaTiles.length;j++){
			let d:number= Dist(hexaTiles[i],hexaTiles[j])
			if( d<= 1.01){
				edges.push(new Edge(hexaTiles[i],hexaTiles[j]))
			}
		}
	}
	// print(edges.length)

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
	// print(triangles.length)

	for(let i:number=0;i<(triangles.length)-1;i++){
		for(let j:number=i+1;j<triangles.length;j++){
			let edge = triangles[i].getCommonEdge(triangles[j])
			if(edge != null){
				connexion.push(new Link(i,j,edge))
			}
		}
	}
	// print(connexion.length)

	let permutation = permut(connexion.length,connexion.length*2)

	for(let i:number=0;i<permutation.length;i++){	
		let p = i//permutation[i];
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
			tiles.push(subs[j])
		} 
	}

}



