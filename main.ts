
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
	hasACommonEdge(tri:Triangle):boolean{
		for(let i:number=0;i<this.edges.length;i++){
			for(let j:number=0;j<this.edges.length;j++){
				if (this.edges[i]==tri.edges[j]){
					return true
				}
			}			
		}
		return false
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
	selectedToMerge:boolean
	constructor(t1:number,t2:number){
		this.t1 = t1
		this.t2 = t2
		this.selectedToMerge=false
	}
}

function shuffleTab<T>(array:Array<T>): Array<T>{
	let l:number = array.length;

	while(l>=0){
		let j = 1+math.floor(math.random() * l);
		let valI:T = array[l];
		let valJ:T = array[j];
		array[l] = valJ;
		array[j] = valI;
		l = l - 1;
	}
	return array;
}

let tiles:HexagonalTile[] = []
let edges:Edge[] = []
let triangles:Triangle[]=[]
let connexion:Link[] = []

love.update = (dt) =>{}

love.draw = function() {
	love.graphics.clear(0,0,0)
	// for(let i:number=0;i<tiles.length;i++){
	// 	tiles[i].draw()
	// }
	// for(let i:number=0;i<edges.length;i++){
	// 	edges[i].draw()
	// }
	for(let i:number=0;i<triangles.length;i++){
		triangles[i].draw()
	}
	for(let i:number=0;i<connexion.length;i++){
		let l:Link = connexion[i]
		let c1 = triangles[l.t1].center
		let c2 = triangles[l.t2].center
		if(l.selectedToMerge){
			love.graphics.setColor(1,0,0,1)
		}else{
			love.graphics.setColor(0,1,1,1)
		}
		love.graphics.line(
			c1.x,c1.y,
			c2.x,c2.y
		)
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
			tiles.push(new HexagonalTile(r,c))		
		}
	}
	for(let i:number=0;i<(tiles.length)-1;i++){
		for(let j:number=i+1;j<tiles.length;j++){
			let d:number= Dist(tiles[i],tiles[j])
			if( d<= 1.01){
				edges.push(new Edge(tiles[i],tiles[j]))
			}
		}
	}
	print(edges.length)

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
	print(triangles.length)

	for(let i:number=0;i<(triangles.length)-1;i++){
		for(let j:number=i+1;j<triangles.length;j++){
			if (triangles[i].hasACommonEdge(triangles[j])){
				connexion.push(new Link(i,j))
			}
		}
	}
	print(connexion.length)

	// shuffleTab(connexion)
}



