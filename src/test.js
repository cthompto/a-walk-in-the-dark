import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';


let camera, cameraMove, zTarget, controls, geo, geo2, geo3, object, matLine, matLine2, matLine3, plane, planeFrame, planeMat, planeWire, renderer, scene, postProcessing, wireframe, wireframe2, wireframe3;


init();

function init() {

    // step scene

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setAnimationLoop( animate );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.z = 750;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x000000, 250, 2000 );
    scene.background =  new THREE.Color( 0x151515 );

    object = new THREE.Object3D();
    scene.add( object );

    // objects in first box

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

    // title text

    const loader = new FontLoader();
    loader.load('../assets/fonts/Quantico/Quantico_Bold.json', function ( font ) {
        const fontColor = 0xffffff;
        const fontMat = new THREE.LineBasicMaterial( {
            color: fontColor,
            side: THREE.DoubleSide
        } );

        const message = ' A Walk in The Dark'
        const shapes = font.generateShapes( message, 25 );
        const fontGeo = new THREE.ShapeGeometry( shapes );
        fontGeo.computeBoundingBox();
        const xMid = - 0.5 * ( fontGeo.boundingBox.max.x - fontGeo.boundingBox.min.x );
		fontGeo.translate( xMid, 0, 0 );
        const text = new THREE.Mesh( fontGeo, fontMat );
		text.position.z = 250;
		scene.add( text );
    })

    // lower plane

    plane = new THREE.PlaneGeometry( 1000, 2500, 40, 100);
    planeFrame = new WireframeGeometry2( plane );
    planeMat = new LineMaterial( {

        color: 0xFFFFFF,
        linewidth: 1, // in pixels
        opacity: 0.4,
        dashed: false,
        transparent: true

    } );

    planeWire = new Wireframe( planeFrame, planeMat );
    planeWire.computeLineDistances();
    planeWire.scale.set( 1, 1, 1 );
    planeWire.position.set(0,-255,-1000);
    planeWire.rotation.set(1.5708,0,0);
    scene.add( planeWire );


    // first box

    geo = new THREE.BoxGeometry( 1000, 500, 500, 40,20,20 );

	const geometry2 = new WireframeGeometry2( geo );

	matLine = new LineMaterial( {

		color: 0xFF00FF,
        linewidth: 2, // in pixels
        opacity: 0.2,
        dashed: false,
        transparent: true

    } );

    wireframe = new Wireframe( geometry2, matLine );
    wireframe.computeLineDistances();
    wireframe.scale.set( 1, 1, 1 );
    scene.add( wireframe );

    // second box

    geo2 = new THREE.BoxGeometry( 1000, 500, 500, 40,20,20 );

	const geometry3 = new WireframeGeometry2( geo2 );

	matLine2 = new LineMaterial( {

		color: 0xFFFF00,
        linewidth: 2, // in pixels
        opacity: 0.2,
        dashed: false,
        transparent: true

    } );

    wireframe2 = new Wireframe( geometry3, matLine2 );
    wireframe2.computeLineDistances();
    wireframe2.scale.set( 1, 1, 1 );
    wireframe2.position.set(0,0,-1000);
    scene.add( wireframe2 );

    // third box

    geo3 = new THREE.BoxGeometry( 1000, 500, 500, 40,20,20 );

	const geometry4 = new WireframeGeometry2( geo3 );

	matLine3 = new LineMaterial( {

		color: 0x00FFFF,
        linewidth: 2, // in pixels
        opacity: 0.2,
        dashed: false,
        transparent: true

    } );

    wireframe3 = new Wireframe( geometry4, matLine3 );
    wireframe3.computeLineDistances();
    wireframe3.scale.set( 1, 1, 1 );
    wireframe3.position.set(0,0,-2000);
    scene.add( wireframe3 );

    // stage 1 objects

    stage1();

    // lighting

    scene.add( new THREE.AmbientLight( 0xcccccc ) );

    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // orbit controls for debugging

    controls = new OrbitControls( camera, renderer.domElement );
    controls.listenToKeyEvents( window );
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 10000;
    controls.maxPolarAngle = Math.PI / 2;

    // window resizer

    window.addEventListener( 'resize', onWindowResize );

    // main controls (forward and backward)

    document.addEventListener( 'keyup' , cameraMovement);

}

// function for moving the camera a set distance on key press

function cameraMovement(e) {
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
            console.log(zTarget);
        }
    }
}

// function for resizing scene when the window resizes

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// animation and render loop

function animate() {
    object.rotation.x += 0.005;
    object.rotation.y += 0.005;
    renderer.render( scene, camera );
    if (camera.position.z < zTarget) {
        camera.position.z = camera.position.z + 5;
        cameraMove = true;
    } else if (camera.position.z > zTarget) {
        camera.position.z = camera.position.z - 5;
        cameraMove = true;
    } else {
        cameraMove = false;
    }
}

function stage1() {

    // back wall

    let stageMaterial0 = new THREE.MeshPhongMaterial( { color: 0x858585, flatShading: true } );
    let stageMaterial00 = new THREE.MeshPhongMaterial( { color: 0xFF0085, flatShading: true } );

    // left plane

    let backPlane1 = new THREE.PlaneGeometry( 250, 500 );
    let backWall1 = new THREE.Mesh( backPlane1, stageMaterial0 );
    backWall1.position.set( -375,0,-250 );
    scene.add(backWall1);

    // right plane

    let backPlane2 = new THREE.PlaneGeometry( 250, 500 );
    let backWall2 = new THREE.Mesh( backPlane2, stageMaterial0 );
    backWall2.position.set( 375,0,-250 );
    scene.add(backWall2);

    // top plane

    let backPlane3 = new THREE.PlaneGeometry( 500, 100 );
    let backWall3 = new THREE.Mesh( backPlane3, stageMaterial0 );
    backWall3.position.set( 0,200,-250 );
    scene.add(backWall3);

    // right arch

    let backArch1 = new THREE.RingGeometry( 100, 200, 32, 2, 0, 1.5708 );
    let backCurve1 = new THREE.Mesh( backArch1, stageMaterial0 );
    backCurve1.position.set( 150,50,-250 );
    scene.add( backCurve1 );

    // left arch

    let backArch2 = new THREE.RingGeometry( 100, 200, 32, 2, 1.5708, 1.5708 );
    let backCurve2 = new THREE.Mesh( backArch2, stageMaterial0 );
    backCurve2.position.set( -150,50,-250 );
    scene.add( backCurve2 );
}