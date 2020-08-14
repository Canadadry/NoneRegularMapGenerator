import {Mesh} from './src/mesh'
import {Vector} from './src/vector'
import {generate} from './src/generate'
import {smooth} from './src/smooth'

let mesh:Mesh
let scale:number = 50
let depth:number = 6
let center:Vector = new Vector(400,300)
let SSOsteps:number=3;
let smoothingStep:number=20;
let smoothedMesh:Mesh;


love.update = (dt) =>{}

love.draw = function() {
	love.graphics.clear(0,0,0)
	smoothedMesh.draw()
}

love.load = ()=>{
	mesh = generate(depth,scale,center)

	smoothedMesh = mesh
	for(let i:number = 0;i<smoothingStep;i++){
		let out = smooth(mesh,scale*4,0.2,SSOsteps)
		smoothedMesh = out[1]
	}
}



