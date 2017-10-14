'use strict';

// Function for drawing circular tubes (used by the CoScale logo).
function Circle(angle, length, clockwise) {
    THREE.Curve.call(this);

    this.angle = angle;
    this.length = length;
    this.clockwise = clockwise;
}
Circle.prototype = Object.create(THREE.Curve.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.getPoint = function (t) {
    let a = this.angle + this.length * t * (this.clockwise ? -1 : 1);
    return new THREE.Vector3(Math.cos(a), Math.sin(a), 0);
};

// The coscale logo in 3D, can be used as a loader.
AFRAME.registerComponent('coscale-logo', {
    schema: {
        spin: { type: 'boolean', default: false },
        closed: { type: 'boolean', default: false }
    },
    init: function () {
        this.spinState = 0;

        let gold = new THREE.MeshBasicMaterial({ color: 0xfbbc1d });
        let white = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 });
        let blue = new THREE.MeshBasicMaterial({ color: 0x183648 });
        let outside = new THREE.MeshBasicMaterial({ color: 0xECECEC, side: THREE.BackSide });

        let backGeometry = new THREE.CylinderBufferGeometry(2.5, 2.5, 0.1, 32);
        this.backMesh = new THREE.Mesh(backGeometry, blue);
        this.backMesh.position.set(0, 1.5, -1);
        this.backMesh.rotation.set(Math.PI / 2, 0, 0);

        let innerCircle = new Circle(Math.PI / 2, Math.PI * 3 / 2, true, 1);
        let innerGeometry = new THREE.TubeBufferGeometry(innerCircle, 20, 0.1);
        this.innerMesh = new THREE.Mesh(innerGeometry, gold);
        this.innerMesh.position.set(0, 1.5, 0);

        let leftOuterCircle = new Circle(Math.PI / 2, Math.PI / 2, true, 1.5);
        let leftOuterGeometry = new THREE.TubeBufferGeometry(leftOuterCircle, 10, 0.1);
        this.leftOuterMesh = new THREE.Mesh(leftOuterGeometry, gold);
        this.leftOuterMesh.position.set(0, 1.5, 0);
        this.leftOuterMesh.scale.setScalar(1.5);

        let rightOuterCircle = new Circle(Math.PI * 3 / 2, Math.PI / 2, true, 1.5);
        let rightOuterGeometry = new THREE.TubeBufferGeometry(rightOuterCircle, 10, 0.1);
        this.rightOuterMesh = new THREE.Mesh(rightOuterGeometry, gold);
        this.rightOuterMesh.position.set(0, 1.5, 0);
        this.rightOuterMesh.scale.setScalar(1.5);

        let sphereGeometry = new THREE.SphereBufferGeometry(8);
        this.sphereMesh = new THREE.Mesh(sphereGeometry, outside);

        this.el.setObject3D('backMesh', this.backMesh);
        this.el.setObject3D('innerMesh', this.innerMesh);
        this.el.setObject3D('leftOuterMesh', this.leftOuterMesh);
        this.el.setObject3D('rightOuterMesh', this.rightOuterMesh);
        this.el.setObject3D('sphereMesh', this.sphereMesh);

        new THREE.FontLoader().load('models/font.json', font => {
            let geometry = new THREE.TextGeometry('C', {
                font: font,
                size: 1.2,
                height: 0.1,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelSegments: 0
            });
            geometry.center();

            this.textMesh = new THREE.Mesh(geometry, white);
            this.textMesh.position.set(0, 1.5, 0);
            this.el.setObject3D('textMesh', this.textMesh);
        });

        if (this.data.spin === true) {
            this.spin();
        } else if (this.data.closed === true) {
            this.leftOuterMesh.scale.setScalar(1);
            this.leftOuterMesh.rotation.z = Math.PI / 2;
            this.rightOuterMesh.scale.setScalar(1);
            this.rightOuterMesh.rotation.z = Math.PI / 2;
        }
    },
    update: function (oldData) {
        if (oldData.spin !== undefined && oldData.spin !== this.data.spin) {
            this.data.spin === true ? this.spin() : this.stopSpin();
        }
    },
    remove: function () {
        this.el.removeObject3D('backMesh');
        this.el.removeObject3D('innerMesh');
        this.el.removeObject3D('leftOuterMesh');
        this.el.removeObject3D('rightOuterMesh');
        this.el.removeObject3D('sphereMesh');

        if (this.textMesh !== undefined) {
            this.el.removeObject3D('textMesh');
        }
    }, tick: function (t, dt) {
        // Wait a bit to start the animation.
        if (t < 500) {
            return;
        }

        if (this.data.spin === true) {
            switch (this.spinState) {
                case 0:
                    let scale = this.leftOuterMesh.scale.x + dt / 500;
                    if (scale >= 1.5) {
                        this.spinState = 1;
                        scale = 1.5;
                    }

                    this.leftOuterMesh.scale.setScalar(scale);
                    this.rightOuterMesh.scale.setScalar(scale);
                    break;
                case 1:
                    let rotation = this.leftOuterMesh.rotation.z - dt / 200;
                    if (rotation <= 0) {
                        rotation = 0;
                        this.spinState = 2;
                    }

                    this.leftOuterMesh.rotation.z = rotation;
                    this.rightOuterMesh.rotation.z = rotation;
                    break;
                case 2:
                    if (this.textMesh !== undefined) {
                        this.textMesh.rotation.y -= 0.003 * dt;
                    }
                    break;
            }
        }
    }, spin: function () {
        this.data.spin = true;
        this.spinState = 0;

        this.leftOuterMesh.scale.setScalar(1);
        this.leftOuterMesh.rotation.z = Math.PI / 2;
        this.rightOuterMesh.scale.setScalar(1);
        this.rightOuterMesh.rotation.z = Math.PI / 2;
    }, stopSpin: function () {
        this.data.spin = false;

        this.leftOuterMesh.scale.setScalar(1.5);
        this.leftOuterMesh.rotation.z = 0;
        this.rightOuterMesh.scale.setScalar(1.5);
        this.rightOuterMesh.rotation.z = 0;
        if (this.textMesh !== undefined) {
            this.textMesh.rotation.y = 0;
        }
    }
});

