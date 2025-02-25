import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

import { type Keys } from './types';
import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { World } from './world';

export class App {
    lastTime = performance.now();
    lag = 0;
    sPerUpdate: number;
    htmlElements = {
        container: document.querySelector('body') as HTMLElement,
        canvas: document.querySelector('canvas.webgl') as HTMLCanvasElement,
        pauseBtn: document.querySelector('#pauseBtn') as HTMLElement,
        resetBtn: document.querySelector('#resetBtn') as HTMLElement,
        loadingScreen: document.querySelector('.loadingScreen') as HTMLElement,
        loadingBar: document.querySelector('.bar') as HTMLElement,
    };
    keys: Keys = { keydown: false, keyup: false };
    running: boolean;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    controls: OrbitControls;
    composer: EffectComposer;
    models = new Map<string, GLTF>();
    world: World;

    constructor(sPerUpdate = 1 / 25) {
        this.sPerUpdate = sPerUpdate;

        window.addEventListener('keydown', this.processEvents.bind(this));
        window.addEventListener('keyup', this.processEvents.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('dblclick', this.toggleFullscreen.bind(this));

        this.htmlElements.pauseBtn.addEventListener('click', this.togglePause.bind(this));
        this.htmlElements.resetBtn.addEventListener('click', this.reset.bind(this));

        this.renderer = new THREE.WebGLRenderer({ canvas: this.htmlElements.canvas, antialias: true });
        this.renderer.setClearColor(0x131a29);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.camera = new THREE.PerspectiveCamera(71, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.y = 100;
        this.camera.position.z = 80;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.maxDistance = 1500;

        this.scene = new THREE.Scene();

        const renderScene = new RenderPass(this.scene, this.camera);
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);

        const loadingManager = new THREE.LoadingManager();
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
            this.htmlElements.loadingBar.style.width = `${percent}%`;

            if (percent === 100) {
                this.htmlElements.loadingScreen.style.opacity = '0';
                this.htmlElements.loadingScreen.addEventListener('transitionend', () => {
                    this.htmlElements.loadingScreen.style.zIndex = '-1';
                });
            }
        };
        loadingManager.onLoad = this.init.bind(this);

        const gltfLoader = new GLTFLoader(loadingManager);
        gltfLoader.load('assets/models/spaceship.glb', gltf => this.models.set('spaceship', gltf));
        gltfLoader.load('assets/models/station.glb', gltf => this.models.set('station', gltf));
    }

    init() {
        this.world = new World({ renderer: this.renderer, scene: this.scene, models: this.models });
        this.running = true;
    }

    reset() {
        this.camera.position.y = 400;
        this.camera.position.z = 800;
    }

    run() {
        if (this.running) {
            const now = performance.now();
            let delta = (now - this.lastTime) / 1000;
            if (delta > 0.25) delta = 0.25;
            this.lastTime = now;
            this.lag += delta;

            while (this.lag >= this.sPerUpdate) {
                this.update(this.sPerUpdate);
                this.lag -= this.sPerUpdate;
            }
        }

        this.render(this.lag / this.sPerUpdate, this.sPerUpdate);
        requestAnimationFrame(this.run.bind(this));
    }

    processEvents(event: KeyboardEvent) {
        this.keys['keydown'] = event.type === 'keydown';
        this.keys['keyup'] = event.type === 'keyup';
        this.keys[event.code] = event.type === 'keydown';

        if (this.keys.keydown) {
            if (this.keys.KeyP) this.togglePause();
            if (this.keys.KeyR) this.reset();
        }
    }

    update(dt: number) {
        this.world.update(dt);
    }

    render(alpha: number, dt: number) {
        if (this.running) {
            this.world.render(alpha, dt);
        }

        this.controls.update();
        this.composer.render();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    togglePause() {
        this.running = !this.running;
        this.lastTime = performance.now();
        this.htmlElements.pauseBtn.innerText = this.running ? 'Pause' : 'Resume';
    }

    toggleFullscreen() {
        !document.fullscreenElement ? this.htmlElements.container.requestFullscreen() : document.exitFullscreen();
    }
}
