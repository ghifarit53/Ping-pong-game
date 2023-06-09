/*
Things that can be done :
1. Life system
2. Scoring
3. Multiple characters
4. More patterns
5. Borders for player
6. Backgrounds
7. More complex shapes
8. Music
9. Shoot the boss
10. Powerups
11. Camera that follows the player
*/


import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import  { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as Patterns from './patternspawner.js'
import * as Entity from './entities.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/ window.innerHeight,
    0.1,
    1000
)


camera.position.set(10,15,0);

const renderer = new THREE.WebGLRenderer(
    {
        alpha: true,
        antialias: true
    }
);

renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
const light = new THREE.DirectionalLight(0x121212, 1);
light.castShadow = true;

// Set up shadow properties for the light
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;

// Set the position and target of the light
light.position.set(0, 10, 0);
light.target.position.set(0, 0, 0);
scene.add(light);
scene.add(light.target);

// // skybox
// const textureLoadersky = new THREE.TextureLoader();

// const frontTexture = textureLoadersky.load('assets/field.jpg');
// const backTexture = textureLoadersky.load('assets/field.jpg');
// const topTexture = textureLoadersky.load('assets/field.jpg');
// const bottomTexture = textureLoadersky.load('assets/field.jpg');
// const leftTexture = textureLoadersky.load('assets/field.jpg');
// const rightTexture = textureLoadersky.load('assets/field.jpg');
// const materials = [
//   new THREE.MeshBasicMaterial({ map: rightTexture }),   // Right face
//   new THREE.MeshBasicMaterial({ map: leftTexture }),    // Left face
//   new THREE.MeshBasicMaterial({ map: topTexture }),     // Top face
//   new THREE.MeshBasicMaterial({ map: bottomTexture }),  // Bottom face
//   new THREE.MeshBasicMaterial({ map: backTexture }),    // Back face
//   new THREE.MeshBasicMaterial({ map: frontTexture })    // Front face
// ];
// const geometrysky = new THREE.BoxGeometry(100, 100, 100);
// const skybox = new THREE.Mesh(geometry, materials);
// skybox.scale.set(-1, 1, 1);
// scene.add(skybox);


// const light = new THREE.DirectionalLight(0x121212, 1);
//   light.position.y = 3;
//   light.position.z = 8;
//   light.castShadow = true;
//   scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('assets/field.jpg');
  
  const material = new THREE.MeshStandardMaterial({ map: texture, shadowSide: THREE.FrontSide });
  
  const geometry = new THREE.BoxGeometry(31, 0.5, 23);
  const ground = new THREE.Mesh(geometry, material);
  ground.position.set(0, -1, 0);
  ground.rotation.y = Math.PI / 2; // Rotate 90 degrees (π/2 radians)
  ground.receiveShadow = true;
  scene.add(ground);
  

//   const textureLoader = new THREE.TextureLoader();
//   const texture = textureLoader.load('assets/field.png');
//   const material = new THREE.MeshStandardMaterial({ map: texture });
//   const geometry = new THREE.BoxGeometry(1, 1, 1);
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);


// const ground = new Entity.Box({
//     width: 20,
//     height: 0.5,
//     depth: 50,
//     color: '#0369a1',
//     position: {
//       x: 0,
//       y: -1,
//       z: 0
//     }
//   });
//   ground.receiveShadow = true;
//   scene.add(ground);

const loader = new GLTFLoader();
let ball;
loader.load('assets/scene.gltf', function (gltf) {
  ball = gltf.scene;

  // You can manipulate the loaded model here if needed
  ball.position.y = -0.5;
  scene.add(ball);
});


const player = new Entity.Box({
    width: 8,
    height: 1,
    depth : 1,
    position: {
        x: 0,
        y: 0,
        z: 10
    }
});
player.receiveShadow = true;
player.castShadow = true;
scene.add(player);

const enemy = new Entity.Box({
  width: 8,
  height: 1,
  depth : 1,
  position: {
      x: 0,
      y: 0,
      z: -10
  }
});
enemy.receiveShadow = true;
enemy.castShadow = true;
scene.add(enemy);

const enemies = [];

const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false
    },
    s: {
      pressed: false
    },
    w: {
      pressed: false
    },
    shift: {
        pressed: false
    }
  }

  window.addEventListener('keydown', (event) => {
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = true
        break
      case 'KeyD':
        keys.d.pressed = true
        break
      case 'KeyS':
        keys.s.pressed = true
        break
      case 'KeyW':
        keys.w.pressed = true
        break
      case 'Space':
        player.velocity.y = 0.08
        break
      case 'ShiftLeft':
        keys.shift.pressed = true
        break
    }
  })

  window.addEventListener('keyup', (event) => {
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = false
        break
      case 'KeyD':
        keys.d.pressed = false
        break
      case 'KeyS':
        keys.s.pressed = false
        break
      case 'KeyW':
        keys.w.pressed = false
        break
      case 'ShiftLeft':
        keys.shift.pressed = false
        break
    }
  })

let speedModifier = 1;
let vb_x = 0;
let vb_z = 0.2;