AFRAME.registerPrimitive('coscale-logo', {
    defaultComponents: {
        'coscale-logo': {}
    },
    mappings: {
        spin: 'coscale-logo.spin',
        closed: 'coscale-logo.closed'
    }
});

// Simple component to remove the element when it is clicked.
AFRAME.registerComponent('dismiss', {
    init: function () {
        this.el.addEventListener('click', () => {
            this.el.parentNode.removeChild(this.el);
        });
    }
});

// Makes the element a floaty.
AFRAME.registerComponent('float', {
    schema: {
        amplitude: { type: 'number', default: 2 },
        speed: { type: 'number', default: 1 }
    },
    init: function () {
        this.offset = Math.random();
    },
    tick: function (t, dt) {
        if (typeof inContainer !== 'undefined' && inContainer === false) {
            let rotationTmp = this.rotationTmp || { x: 0, y: 0, z: 0 };
            let rotation = this.el.getAttribute('rotation');
            let a = Math.sin(this.offset + t / 1000) * this.data.amplitude;
            rotationTmp.x = a;
            rotationTmp.y = rotation.y;
            rotationTmp.z = a;
            this.el.setAttribute('rotation', rotationTmp);
        }
    }
});

// Adds a flag.
AFRAME.registerComponent('flag', {
    schema: {
        logo: { type: 'string', default: 'img/kubernetes.png' }
    },
    init: function () {
        this.pole = new THREE.Mesh(new THREE.BoxBufferGeometry(0.1, 12, 0.1), new THREE.MeshBasicMaterial({ color: 0x8b4513 }));
        this.pole.position.set(-16, 12, 4);

        let loader = new THREE.TextureLoader();
        loader.load(this.data.logo, texture => {
            this.flag.material.color.set(0xffffff);
            this.flag.material.map = texture;
            this.flag.material.needsUpdate = true;
        });

        this.flag = new THREE.Mesh(new THREE.PlaneBufferGeometry(4, 4), new THREE.MeshBasicMaterial({ color: 0x183648, side: THREE.DoubleSide }));

        this.flag.position.set(0, 4, 0);
        this.flag.geometry.translate(2, 0, 0); // change pivot
        this.flag.rotation.set(0, Math.PI, 0);
        this.pole.add(this.flag);
        this.el.setObject3D('flag', this.pole);
    },
    remove: function () {
        this.el.removeObject3D('flag');
    }
});

// Change the color of a json model material to a different color.
AFRAME.registerComponent('change-color', {
    dependencies: ['json-model'],
    schema: {
        from: { type: 'string' },
        to: { type: 'color' }
    },
    init: function () {
        this.el.addEventListener('model-loaded', e => {
            if (e.detail.target == this.el) {
                this.change(e.detail.model);
            }
        });
    }, update: function () {
        this.change(this.el.components['json-model'].model);
    }, change: function (model) {
        if (model !== null && model !== undefined) {
            let materials = model.material.materials;
            for (let mat of materials) {
                if (mat.name === this.data.from) {
                    mat.color.setStyle(this.data.to);
                    break;
                }
            }
        }
    }
});

