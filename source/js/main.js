const CONSTS = {
	scale: 10,
	lineWidth: 3,
	colorTone: 0xff0000,
	maxAbountOfCubes: 20
}

let cubes = [];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 500 );
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 1 );
document.body.appendChild( renderer.domElement );

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const drawCubes = () => {
	const abountOfCubes = Math.floor(Math.random()*CONSTS.maxAbountOfCubes)
	for (let i = 0; i <= abountOfCubes; i++) {
		window[`cube${i}`] = new Cubic(scene);
		window[`cube${i}`].bind(window[`cube${i}`]);
	}
}

const render = () => {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
}


class Cubic {
	constructor(scene) {
		this.geometry = new THREE.CubeGeometry( 5, 5, 5);
		this.material = new THREE.MeshFaceMaterial();
		this.cube = new THREE.Mesh( this.geometry, this.material );
		this.scene = scene
		this.scene.add( this.cube );
		this.setPosition();
		this.addEdges();
		this.addSpheres();
	}

	setPosition() {
		const randomNumber = () => {
			return Math.floor((Math.random() - Math.random())*CONSTS.scale);
		};
		this.cube.position.set(
			randomNumber()*5,
			randomNumber()*3,
			randomNumber()*3
		);
		this.cube.rotation.x += randomNumber();
	  this.cube.rotation.y += randomNumber();
		this.cube.rotation.z += randomNumber();
	}

	addEdges() {
		this.edges = new THREE.EdgesGeometry( this.geometry );
	  this.lineMaterial = new THREE.LineBasicMaterial( {color: 0xffffff});
	  this.lines = new THREE.LineSegments( this.edges, this.lineMaterial );
	  this.lines.material.linewidth = CONSTS.lineWidth;
	  this.cube.add( this.lines );
	}

	addSpheres() {
		const cubeVertices = this.geometry.vertices;
		let spheres = [];

		for (let i = 2 ; i < cubeVertices.length ; i++){
      const sphereGeometry = new THREE.SphereGeometry(0.5,10,10);
      const sphereMaterial = new THREE.MeshBasicMaterial({color: (CONSTS.colorTone*Math.random()) });
      spheres[i] = new THREE.Mesh(sphereGeometry,sphereMaterial);
      spheres[i].position.set(
	      	cubeVertices[i].x,
	        cubeVertices[i].y,
	        cubeVertices[i].z
	    );
      this.cube.add(spheres[i]);
		}
	}

	paintEdges(myPos, currentColor, cubeOnScene) {
			const geometry1 = new THREE.Geometry();
			const toVertexPos = () => {
				geometry1.vertices.push(new THREE.Vector3(myPos.x, myPos.y, myPos.z));
			}
			toVertexPos();
			geometry1.vertices.push(new THREE.Vector3(-myPos.x, myPos.y, myPos.z));
			toVertexPos();
			geometry1.vertices.push(new THREE.Vector3(myPos.x, -myPos.y, myPos.z));
			toVertexPos()
			geometry1.vertices.push(new THREE.Vector3(myPos.x, myPos.y, -myPos.z));

			const material1 = new THREE.LineBasicMaterial( { color: currentColor, linewidth: 5 } );
			const vertexEdges = new THREE.Line(geometry1, material1);

			cubeOnScene.cube.add(vertexEdges);
	}

	onAnswer(event, cubeOnScene) {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		const intersects = raycaster.intersectObjects(cubeOnScene.cube.children);

		console.log(intersects)

		for (const sphere of intersects) {
			if (sphere.object.geometry.type === "SphereGeometry") {
				const currentObject = sphere.object;
				const currentColor = currentObject.material.color.getHex();
				console.log(currentColor)
				const myPos = currentObject.position;
				this.paintEdges(myPos, currentColor, cubeOnScene);
				break;
			}
		}
	}

	bind(cubeOnScene) {
		window.addEventListener( 'click', (it) => {
			this.onAnswer(it, cubeOnScene), false
		})
	}
}

drawCubes();
render();
