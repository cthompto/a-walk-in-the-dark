import * as THREE from 'three';
//import { pass } from 'three/tsl';
//import { DotScreenPass } from 'three/addons/DotScreenPass.js';
import { FontLoader } from 'three/addons/FontLoader.js';
//import { OrbitControls } from 'three/addons/OrbitControls.js';
import { LineMaterial } from 'three/addons/LineMaterial.js';
import { Wireframe } from 'three/addons/Wireframe.js';
import { WireframeGeometry2 } from 'three/addons/WireframeGeometry2.js';
import { EffectComposer } from 'three/addons/EffectComposer.js';
import { RenderPass } from 'three/addons/RenderPass.js';
import { HalftonePass } from 'three/addons/HalftonePass.js';
import Stats from 'three/addons/Stats.js';

// global variables

let audioOn, camera, cameraDirection, cameraMove, chosen, composer, controls, figureTop, figureBottom, halftoneParams, halftonePass, object, matLine, matLine2, matLine3, originObject, originObject2, aniObject4, plane, planeFrame, planeMat, planeWire, renderer, renderPass, scene, postProcessing, voidFrame, wireframe, wireframe2, wireframe3, zTarget;

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
const stageMaterial01 = new THREE.MeshPhongMaterial( { color: 0x6f03a8, flatShading: true, side: THREE.DoubleSide } );

// array for scene spacing

let spaceArray = [-1000,-2000,-3000,-4000,-5000];

// global settings

