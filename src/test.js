import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';
import { EffectComposer } from 'three/addons/EffectComposer.js';
import { RenderPass } from 'three/addons/RenderPass.js';
import { HalftonePass } from 'three/addons/HalftonePass.js';
import Stats from 'three/addons/Stats.js';

// global variables

let camera, cameraMove, composer, controls, halftoneParams, halftonePass, object, matLine, matLine2, matLine3, originObject, originObject2, plane, planeFrame, planeMat, planeWire, renderer, renderPass, scene, postProcessing, wireframe, wireframe2, wireframe3, zTarget;

// global shapes

const basicSphere = new THREE.SphereGeometry( 1.5, 16, 16 );
const geo = new THREE.BoxGeometry( 1000, 500, 500, 40,20,20 ); // large scene box

// global materials

const greenery1 = new THREE.MeshPhongMaterial( { color: 0x2d7d2c, flatShading: true, side: THREE.DoubleSide } );
const dirt = new THREE.MeshPhongMaterial( { color: 0x693716, flatShading: true, side: THREE.DoubleSide } );
const material = new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true } );
const stageMaterial0 = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, flatShading: true, side: THREE.DoubleSide } );
const stageMaterial1 = new THREE.MeshPhongMaterial( { color: 0xBDBDBD, flatShading: true, side: THREE.DoubleSide } );
const stageMaterial2 = new THREE.MeshPhongMaterial( { color: 0x4D4D4D, flatShading: true, side: THREE.DoubleSide } );
const stageMaterial3 = new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true, side: THREE.DoubleSide } );
const stageMaterial00 = new THREE.MeshPhongMaterial( { color: 0xFF0085, flatShading: true, side: THREE.DoubleSide } );

// global settings

let filterToggle = false;
let greyToggle = true;
let lastTime;

// stats

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


// scene start

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
    scene.fog = new THREE.Fog( 0x000000, 150, 1500 );
    scene.background =  new THREE.Color( 0x151515 );

     // lighting

     scene.add( new THREE.AmbientLight( 0xcccccc, 3 ) );

     const light = new THREE.DirectionalLight( 0xffffff, 1 );
     light.position.set( 1, 1, 1 );
     scene.add( light );

    // scene wireframe structure

    sceneStructure();

    // stage 1 and objects

    stage1(0);
    props1(0);
    animation1();

    // stage 2 and objects

    stage2(-1000);
    props2(-1000);

    // stage 3 and objects

    stage3(-4000);
    props3(-4000);

    // stage 4 and objects

    stage4(-2000);
    props4(-2000);

    // stage 5 and objects

    stage5(-3000);
    props5(-3000);

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

    document.addEventListener( 'keyup' , keyboardControls);

    // halftone effect
    
    halftoneEffect();

}

// animation and render loop

function animate() {

    stats.begin();
    
    // animations
    
    animation1();
    animation2();

    // camera movement

    cameraAnimation();

    // render
    if (filterToggle) {
        composer.render( scene, camera );
    } else if (!filterToggle) {
        renderer.render( scene, camera );
    }

    stats.end();
    
}

// user interaction and effects functions

// function for moving the camera a set distance on key press

function keyboardControls(e) {
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
    if (e.key == 'q') {
        if (filterToggle) {
            filterToggle = false;
        } else if (!filterToggle) {
            filterToggle = true;
        }
    } else if (e.key == 'g') {
        if (halftonePass.uniforms[ 'greyscale' ].value) {
            halftonePass.uniforms[ 'greyscale' ].value = false;
        } else if (!halftonePass.uniforms[ 'greyscale' ].value) {
            halftonePass.uniforms[ 'greyscale' ].value = true;
        }
    } else if (e.key == 'l') {
        console.log(renderer.log);
    }
}

// function for animating camera move

