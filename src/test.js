import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';

// global variables

let camera, cameraMove, zTarget, controls, geo, object, matLine, matLine2, matLine3, originObject, originObject2, plane, planeFrame, planeMat, planeWire, renderer, scene, postProcessing, wireframe, wireframe2, wireframe3;

// global shapes

const basicSphere = new THREE.SphereGeometry( 1.5, 16, 16 );

// global materials

const material = new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true } );
const stageMaterial0 = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, flatShading: true, side: THREE.DoubleSide } );
const stageMaterial00 = new THREE.MeshPhongMaterial( { color: 0xFF0085, flatShading: true, side: THREE.DoubleSide } );

init();

function init() {

    // setup scene

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

     // lighting

     scene.add( new THREE.AmbientLight( 0xcccccc ) );

     const light = new THREE.DirectionalLight( 0xffffff, 3 );
     light.position.set( 1, 1, 1 );
     scene.add( light );

    // scene wireframe structure

    sceneStructure();

    // stage 1 and objects

    stage1(-1000);
    props1(-1000);

    // stage 2 and objects

    stage2(0);
    props2(0);

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
    originObject.rotation.y += 0.005;
    originObject2.rotation.y -= 0.004;
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

function sceneStructure() {
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

	const geometry3 = new WireframeGeometry2( geo );

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

	const geometry4 = new WireframeGeometry2( geo );

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
}

function stage1(depthOffset) {

    // back wall

    // left plane

    let backPlane1 = new THREE.PlaneGeometry( 250, 500 );
    let backWall1 = new THREE.Mesh( backPlane1, stageMaterial0 );
    backWall1.position.set( -375,0,-250+depthOffset );
    scene.add(backWall1);

    // right plane

    let backWall2 = new THREE.Mesh( backPlane1, stageMaterial0 );
    backWall2.position.set( 375,0,-250+depthOffset );
    scene.add(backWall2);

    // top plane

    let backPlane3 = new THREE.PlaneGeometry( 500, 100 );
    let backWall3 = new THREE.Mesh( backPlane3, stageMaterial0 );
    backWall3.position.set( 0,200,-250+depthOffset );
    scene.add(backWall3);

    // right arch

    let backArch1 = new THREE.RingGeometry( 100, 200, 32, 2, 0, 1.5708 );
    let backCurve1 = new THREE.Mesh( backArch1, stageMaterial0 );
    backCurve1.position.set( 150,50,-250+depthOffset );
    scene.add( backCurve1 );

    // left arch

    let backArch2 = new THREE.RingGeometry( 100, 200, 32, 2, 1.5708, 1.5708 );
    let backCurve2 = new THREE.Mesh( backArch2, stageMaterial0 );
    backCurve2.position.set( -150,50,-250+depthOffset );
    scene.add( backCurve2 );


    // other walls

    // left wall

    let sidePlane = new THREE.PlaneGeometry( 500, 500 );
    let leftWall = new THREE.Mesh( sidePlane, stageMaterial0 );
    leftWall.position.set( -500,0,0+depthOffset );
    leftWall.rotation.set( 0,1.5708,0 );
    scene.add(leftWall);

    // right wall

    let rightWall = new THREE.Mesh( sidePlane, stageMaterial0 );
    rightWall.position.set( 500,0,0+depthOffset );
    rightWall.rotation.set( 0,-1.5708,0 );
    scene.add(rightWall);

    // floor

    let floorPlane = new THREE.PlaneGeometry( 1000, 500 );
    let floor = new THREE.Mesh( floorPlane, stageMaterial0 );
    floor.position.set( 0,-250,0+depthOffset );
    floor.rotation.set( -1.5708,0,0 );
    scene.add(floor);

    // ceiling 

    let ceiling = new THREE.Mesh( floorPlane, stageMaterial0 );
    ceiling.position.set( 0,250,0+depthOffset );
    ceiling.rotation.set( 1.5708,0,0 );
    scene.add(ceiling);

    // stage details

    // floor dome

    let halfSphere = new THREE.SphereGeometry( 250, 32, 32, 0, Math.PI*2, 0, ((Math.PI)*0.25) );
    let floorOrb = new THREE.Mesh( halfSphere, stageMaterial0 );
    floorOrb.position.set ( 0,-450,0+depthOffset );
    scene.add( floorOrb );

    // left pillar

    let pillar = new THREE.BoxGeometry( 100, 500, 100 );
    let leftPillar = new THREE.Mesh( pillar, stageMaterial0 );
    leftPillar.position.set ( -450,0,0+depthOffset );
    scene.add ( leftPillar );

    // right pillar

    let rightPillar = new THREE.Mesh( pillar, stageMaterial0 );
    rightPillar.position.set ( 450,0,0+depthOffset );
    scene.add ( rightPillar );

}

function props1(depthOffset) {
    // objects in first box

    // origin for all objects
    object = new THREE.Object3D();
    scene.add( object );
    object.position.set(0,0,0+depthOffset);

    for ( let i = 0; i < 10; i ++ ) {

        const mesh = new THREE.Mesh( basicSphere, material );

        mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
        //mesh.translateZ(-1000);
        mesh.position.multiplyScalar( Math.random() * 100 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 30 + 30;
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
		text.position.z = 250+depthOffset;
		scene.add( text );
    })
}

function stage2(depthOffset) {

    // archway interior

    let archWay = new THREE.CylinderGeometry( 400,400,500,50,10,true,0,3.14159 );
    let archMesh = new THREE.Mesh( archWay, stageMaterial0 );
    archMesh.position.set( 0,-250,0+depthOffset );
    archMesh.rotation.set( -1.5708,-1.5708,0 );
    scene.add( archMesh );

    // archway face

    let s2frontVert = new THREE.PlaneGeometry( 100, 500 );
    let s2frontWall1 = new THREE.Mesh( s2frontVert, stageMaterial0 );
    s2frontWall1.position.set( -450,0,250+depthOffset );
    scene.add( s2frontWall1 );

    let s2frontWall2 = new THREE.Mesh( s2frontVert, stageMaterial0 );
    s2frontWall2.position.set( 450,0,250+depthOffset );
    scene.add( s2frontWall2 );

    let s2frontHorz = new THREE.PlaneGeometry( 1000, 100 );
    let s2frontWall3 = new THREE.Mesh( s2frontHorz, stageMaterial0 );
    s2frontWall3.position.set( 0,200,250+depthOffset );
    scene.add( s2frontWall3 );

    let frontArch = new THREE.RingGeometry(400,500,50,10,0,3.14159 );
    let archFace = new THREE.Mesh( frontArch, stageMaterial0 );
    archFace.position.set( 0,-250,250+depthOffset );
    scene.add( archFace );

    let archFill = new THREE.PlaneGeometry( 120, 120 );
    let leftFill = new THREE.Mesh( archFill, stageMaterial0 );
    leftFill.position.set( -350,100,250+depthOffset );
    scene.add( leftFill );

    let rightFill = new THREE.Mesh( archFill, stageMaterial0 );
    rightFill.position.set( 350,100,250+depthOffset );
    scene.add( rightFill );

    // ground

    let floorPlane = new THREE.PlaneGeometry( 1000, 500 );
    let floor = new THREE.Mesh( floorPlane, stageMaterial0 );
    floor.position.set( 0,-250,depthOffset );
    floor.rotation.set( -1.5708,0,0 );
    scene.add(floor);

}

function props2(depthOffset) {
    // origin for all objects
    originObject = new THREE.Object3D();
    scene.add( originObject );
    originObject.position.set(0,-249,0+depthOffset);

    let circleGeometry = new THREE.CircleGeometry( 1, 32 );

    for ( let i = 0; i < 15; i ++ ) {

        const mesh = new THREE.Mesh( circleGeometry, material );

        mesh.position.set( Math.random() - 0.5, 0, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 125 );
        mesh.rotation.set( -1.5708, 0, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 25 + 75;
        originObject.add( mesh );

    }

    originObject2 = new THREE.Object3D();
    scene.add( originObject2 );
    originObject2.position.set(0,-249,0+depthOffset);

    for ( let i = 0; i < 15; i ++ ) {

        const mesh = new THREE.Mesh( circleGeometry, material );

        mesh.position.set( Math.random() - 0.5, 0, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 125 );
        mesh.rotation.set( -1.5708, 0, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 25 + 75;
        originObject2.add( mesh );

    }

}

// degrees to radians
// 90 = 1.5708
// 180 = 3.14159

//equation = Deg × π/180 = Rad