// Executes a function when the element is clicked.
AFRAME.registerComponent('click', {
    schema: {
        function: { type: 'string' },
        scaleOnHover: { type: 'boolean', default: false }
    }, init: function () {
        this.el.addEventListener('click', e => {
            window[this.data.function](e, this.el);
        });

        if (this.data.scaleOnHover === true) {
            this.el.addEventListener('mouseenter', e => {
                this.el.setAttribute('scale', '1.1 1.1 1.1');
            });
            this.el.addEventListener('mouseleave', e => {
                this.el.setAttribute('scale', '1 1 1');
            });
        }
    }
});

// Executes a function when the element is hovered.
AFRAME.registerComponent('hover', {
    schema: {
        enter: { type: 'string' },
        leave: { type: 'string' }
    }, init: function () {
        if (this.data.enter !== '') {
            this.el.addEventListener('mouseenter', e => {
                window[this.data.enter](e, this.el);
            });
        }

        if (this.data.leave !== '') {
            this.el.addEventListener('mouseleave', e => {
                window[this.data.leave](e, this.el);
            });
        }
    }
});

// Moves the element to the position.
AFRAME.registerComponent('move-to', {
    schema: {
        to: { type: 'vec3' },
        time: { type: 'number', default: 1000 }
    }, init: function () {
        this.tween();
    }, update: function (oldData) {
        if (oldData.to !== this.data.to) {
            this.tween();
        }
    }, tween: function () {
        let pos = Object.assign({}, this.el.components.position.data);
        let tween = new TWEEN.Tween(pos).to(this.data.to, this.data.time).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => {
            this.el.setAttribute('position', pos);
        }).start();
    }
});

// Billboard similar to https://github.com/blairmacintyre/aframe-look-at-billboard-component
AFRAME.registerComponent('billboard', {
    schema: {
        scale: { type: 'number', default: -1 },
        lockX: { type: 'boolean', default: false }
    },
    init: function () {
        this.vector = new THREE.Vector3();
    },

    tick: function (t) {
        let target = this.el.sceneEl.camera;
        let object3D = this.el.object3D;
        let x = object3D.rotation.x;

        if (target) {
            target.updateMatrixWorld();
            this.vector.setFromMatrixPosition(target.matrixWorld);
            if (object3D.parent) {
                object3D.parent.updateMatrixWorld();
                object3D.parent.worldToLocal(this.vector);
            }
            object3D.lookAt(this.vector);

            if (this.data.lockX === true) {
                object3D.rotation.x = x;
            }

            if (this.data.scale > 0) {
                let scale = this.vector.subVectors(object3D.position, this.vector).length() / this.data.scale;
                object3D.scale.set(scale, scale, 1);
            }
        }
    }
});

// Draws a panel for a container.
AFRAME.registerComponent('container-info', {
    schema: {
        name: { type: 'string' },
        cpu: { type: 'number' },
        memory: { type: 'number' }
    },
    init: function () {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 512;
        this.canvas.height = 256;
        this.canvas.imageSmoothingEnabled = false;

        this.texture = new THREE.Texture(this.canvas);
        this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 1), new THREE.MeshBasicMaterial({ depthTest: false, fog: false, opacity: 1, transparent: true, map: this.texture }));

        this.el.setObject3D('panel', this.panel);
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'Bold 40px Helvetica';
        let y = wrapText(this.ctx, this.data.name, 6, 40, 500, 40);

        if (isNaN(this.data.cpu) === false) {
            drawSegmentBar(this.ctx, 50, y + 20, this.data.cpu);
            this.ctx.drawImage(document.getElementById('cpu'), 10, y + 20, 32, 32);
        }

        if (isNaN(this.data.memory) === false) {
            drawSegmentBar(this.ctx, 50, y + 90, this.data.memory, true);
            this.ctx.drawImage(document.getElementById('memory'), 10, y + 90, 32, 32);
        }

        this.texture.needsUpdate = true;
    }
});

AFRAME.registerPrimitive('container-info', {
    defaultComponents: {
        'container-info': {},
        'billboard': {}
    },
    mappings: {
        cpu: 'container-info.cpu',
        memory: 'container-info.memory',
        name: 'container-info.name',
        'billboard-scale': 'billboard.scale'
    }
});