function cameraAnimation() {
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

// function for resizing scene when the window resizes

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

// halftone effect

function halftoneEffect() {
    composer = new EffectComposer( renderer );
				renderPass = new RenderPass( scene, camera );
				halftoneParams = {
					shape: 1,
					radius: 10,
					rotateR: Math.PI / 12,
					rotateB: Math.PI / 12 * 2,
					rotateG: Math.PI / 12 * 3,
					scatter: 0,
					blending: 1,
					blendingMode: 1,
					greyscale: true,
					disable: false
				};
	halftonePass = new HalftonePass( window.innerWidth, window.innerHeight, halftoneParams );
	composer.addPass( renderPass );
	composer.addPass( halftonePass );
}

// functions for objects and architecture

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

// stage 1

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

    let halfSphere = new THREE.SphereGeometry( 250, 32, 32, 0, Math.PI*2, 0, ((Math.PI)*0.2) );
    let floorOrb = new THREE.Mesh( halfSphere, stageMaterial1 );
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

        const mesh = new THREE.Mesh( basicSphere, stageMaterial2 );

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

function animation1() {
    object.rotation.x += 0.005;
    object.rotation.y += 0.005;
}

// stage 2

function stage2(depthOffset) {

    // archway interior

    let archWay = new THREE.CylinderGeometry( 400,400,500,50,10,true,0,3.14159 );
    let archMesh = new THREE.Mesh( archWay, stageMaterial0 );
    archMesh.position.set( 0,-250,0+depthOffset );
    archMesh.rotation.set( -1.5708,-1.5708,0 );
    scene.add( archMesh );

    // archway face

    let s2frontVert = new THREE.PlaneGeometry( 100, 500 );
    let s2frontWall1 = new THREE.Mesh( s2frontVert, stageMaterial1 );
    s2frontWall1.position.set( -450,0,250+depthOffset );
    scene.add( s2frontWall1 );

    let s2frontWall2 = new THREE.Mesh( s2frontVert, stageMaterial1 );
    s2frontWall2.position.set( 450,0,250+depthOffset );
    scene.add( s2frontWall2 );

    let s2frontHorz = new THREE.PlaneGeometry( 1000, 100 );
    let s2frontWall3 = new THREE.Mesh( s2frontHorz, stageMaterial1 );
    s2frontWall3.position.set( 0,200,250+depthOffset );
    scene.add( s2frontWall3 );

    let frontArch = new THREE.RingGeometry(400,500,50,10,0,3.14159 );
    let archFace = new THREE.Mesh( frontArch, stageMaterial1 );
    archFace.position.set( 0,-250,250+depthOffset );
    scene.add( archFace );

    let archFill = new THREE.PlaneGeometry( 120, 120 );
    let leftFill = new THREE.Mesh( archFill, stageMaterial1 );
    leftFill.position.set( -350,100,250+depthOffset );
    scene.add( leftFill );

    let rightFill = new THREE.Mesh( archFill, stageMaterial1 );
    rightFill.position.set( 350,100,250+depthOffset );
    scene.add( rightFill );

    // ground

    let floorPlane = new THREE.PlaneGeometry( 1000, 500 );
    let floor = new THREE.Mesh( floorPlane, stageMaterial1 );
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

function animation2() {
    originObject.rotation.y += 0.005;
    originObject2.rotation.y -= 0.004;
}

// stage 3

function stage3(depthOffset) {

    // ground

    let ground = new THREE.BoxGeometry( 980, 30, 480 );
    let groundMain = new THREE.Mesh( ground, stageMaterial1 );
    groundMain.position.set ( 0,-235,0+depthOffset );
    scene.add ( groundMain );

    // outer lip

    let longEdge = new THREE.BoxGeometry( 1000, 40, 10 );

    let edgeFront = new THREE.Mesh( longEdge, stageMaterial1 );
    edgeFront.position.set(0, -230, -245+depthOffset );
    scene.add( edgeFront );

    let edgeBack = new THREE.Mesh( longEdge, stageMaterial1 );
    edgeBack.position.set(0, -230, 245+depthOffset );
    scene.add( edgeBack );

    let shortEdge = new THREE.BoxGeometry( 10, 40, 480 );

    let leftEdge = new THREE.Mesh( shortEdge, stageMaterial1 );
    leftEdge.position.set( -495, -230, 0+depthOffset );
    scene.add( leftEdge );

    let rightEdge = new THREE.Mesh( shortEdge, stageMaterial1 );
    rightEdge.position.set( 495, -230, 0+depthOffset );
    scene.add( rightEdge );

}

function props3(depthOffset) {

    // grass

    let grass = new THREE.CylinderGeometry( 1,1,1,3 ); 

    for ( let i = 0; i < 4000; i ++ ) {

        const mesh = new THREE.Mesh( grass, greenery1 );

        if (i < 2000) {
            mesh.position.set( (Math.random()*300)+175, -215, (Math.random()*470)-240+depthOffset );
        } else {
            mesh.position.set( (Math.random()*300)-475, -215, (Math.random()*470)-240+depthOffset );
        }

        mesh.rotation.set( Math.random()-0.5, Math.random()-0.5, Math.random()-0.5 );
        mesh.scale.x = mesh.scale.z = Math.random() * 0.5 + 0.5;
        mesh.scale.y = Math.random() * 55 + 20;
        scene.add( mesh );

    }

}

function animation3() {

}

// stage 4

function stage4(depthOffset) {

    // side walls

    let sideWallLG = new THREE.BoxGeometry( 10, 200, 500 );
    let sideWallSM = new THREE.BoxGeometry( 10, 100, 300 );

    // right side

    let rightsideTop = new THREE.Mesh( sideWallLG, stageMaterial0 );
    rightsideTop.position.set( 495, 150 , 0+depthOffset );
    scene.add( rightsideTop );

    let rightsideBottom = new THREE.Mesh( sideWallLG, stageMaterial0 );
    rightsideBottom.position.set( 495, -150 , 0+depthOffset );
    scene.add( rightsideBottom );

    let rightsideMid = new THREE.Mesh( sideWallSM, stageMaterial0 );
    rightsideMid.position.set( 495, 0, 100+depthOffset );
    scene.add( rightsideMid );

    // left side

    let leftsideTop = new THREE.Mesh( sideWallLG, stageMaterial0 );
    leftsideTop.position.set( -495, 150 , 0+depthOffset );
    scene.add( leftsideTop );

    let leftsideBottom = new THREE.Mesh( sideWallLG, stageMaterial0 );
    leftsideBottom.position.set( -495, -150 , 0+depthOffset );
    scene.add( leftsideBottom );

    let leftsideMid = new THREE.Mesh( sideWallSM, stageMaterial0 );
    leftsideMid.position.set( -495, 0, 100+depthOffset );
    scene.add( leftsideMid );

    // top and bottom

    let largeSide = new THREE.BoxGeometry( 980, 10, 500 );

    let topSide = new THREE.Mesh( largeSide, stageMaterial0 );
    topSide.position.set( 0, 245, 0+depthOffset );
    scene.add( topSide );

    let bottomSide  = new THREE.Mesh( largeSide, stageMaterial0 );
    bottomSide.position.set( 0, -245, 0+depthOffset );
    scene.add( bottomSide );

    // floor and well

    // floor

    let floorLong = new THREE.BoxGeometry( 980, 150, 10 );
    let floorShort = new THREE.BoxGeometry( 400, 200, 10 );

    let floorTop = new THREE.Mesh( floorLong, stageMaterial1 );
    floorTop.position.set( 0, 175, -245+depthOffset );
    scene.add( floorTop );

    let floorBottom = new THREE.Mesh( floorLong, stageMaterial1 );
    floorBottom.position.set( 0, -175, -245+depthOffset );
    scene.add( floorBottom );

    let floorRight = new THREE.Mesh( floorShort, stageMaterial1 );
    floorRight.position.set( 300, 0, -245+depthOffset );
    scene.add( floorRight );

    let floorLeft = new THREE.Mesh( floorShort, stageMaterial1 );
    floorLeft.position.set( -300, 0, -245+depthOffset );
    scene.add( floorLeft );

    // well 

    // well walls

    let wellOuter = new THREE.CylinderGeometry( 100, 100, 40, 32, 1, true );
    let wellInner = new THREE.CylinderGeometry( 90, 90, 40, 32, 1, true );

    let wellOutside = new THREE.Mesh( wellOuter, stageMaterial2 );
    wellOutside.position.set( 0, 0, -230+depthOffset );
    wellOutside.rotation.set( 1.5708, 0, 0 );
    scene.add( wellOutside );

    let wellInside = new THREE.Mesh( wellInner, stageMaterial2 );
    wellInside.position.set( 0, 0, -230+depthOffset );
    wellInside.rotation.set( 1.5708, 0, 0 );
    scene.add( wellInside );

    // well top

    let wellRim = new THREE.RingGeometry( 90, 100, 32, 1 );
    let wellTop = new THREE.Mesh( wellRim, stageMaterial2 );
    wellTop.position.set( 0, 0, -210+depthOffset );
    scene.add( wellTop );

    // walkway

    // around well

    let wellGround = new THREE.RingGeometry( 100, 200, 32, 1 );
    let wellBottom = new THREE.Mesh( wellGround, stageMaterial0 );
    wellBottom.position.set( 0, 0, -230+depthOffset );
    scene.add( wellBottom );

    let groundRim = new THREE.CylinderGeometry( 200, 200, 10, 32, 1, true );
    let circleWall = new THREE.Mesh( groundRim, stageMaterial0 );
    circleWall.position.set( 0, 0, -235+depthOffset );
    circleWall.rotation.set( 1.5708, 0, 0 );
    scene.add( circleWall ); 

    let sideWalk = new THREE.BoxGeometry( 350, 100, 10 );

    let sidewalkRight = new THREE.Mesh( sideWalk, stageMaterial0 );
    sidewalkRight.position.set( 325, 0, -235+depthOffset );
    scene.add( sidewalkRight );

    let sidewalkLeft = new THREE.Mesh( sideWalk, stageMaterial0 );
    sidewalkLeft.position.set( -325, 0, -235+depthOffset );
    scene.add( sidewalkLeft );

}

function props4(depthOffset) {

}

function animation4() {

}

// stage 5

function stage5(depthOffset) {
    const voidBox = new WireframeGeometry2( geo );

	let voidLine = new LineMaterial( {

		color: 0xFFFFFF,
        linewidth: 2, // in pixels
        opacity: 0.2,
        dashed: false,
        transparent: true

    } );

    let voidFrame = new Wireframe( voidBox, voidLine );
    voidFrame.computeLineDistances();
    voidFrame.position.set(0,0,0+depthOffset);
    scene.add( voidFrame );
}

function props5(depthOffset) {

}

function animation5() {

}

// degrees to radians
// 90 = 1.5708
// 180 = 3.14159

//equation = Deg × π/180 = Rad