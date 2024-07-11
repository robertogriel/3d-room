
let camera, scene, renderer, controls;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let isMouseCaptured = false;


let verticalVelocity = 0;
const gravity = 0.1;


const mouseSensitivity = 0.0009;
const rotateDampingFactor = 0.9;
let rotateSpeedY = 0;


const initialHeight = 25;


function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);


    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, initialHeight, 0);


    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);


    const floorTexture = new THREE.TextureLoader().load('textures/floor.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);


    const wallTexture = new THREE.TextureLoader().load('textures/wall.jpg');
    const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });
    const wallGeometry = new THREE.BoxGeometry(1000, 200, 20);


    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 100, -500);
    scene.add(wall1);


    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.position.set(0, 100, 500);
    scene.add(wall2);


    const wall3 = new THREE.Mesh(new THREE.BoxGeometry(20, 200, 1000), wallMaterial);
    wall3.position.set(-500, 100, 0);
    scene.add(wall3);


    const wall4 = new THREE.Mesh(new THREE.BoxGeometry(20, 200, 1000), wallMaterial);
    wall4.position.set(500, 100, 0);
    scene.add(wall4);


    const pointBTexture = new THREE.TextureLoader().load('textures/pointB.png');
    const pointBMaterial = new THREE.MeshBasicMaterial({ map: pointBTexture, transparent: true });
    const pointBGeometry = new THREE.BoxGeometry(20, 20, 20);
    const pointB = new THREE.Mesh(pointBGeometry, pointBMaterial);
    pointB.position.set(50, 10, 0);
    scene.add(pointB);


    const skyTexture = new THREE.TextureLoader().load('textures/sky.jpg');
    const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture, side: THREE.DoubleSide });
    const skyGeometry = new THREE.PlaneGeometry(1000, 1000);
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.set(0, 200, 0);
    sky.rotation.x = Math.PI / 2;
    scene.add(sky);


    controls = new THREE.PointerLockControls(camera, document.body);
    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    function startMouseCapture() {
        controls.lock();
        isMouseCaptured = true;
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    }


    scene.add(controls.getObject());


    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);


    renderer.domElement.addEventListener('click', startMouseCapture);


    animate();
}


function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);


    if (controls !== undefined && controls.update !== undefined && isMouseCaptured) {
        controls.update();
    }


    if (isMouseCaptured) {
        const movementX = controls.getMoveX();
        const movementY = controls.getMoveY();


        controls.getObject().rotation.y -= movementX * mouseSensitivity;


        rotateSpeedY -= movementY * mouseSensitivity * 10;
        rotateSpeedY *= 1 - rotateDampingFactor;


        camera.rotation.x += rotateSpeedY;


        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
    }


    verticalVelocity -= gravity;
    camera.position.y += verticalVelocity;


    if (camera.position.y < initialHeight) {
        camera.position.y = initialHeight;
        verticalVelocity = 0;
    }


    const moveSpeed = 2;


    let moveDirection = new THREE.Vector3();
    if (moveForward) moveDirection.z = -1;
    if (moveBackward) moveDirection.z = 1;
    if (moveLeft) moveDirection.x = -1;
    if (moveRight) moveDirection.x = 1;

    moveDirection.applyQuaternion(camera.quaternion);
    moveDirection.normalize();


    camera.position.add(moveDirection.multiplyScalar(moveSpeed));


    renderer.render(scene, camera);
}


window.addEventListener('load', init);