// Draws a panel for a namespace.
AFRAME.registerComponent('namespace-info', {
    schema: {
        name: { type: 'string' },
        groups: {
            default: '',
            parse: function (value) {
                let parsed = {};
                if (typeof value === 'string' && value !== '') {
                    for (let part of value.split(',')) {
                        let pair = part.split(':');
                        parsed[pair[0].trim()] = pair[1].trim();
                    }
                }
                return parsed;
            }
        }
    },
    init: function () {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 512;
        this.canvas.height = 256;
        this.canvas.imageSmoothingEnabled = false;

        this.texture = new THREE.Texture(this.canvas);
        this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 1), new THREE.MeshBasicMaterial({ depthTest: false, fog: false, opacity: 1, transparent: true, map: this.texture }));

        this.el.setObject3D('panel', this.panel);
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'Bold 40px Helvetica';
        let y = wrapText(this.ctx, 'SS ' + this.data.name, 6, 40, 500, 40);

        for (let type in this.data.groups) {
            this.ctx.fillStyle = CONTAINER_COLORS[type];
            this.ctx.fillRect(6, y + 20, 20, 30);

            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(this.data.groups[type] + ' ' + type, 35, y + 50);
            y += 40;
        }

        this.texture.needsUpdate = true;
    }
});

AFRAME.registerPrimitive('namespace-info', {
    defaultComponents: {
        'namespace-info': {},
        'billboard': {}
    },
    mappings: {
        groups: 'namespace-info.groups',
        name: 'namespace-info.name',
        'billboard-scale': 'billboard.scale'
    }
});

// Draws a panel for a group of pods.
AFRAME.registerComponent('pod-info', {
    schema: {
        name: { type: 'string' },
        containers: { type: 'number' }
    },
    init: function () {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = 512;
        this.canvas.height = 256;
        this.canvas.imageSmoothingEnabled = false;

        this.texture = new THREE.Texture(this.canvas);
        this.panel = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 1), new THREE.MeshBasicMaterial({ depthTest: false, fog: false, opacity: 1, transparent: true, map: this.texture }));

        this.el.setObject3D('panel', this.panel);
    },
    update: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(50, 50, 50, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'Bold 40px Helvetica';
        let y = wrapText(this.ctx, this.data.name, 6, 40, 500, 40);
        wrapText(this.ctx, this.data.containers + ' container' + (this.data.containers !== 1 ? 's' : ''), 6, y + 40, 500, 40);

        this.texture.needsUpdate = true;
    }
});

AFRAME.registerPrimitive('pod-info', {
    defaultComponents: {
        'pod-info': {},
        'billboard': {}
    },
    mappings: {
        containers: 'pod-info.containers',
        name: 'pod-info.name',
        'billboard-scale': 'billboard.scale'
    }
});

/**
 * Draws a bar made out of segments.
 * @param {*} ctx The context
 * @param {*} x x
 * @param {*} y y
 * @param {*} value Percentage of the bar
 * @param {*} invert Invert the colors?
 */
function drawSegmentBar(ctx, x, y, value, invert) {
    ctx.fillStyle = '#fff';
    ctx.fillText(Math.round(value * 100) / 100 + '%', x + 310, y + 30);

    for (let i = 0; i < value / 10; i++) {
        ctx.fillStyle = blendColors('#00ff00', '#ff0000', invert === true ? 1 - i / 10 : 1 / 10);
        ctx.fillRect(x + 2 + i * 30, y + 2, 28, 30);
    }
}

/**
 * Lerps from c0 to c1 by p.
 * @param {*} c0 The color if p = 0
 * @param {*} c1 The color if p = 1
 * @param {*} p [0 - 1]
 */
function blendColors(c0, c1, p) {
    let f = parseInt(c0.slice(1), 16),
        t = parseInt(c1.slice(1), 16),
        R1 = f >> 16,
        G1 = f >> 8 & 0x00FF,
        B1 = f & 0x0000FF,
        R2 = t >> 16,
        G2 = t >> 8 & 0x00FF,
        B2 = t & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((R2 - R1) * p) + R1) * 0x10000 + (Math.round((G2 - G1) * p) + G1) * 0x100 + (Math.round((B2 - B1) * p) + B1)).toString(16).slice(1);
}

/**
 * Draws text on the canvas and splits it if it's too wide.
 * @param {*} ctx The context
 * @param {*} text The text to draw
 * @param {*} x x
 * @param {*} y y
 * @param {*} maxWidth The max width
 * @param {*} lineHeight The line height of the font
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    let parts = text.split(/([ -\/])/);
    let line = '';
    for (let part of parts) {
        if (ctx.measureText(line + part).width > maxWidth) {
            ctx.fillText(line, x, y);
            line = part;
            y += lineHeight;
        } else {
            line += part;
        }
    }

    if (line !== '') {
        ctx.fillText(line, x, y);
    }

    return y;
}