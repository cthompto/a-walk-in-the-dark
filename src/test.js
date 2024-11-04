import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';


let camera, controls, geo, object, matLine, renderer, scene, postProcessing, wireframe;

init();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    //

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 800;

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

    geo = new THREE.BoxGeometry( 500, 500, 500, 20,20,20 );

	const geometry2 = new WireframeGeometry2( geo );

	matLine = new LineMaterial( {

		color: 0xFFFFFF,
        linewidth: 1, // in pixels
        dashed: false

    } );

    wireframe = new Wireframe( geometry2, matLine );
    wireframe.computeLineDistances();
    wireframe.scale.set( 1, 1, 1 );
    scene.add( wireframe );

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
}