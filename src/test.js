import * as THREE from 'three';
import { dotScreen } from 'three/addons/DotScreenPass.js';
import { rgbShift } from 'three/addons/OrbitControls.js';

let camera, renderer, postProcessing;
let object;
