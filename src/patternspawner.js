/*
objects
patterns
    movement
    rotations
    velocity
*/


import { ArcCurve } from 'three';
import * as Entity from './entities.js';


//0.01 for default
//turn rng off for default circle
export function circularPattern(scene, position) {
    const enemies = [];
    let initRadius = 0.5;
    
    const curve = new ArcCurve(
        position.x,
        position.z,
        initRadius,
        0,
        2 * Math.PI,
        true
    );

    let point = curve.getPoint(0);

    for(let i = 0; i < 1; i += 0.005 * Math.PI) {
        point = curve.getPoint(i);

        let rng = Math.random() * (10 - 1) + 1;
        rng = 1;

        let x = point.x * Math.cos(i * Math.PI * rng) * initRadius;
        let y = point.y * Math.sin(i * Math.PI * rng) * initRadius;

        let signX = Math.sign(point.x);
        let signY = Math.sign(point.y);

        const box = new Entity.Box(
            {
                width: 0.2,
                height: 0.2,
                depth : 0.2,
                color: '#b405ff',
                position: {
                    x: point.x,
                    y: 0,
                    z: point.y
                },
                velocity: {
                    x: 0.05 * signX * x * Math.PI * 2,
                    z: 0.05 * signY * y * 0.7
                }
            });
        box.receiveShadow = true;
        scene.add(box);
        enemies.push(box);
    }
    return enemies;
}



/*
manipulations :
angle
position
velocity -> circle uses sine and cosine
    note : a separate variable creates a delay that lags 1 value back from the iterator when added
increment in for loop = bullet density, smaller = more bullets
*/
export function circularPatternV2(scene, position){
    const enemies = [];
    let initRadius = 0.5;
    
    let angle = 0;

    for(let i = 0; i < 1; i += 0.005 * Math.PI) {

        let x = Math.cos(angle) + initRadius * position.x;
        let y = Math.sin(angle) + initRadius * position.z;
        

        const box = new Entity.Box(
            {
                width: 0.2,
                height: 0.2,
                depth : 0.2,
                color: '#b405ff',
                position: {
                    x: x,
                    y: 0,
                    z: y - 8
                },
                velocity: {
                    x: 0.05 * Math.cos(angle),
                    z: 0.05 * Math.sin(angle)
                }
            });
        box.receiveShadow = true;
        scene.add(box);
        enemies.push(box);
        angle+=i;
    }
    return enemies;
}