function animate() {
    const animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    updateCollision();
    updateBullets();
    check_player_boundary();
    ball.position.z += vb_z;
    ball.position.x += vb_x;

    player.velocity.x = 0
    player.velocity.z = 0
    if (keys.a.pressed) player.velocity.z = 0.3 * speedModifier
    else if (keys.d.pressed) player.velocity.z = -0.3 * speedModifier
    
    if (keys.s.pressed) player.velocity.x = 0.3 * speedModifier
    else if (keys.w.pressed) player.velocity.x = -0.3 * speedModifier
    
    if (keys.shift.pressed) {
      player.material.color.set('#f41173');
      player.scale.set(0.75,0.75,0.75);
      speedModifier = 0.6;
    }
    else {
      player.material.color.set('#00ff00');
      player.scale.set(1,1,1);
      speedModifier = 1.25;
    }
    
    enemy.position.x += enemy.position.x < ball.position.x ? 0.3 : -0.3;
    enemy.update(ground);
    player.update(ground);
    
}

function check_player_boundary() {
    if (camera.position.y<0) camera.position.y = 0;
    if (player.position.x > 6)player.position.x=6;
    if (player.position.x < -6)player.position.x=-6;
    if (player.position.z < 0)player.position.z=0;
    if (player.position.z > 12)player.position.z=12;
    if(ball.position.x>9 || ball.position.x<-9){
      ball.position.x= ball.position.x>0 ? 9 : -9;
      if(vb_x>0.5) {
        vb_x *= -0.7;
      } else {
        vb_x *= -1;
      }    
    }
    if(ball.position.z>12 || ball.position.z<-12){
      ball.position.z= ball.position.z>0 ? 12 : -12;
      if(vb_z>0.5) {
        vb_z *= -0.7;
      } else {
        vb_z *= -1;
      }
    }

    const box1 = new THREE.Box3().setFromObject(player);
    const box2 = new THREE.Box3().setFromObject(ball);
    if(box1.intersectsBox(box2))  {
      vb_z *= -1;
      if(player.velocity.x!=0) {
        vb_x += player.velocity.x/4;
        // if(player.velocity.x<0&&vb_x<0||player.velocity.x>0&&vb_x>0) vb_x*=-0.5;

      } 
      if(player.velocity.z!=0) {
        vb_z = player.velocity.z + -vb_z/4;
        if(player.velocity.z>0&&vb_z>0||player.velocity.z>0&&vb_z>0) vb_z*=-0.5;
      } 
    }

    const box3 = new THREE.Box3().setFromObject(enemy);
    if(box3.intersectsBox(box2)){
      if(vb_z>0.5) {
        vb_z *= -0.8;
      } else {
        vb_z *= -1;
      }      
    }

    if(vb_z>1.5) vb_z = 1.5;
    if(vb_z<-1.5) vb_z = -1.5;
    if(vb_x>1.5) vb_x = 1.5;
    if(vb_x<-1.5) vb_x = -1.5;  
}

function isPlayerColide(box1, box2) {
  const posCollisionX = box1.right >= box2.left && box1.left <= box2.right;
  const posCollisionY = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
  const posCollisionZ = box1.front >= box2.back && box1.back <= box2.front;

  return posCollisionX && posCollisionY && posCollisionZ;
}


//create pattern, then after delay remove pattern
//pattern updates in animate
//setInterval must be higher than setTimeout
function animateProjectiles() {
  let rng = Math.random() * (10 - (-10)) + (-10);
    let flowery = Patterns.circularPatternV2(
        scene,
        {
            x: 0,
            z: 15
        });
    enemies.push(...flowery);
    
    setTimeout(() => {
        if (flowery !== null) {
            flowery.forEach((object) => {
                scene.remove(object);
    
                object.geometry.dispose();
                object.material.dispose();
                });
                enemies.filter(element => !flowery.includes(element));
                flowery = null;
        }
    }, 40000);
}

function updateBullets() {
    if(enemies.length !== 0) {
      enemies.forEach(enemy => {
        enemy.update();
      });
    }
}

function updateCollision(){
  enemies.forEach(enemy => {
    let collision = Entity.boxCollision(player,enemy);
    if(collision && !enemy.collided){
      console.log("hit");
      enemy.velocity.z = enemy.velocity.z * -1;
      enemy.collided = true;

      if(player.velocity.x!=0) {
        enemy.velocity.x += player.velocity.x/2;
      }
    }
    else if(!collision) {
      enemy.collided = false;
    }
    if(enemy.position.x>9 || enemy.position.x<-9){
      enemy.position.x= enemy.position.x>0 ? 9 : -9;
      enemy.velocity.x *= -1;
    }
    if(enemy.position.z>12 || enemy.position.z<-12){
      enemy.position.z= enemy.position.z>0 ? 12 : -12;
      enemy.velocity.z *= -1;
    }
    })
}

/*
more patterns = slower
need a way to clear bullets
  1. by timer -> bullets will disappear after a certain amount of time
  2. by out of bounds -> if out of bounds, then delete
*/
// setInterval(animateProjectiles, 3200);

// animateProjectiles();
animate();
