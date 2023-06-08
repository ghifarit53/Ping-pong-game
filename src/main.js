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

camera.position.set(8,3,0);

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

const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.y = 3;
  light.position.z = 1;
  light.castShadow = true;
  scene.add(light);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const ground = new Entity.Box({
    width: 20,
    height: 0.5,
    depth: 50,
    color: '#0369a1',
    position: {
      x: 0,
      y: -1,
      z: 0
    }
  });
  ground.receiveShadow = true;
  scene.add(ground);

const blueBox = new Entity.Box({
    width: 2,
    height: 0.3,
    depth : 0.3,
    position: {
        x: 0,
        y: 0,
        z: 2
    }
});
blueBox.receiveShadow = true;
scene.add(blueBox);

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
        blueBox.velocity.y = 0.08
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

function animate() {
    const animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);

    updateBullets();
    blueBox.velocity.x = 0
    blueBox.velocity.z = 0
    if (keys.a.pressed) blueBox.velocity.z = 0.05 * speedModifier
    else if (keys.d.pressed) blueBox.velocity.z = -0.05 * speedModifier

    if (keys.s.pressed) blueBox.velocity.x = 0.05 * speedModifier
    else if (keys.w.pressed) blueBox.velocity.x = -0.05 * speedModifier

    if (keys.shift.pressed) {
        blueBox.material.color.set('#f41173');
        blueBox.scale.set(0.75,0.75,0.75);
        speedModifier = 0.6;
    }
    else {
        blueBox.material.color.set('#00ff00');
        blueBox.scale.set(1,1,1);
        speedModifier = 1.25;
    }

    blueBox.update(ground)
    
}


//create pattern, then after delay remove pattern
//pattern updates in animate
//setInterval must be higher than setTimeout
function animateProjectiles() {
  let rng = Math.random() * (10 - (-10)) + (-10);
    let flowery = Patterns.circularPatternV2(
        scene,
        {
            x: rng,
            z: 5
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
    }, 4000);
}

function updateBullets() {
    if(enemies.length !== 0) {
      enemies.forEach(enemy => {
        enemy.update();
      });
    }
}

/*
more patterns = slower
need a way to clear bullets
  1. by timer -> bullets will disappear after a certain amount of time
  2. by out of bounds -> if out of bounds, then delete
*/
setInterval(animateProjectiles, 3200);
setInterval(animateProjectiles, 3250);
setInterval(animateProjectiles, 3500);
setInterval(animateProjectiles, 3500);
setInterval(animateProjectiles, 3600);

animate();
