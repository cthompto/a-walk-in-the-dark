import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';


let camera, cameraMove, zTarget, controls, geo, geo2, geo3, object, matLine, matLine2, matLine3, renderer, scene, postProcessing, wireframe, wireframe2, wireframe3;



init();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 750;

    scene = new THREE.Scene();
    //scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    object = new THREE.Object3D();
    scene.add( object );

    const geometry = new THREE.SphereGeometry( 1, 4, 4 );
    const material = new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true } );

    for ( let i = 0; i < 100; i ++ ) {

        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 200 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
        object.add( mesh );

    }

    //first box

    geo = new THREE.BoxGeometry( 500, 500, 500, 20,20,20 );

	const geometry2 = new WireframeGeometry2( geo );

	matLine = new LineMaterial( {

		color: 0xFF00FF,
        linewidth: 1, // in pixels
        opacity: 0.25,
        dashed: false,
        transparent: true

    } );

    wireframe = new Wireframe( geometry2, matLine );
    wireframe.computeLineDistances();
    wireframe.scale.set( 1, 1, 1 );
    scene.add( wireframe );

    // second box

    geo2 = new THREE.BoxGeometry( 500, 500, 500, 20,20,20 );

	const geometry3 = new WireframeGeometry2( geo2 );

	matLine2 = new LineMaterial( {

		color: 0xFFFF00,
        linewidth: 1, // in pixels
        opacity: 0.25,
        dashed: false,
        transparent: true

    } );

    wireframe2 = new Wireframe( geometry3, matLine2 );
    wireframe2.computeLineDistances();
    wireframe2.scale.set( 1, 1, 1 );
    wireframe2.position.set(0,0,-1000);
    scene.add( wireframe2 );

    // third box

    geo3 = new THREE.BoxGeometry( 500, 500, 500, 20,20,20 );

	const geometry4 = new WireframeGeometry2( geo3 );

	matLine3 = new LineMaterial( {

		color: 0x00FFFF,
        linewidth: 1, // in pixels
        opacity: 0.25,
        dashed: false,
        transparent: true

    } );

    wireframe3 = new Wireframe( geometry4, matLine3 );
    wireframe3.computeLineDistances();
    wireframe3.scale.set( 1, 1, 1 );
    wireframe3.position.set(0,0,-2000);
    scene.add( wireframe3 );

    scene.add( new THREE.AmbientLight( 0xcccccc ) );

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controls.screenSpacePanning = false;

    controls.minDistance = 100;
    controls.maxDistance = 1000;

    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener( 'resize', onWindowResize );

    document.addEventListener( 'keyup' , forward);

}

function forward(e) {
    console.log('key logged')
    if (!cameraMove) {
        if (e.key == 'w') {
            zTarget = camera.position.z-1000;
            //camera.position.z = camera.position.z-1000;
            console.log('w');
            console.log(zTarget);
        } else if (e.key == 's') {
            zTarget = camera.position.z+1000;
            //camera.position.z = camera.position.z+1000;
            console.log('s');
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    object.rotation.x += 0.005;
    object.rotation.y += 0.005;
    renderer.render( scene, camera );
    if (camera.position.z < zTarget) {
        camera.position.z ++;
        cameraMove = true;
    } else if (camera.position.z > zTarget) {
        camera.position.z --;
        cameraMove = true;
    } else {
        cameraMove = false;
    }
}