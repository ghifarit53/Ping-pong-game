import * as THREE from 'three';

export class Box extends THREE.Mesh {

    constructor(
        {
            width,
            height,
            depth,
            color = '#00ff00',
            velocity = {
                x : 0,
                y : 0,
                z : 0
            },
            position = {
                x : 0,
                y : 0,
                z : 0
            },
            zAccel = false
        }) {
           super(
                new THREE.BoxGeometry(width,height,depth),
                new THREE.MeshStandardMaterial({color})
           );
           
            this.width = width;
            this.height = height;
            this.depth = depth;

            this.position.set(position.x, position.y, position.z);
            
            this.right = this.position.x + this.width / 2;
            this.left = this.position.x - this.width / 2;

            this.bottom = this.position.y - this.height / 2;
            this.top = this.position.y + this.height / 2;

            this.front = this.position.z + this.depth / 2;
            this.back = this.position.z - this.depth / 2;

            this.velocity = velocity;
            this.gravity = -0.002;

            this.zAccel = zAccel;
        }
    
    updateSides() {
        
        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }

    update() {
        this.updateSides();
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
    }
}