let filterToggle = true;
//let greyToggle = true;
let lineMove4 = true;
let rotMove4 = false;
let direction4 = true;
let directionB4 = true;
let direction5 = true;

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

    // overlay

    // Identify the html divs for the overlays
    const blocker = document.getElementById("blocker");
    const instructions = document.getElementById("instructions");
    const button = document.getElementById("startButton");

    // Listen for clicks and respond by removing overlays and starting mouse look controls
    button.addEventListener("click", function () {
        instructions.style.display = "none";
        blocker.style.display = "none";
        chosen = true;
        //audioStart();
        if (audioOn) {
            audioToggle();
        }
    });

    // lighting

    scene.add( new THREE.AmbientLight( 0xcccccc, 2 ) );

    const light = new THREE.DirectionalLight( 0xffffff, 0.9 );
    light.position.set( 0, 0, 250 );
    scene.add( light );

    // scene wireframe structure

    //sceneStructure();
    titleText(-100);

    // shuffle scenes

    shuffle(spaceArray);
    console.log(spaceArray);

    // stage 1 and objects

    stage1(spaceArray[0]);
    props1(spaceArray[0]);

    // stage 2 and objects

    stage2(spaceArray[1]);
    props2(spaceArray[1]);

    // stage 3 and objects

    stage3(spaceArray[2]);
    props3(spaceArray[2]);

    // stage 4 and objects

    stage4(spaceArray[3]);
    props4(spaceArray[3]);

    // stage 5 and objects

    stage5(spaceArray[4]);
    props5(spaceArray[4]);

    // orbit controls for debugging

    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.listenToKeyEvents( window );
    // controls.enableDamping = false;
    // controls.screenSpacePanning = false;
    // controls.enableZoom = true;
    // controls.enablePan = false;
    // // controls.minZoom = 0;
    // // controls.maxDistance = 0;
    // controls.minPolarAngle = Math.PI * 0.47;
    // controls.maxPolarAngle = Math.PI * 0.53;
    // controls.minAzimuthAngle = (Math.PI*4) * 0.49;
    // controls.maxAzimuthAngle = (Math.PI*4) * 0.51;
    // controls.update();

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
    console.log(camera.position.z);
    // animations
    
    animation1();
    animation2();
    animation3();
    animation4();
    animation5();

    // camera movement
    //controls.update();
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
            cameraDirection = "forward";
            console.log('w');
            console.log(zTarget);
        } else if (e.key == 's') {
            cameraDirection = "backward";
            zTarget = camera.position.z+1000;
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
    if (cameraDirection == "backward") {
        if (camera.position.z <= zTarget) {
            camera.position.set(0,0,camera.position.z + 5);
            //controls.update();
            cameraMove = true;
        }
        cameraMove = false;
    } else if (cameraDirection == "forward") {
        if (camera.position.z >= zTarget) {
            camera.position.set(0,0,camera.position.z - 5);
            //controls.update();
            cameraMove = true;
        }
        cameraMove = false;
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
					scatter: .75,
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

    wireframe = new Wireframe( geometry2, planeMat );
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

    wireframe2 = new Wireframe( geometry3, planeMat );
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

    wireframe3 = new Wireframe( geometry4, planeMat );
    wireframe3.computeLineDistances();
    wireframe3.scale.set( 1, 1, 1 );
    wireframe3.position.set(0,0,-2000);
    scene.add( wireframe3 );
}

// title card

function titleText(depthOffset) {
    // title text

    const loader = new FontLoader();
    loader.load('./assets/fonts/Quantico/Quantico_Bold.json', function ( font ) {
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

        const mesh = new THREE.Mesh( basicSphere, stageMaterial01 );

        mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
        mesh.position.multiplyScalar( Math.random() * 100 );
        mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 30 + 30;
        object.add( mesh );

    }

    
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

        const mesh = new THREE.Mesh( circleGeometry, stageMaterial01 );

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

        const mesh = new THREE.Mesh( circleGeometry, stageMaterial01 );

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
    let groundMain = new THREE.Mesh( ground, dirt );
    groundMain.position.set ( 0,-235,0+depthOffset );
    scene.add ( groundMain );

    // let newLight2 = new THREE.DirectionalLight( 0xffffff, 3 );
    // newLight2.position.set ( 0, 2000, 0+depthOffset );
    // newLight2.target = groundMain;
    // groundMain.add( newLight2 );

    let pointLight = new THREE.PointLight( 0xfffffff, 20, 700, 0.2 );
    pointLight.position.set( 0, 0, 0+depthOffset );
    scene.add( pointLight );

    // outer lip

    let longEdge = new THREE.BoxGeometry( 1000, 40, 10 );

    let edgeFront = new THREE.Mesh( longEdge, stageMaterial2 );
    edgeFront.position.set(0, -230, -245+depthOffset );
    scene.add( edgeFront );

    let edgeBack = new THREE.Mesh( longEdge, stageMaterial2 );
    edgeBack.position.set(0, -230, 245+depthOffset );
    scene.add( edgeBack );

    let shortEdge = new THREE.BoxGeometry( 10, 40, 480 );

    let leftEdge = new THREE.Mesh( shortEdge, stageMaterial2 );
    leftEdge.position.set( -495, -230, 0+depthOffset );
    scene.add( leftEdge );

    let rightEdge = new THREE.Mesh( shortEdge, stageMaterial2 );
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
// test
function props4(depthOffset) {

    aniObject4 = new THREE.Object3D();
    aniObject4.position.set( 0,0,-195+depthOffset );
    scene.add( aniObject4 );

    let figureMesh = new THREE.CylinderGeometry( 0, 25, 75, 32, 1 );
    
    figureBottom = new THREE.Mesh( figureMesh, stageMaterial01 );
    figureBottom.position.set( -645,0,0 );
    figureBottom.rotation.set( 1.5708, 0, 0 );
    aniObject4.add( figureBottom );

    console.log(figureBottom.position.y);

}

function animation4() {

    if (lineMove4) {
        if (direction4) {
            if (figureBottom.position.x < -145 ) {
                figureBottom.position.x += 1;
            } else if (figureBottom.position.x == -145) {
                lineMove4 = false;
                let randomPick = Math.random();
                if (randomPick  < 0.5 ) {
                    directionB4 = true;
                } else {
                    directionB4 = false;
                }
                rotMove4 = true;
            }
        } else if (!direction4) {
            figureBottom.position.x -= 1;

            if (figureBottom.position.x <= -645) {
                aniObject4.rotation.set ( 0 , 0 ,0 );
                direction4 = true;
            }
        }
    }
    
    if (rotMove4) {
        if(directionB4) {
            aniObject4.rotation.z += 0.005;
        } else if (!directionB4) {
            aniObject4.rotation.z -= 0.005;
        }
        if(aniObject4.rotation.z >= 3.14159 || aniObject4.rotation.z <= -3.14159) {
            rotMove4 = false;
            direction4 = false;
            lineMove4 = true;
        }
    }
    
}

// stage 5

function stage5(depthOffset) {
    const voidBox = new WireframeGeometry2( geo );

	let voidLine = new LineMaterial( {

		color: 0x6f03a8,
        linewidth: 2, // in pixels
        opacity: .9,
        dashed: false,
        transparent: true

    } );

    voidFrame = new Wireframe( voidBox, voidLine );
    voidFrame.computeLineDistances();
    voidFrame.position.set(0,0,0+depthOffset);
    scene.add( voidFrame );
}

function props5(depthOffset) {
    let newLight = new THREE.DirectionalLight( 0xffffff, 3 );
    newLight.position.set ( 0, 1000, 0 );
    newLight.target = voidFrame;
    scene.add( newLight.target );
}

function animation5() {
    if (direction5) {
        voidFrame.scale.y -= 0.0005;
        voidFrame.scale.x -= 0.0005;
        voidFrame.scale.z -= 0.0005;
        if (voidFrame.scale.y < .9) {
            direction5 = false;
        }
    } else if (!direction5) {
        voidFrame.scale.y += 0.0005;
        voidFrame.scale.x += 0.0005;
        voidFrame.scale.z += 0.0005;
        if (voidFrame.scale.y > 1) {
            direction5 = true;
        }
    }
    
}

// shuffle algo

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

// degrees to radians
// 90 = 1.5708
// 180 = 3.14159

//equation = Deg × π/180 = Rad