'use strict';

let scene = document.getElementById('scene');
let camera = document.getElementById('camera-holder');
let logo = document.getElementById('logo');

let containerInfo = document.getElementById('container-info');
let namespaceInfo = document.getElementById('namespace-info');
let podInfo = document.getElementById('pod-info');

let inContainer = false;
let exitButton = undefined;
let selectedBoat = undefined;
let selectedContainer = undefined;

// Spots on the boat where a container can be placed.
const CONTAINER_POSITIONS = [{ x: -8, y: -2.4 }, { x: 0.8, y: -2.4 }, { x: 9.6, y: -2.4 }, { x: 18.4, y: -2.4 }, { x: -8, y: 2.4 }, { x: 0.8, y: 2.4 }, { x: 9.6, y: 2.4 }, { x: 18.4, y: 2.4 }, { x: -24, y: -2.4 }, { x: -24, y: 2.4 }];

// Color code for all container types.
const CONTAINER_COLORS = {
    'Services': '#E6303C',
    'Replication controllers': '#3266C9',
    'Daemon sets': '#EAF2F5',
    'Replica sets': '#54B5BB',
    'Stateful sets': '#637627',
    'Deployments': '#F6B966',
    'System containers': '#89646B'
};

// find the app to get data from.
let url = new URL(location);
let api = new MockApi(url.searchParams.get('app'), Number(url.searchParams.get('cpu')), Number(url.searchParams.get('memory')));

api.fetchServerGroups().then(result => {
    let root = ServerGroup.getRoot();
    if (root === undefined) {
        throw 'This is not a Kubernetes/Openshift environment.';
    }

    logo.setAttribute('class', 'clickable'); // The raycaster needs to update for the logo to become clickable, this happens implicitly when we spawn the namespaces.
    logo.setAttribute('spin', true);

    let namespaces = root.namespaces.slice(-6); // Limit to 6 namespaces.
    for (let i = 0; i < namespaces.length; i++) {
        let boat = spawnBoat(namespaces[i], i / namespaces.length * 2);
        scene.appendChild(boat);
    }
}).catch(e => log('(╯°□°）╯︵ ┻━┻', e));

/**
 * Draws a namespace.
 * @param {*} namespace The namespace that this boat represents.
 * @param {*} angle The angle of the boat.
 */
function spawnBoat(namespace, angle) {
    let boat = document.createElement('a-entity');

    if (namespace.type === 'coscale') {
        boat.setAttribute('flag', 'logo: img/coscale.png');
        boat.setAttribute('change-color', 'from: Red; to: #fbbc1d');
    } else {
        boat.setAttribute('flag', '');
    }

    boat.setAttribute('float', '');
    boat.setAttribute('id', namespace.type);
    boat.setAttribute('json-model', 'src: #boat');
    boat.setAttribute('position', 50 * Math.sin(Math.PI * angle) + ' -3 ' + 50 * Math.cos(Math.PI * angle));
    boat.setAttribute('rotation', '0 ' + (180 * angle + Math.random() * 40 - 20) + ' 0');
    boat.setAttribute('hover', 'enter: showNamespaceInfo');
    boat.setAttribute('click', 'function: handleBoat');
    boat.setAttribute('class', 'clickable');
    boat.data = namespace;

    let groups = namespace.groups.reduce((all, current) => {
        if (current !== null) {
            return all.concat(current);
        }
        return all;
    }, []).slice(-50); // Limit to 50 groups.

    for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        let pos = CONTAINER_POSITIONS[i % CONTAINER_POSITIONS.length];
        let y = 3.4 + 4 * Math.floor(i / CONTAINER_POSITIONS.length);

        let container = document.createElement('a-entity');
        container.setAttribute('json-model', 'src: #container');
        container.setAttribute('change-color', 'from: Red; to: ' + CONTAINER_COLORS[group.parent.type]);
        container.setAttribute('position', [pos.x + Math.random() * 0.5 - 0.25, y, pos.y + Math.random() * 0.5 - 0.25].join(' '));
        container.setAttribute('rotation', [0, Math.random() * 8 - 4, 0].join(' '));
        container.setAttribute('class', 'clickable');
        container.data = group;

        boat.appendChild(container);
    }

    return boat;
}

/**
 * Spawns the pods inside a container.
 * @param {*} container a-entity representing a servergroup that holds pods.
 */
function populateContainer(container) {
    let pods = container.data.serverGroups.slice(-21); // Limit to 21 pods.
    let entities = [];
    for (let i = 0; i < pods.length; i++) {
        let pod = pods[i];

        let entity = document.createElement('a-entity');
        entity.setAttribute('json-model', 'src: #pod');
        entity.setAttribute('hover', 'enter: showContainerInfo');
        entity.setAttribute('class', 'clickable');
        entity.setAttribute('position', [3 - Math.floor(i / 3), 0.5, 1 - i % 3].join(' '));
        entity.data = pod;

        container.appendChild(entity);
        entities.push(entity);
    }

    fetchPodData(entities);
    container.appendChild(createExit());
}

/**
 * Fetches cpu and memory metrics for the given pods.
 * @param {*} pods The pod html objects.
 */
function fetchPodData(pods) {
    api.fetchPodData(pods).then(json => {
        let podMap = new Map();
        pods.map(pod => podMap.set(pod.data.id, pod));

        for (let metric of json) {
            let subjectSpec = new SubjectSpec(metric.s);
            let pod = podMap.get(Number(subjectSpec.serverGroups_[0]));

            if (pod !== undefined) {
                switch (metric.m) {
                    case api.memoryMetric:
                        pod.memory = metric.calc[0];
                        break;
                    case api.cpuMetric:
                        pod.cpu = metric.calc[0];
                        break;
                }
            }
        }

        // Update the label
        if (containerInfo !== undefined && containerInfo.container !== undefined) {
            containerInfo.setAttribute('memory', containerInfo.container.memory);
            containerInfo.setAttribute('cpu', containerInfo.container.cpu);
        }
    }).catch(e => log('¯\\_(ツ)_/¯', e));
}

function teleport(object, distance, height) {
    let pos = new THREE.Vector3();
    let dir = new THREE.Vector3();
    object.updateMatrixWorld();
    pos.setFromMatrixPosition(object.matrixWorld);

    dir.subVectors(pos, camera.object3D.position);
    dir.y = 0;
    dir.normalize().multiplyScalar(distance);

    pos.x -= dir.x;
    pos.y += height;
    pos.z -= dir.z;

    camera.setAttribute('move-to', 'to: ' + [pos.x, pos.y, pos.z].join(' '));
}

function handleBoat(e, el) {
    if (inContainer === true) {
        return;
    }

    if (selectedBoat !== el) {
        cleanupBoat();
        cleanupContainer();

        selectedBoat = el;
        for (let container of el.children) {
            container.setAttribute('click', 'function: handleContainer');
            container.setAttribute('hover', 'enter: showPodInfo');
        }

        teleport(el.object3D, 15, 10);
        showNamespaceInfo();
        showPodInfo();
        showContainerInfo();
    } else {
        teleport(el.object3D, -15, 10);
    }
}

function handleContainer(e, el) {
    if (inContainer === true) {
        return;
    }

    if (selectedContainer !== el && el.parentNode === selectedBoat) {
        // Prevent also performing the handle boat action.
        if (e !== undefined) {
            e.stopPropagation();
        }

        cleanupContainer();

        selectedContainer = el;
        inContainer = true;

        populateContainer(selectedContainer);
        selectedBoat.setAttribute('rotation', [0, selectedBoat.getAttribute('rotation').y, 0].join(' '));
        teleport(el.object3D, 0, -5);

        // Make the containers no longer clickable.
        for (let container of selectedBoat.children) {
            container.removeAttribute('click');
            container.removeAttribute('hover');
        }

        showNamespaceInfo();
        showPodInfo();
        showContainerInfo();
    }
}

function handleTux(e, el) {
    if (inContainer === true) {
        return;
    }

    cleanupBoat();
    cleanupContainer();

    teleport(el.object3D, 3, 3);
}

function cleanupBoat() {
    if (selectedBoat !== undefined) {
        for (let container of selectedBoat.children) {
            container.removeAttribute('click');
            container.removeAttribute('hover');
        }
    }

    selectedBoat = undefined;
}

function cleanupContainer() {
    if (selectedContainer !== undefined) {
        for (let el of selectedContainer.children) {
            selectedContainer.remove(el);
        }
    }
    selectedContainer = undefined;
}

function exit(e, el) {
    inContainer = false;
    handleBoat(undefined, selectedBoat);

    showNamespaceInfo();
    showPodInfo();
    showContainerInfo();
}

/**
 * Creates a button to exit a container.
 * There can only be one exit button at a time.
 */
function createExit() {
    if (exitButton !== undefined) {
        exitButton.parentNode.remove(exitButton);
    }

    exitButton = document.createElement('a-entity');
    exitButton.setAttribute('geometry', 'primitive: plane; height: 1; width: 1');
    exitButton.setAttribute('material', 'shader: flat; src: #exit');
    exitButton.setAttribute('position', '-3.59 2 0'); // -3.59 because of z-fighting
    exitButton.setAttribute('rotation', '0 90 0');
    exitButton.setAttribute('click', 'scaleOnHover: true; function: exit');

    return exitButton;
}

/**
 * Shows info for a 'container' (actually a pod)
 * @param {*} e
 * @param {*} container
 */
function showContainerInfo(e, container) {
    if (containerInfo !== undefined) {
        if (container === null || container === undefined) {
            containerInfo.setAttribute('visible', false);
            return;
        }

        let vector = new THREE.Vector3();
        container.object3D.updateMatrixWorld();
        vector.setFromMatrixPosition(container.object3D.matrixWorld);
        vector.add(new THREE.Vector3(0, 1, 0));

        containerInfo.container = container;
        containerInfo.setAttribute('visible', true);
        containerInfo.setAttribute('memory', container.memory);
        containerInfo.setAttribute('cpu', container.cpu);
        containerInfo.setAttribute('name', container.data.type);
        containerInfo.setAttribute('position', vector);
        containerInfo.setAttribute('billboard-scale', 3);
    } else {
        log('Missing element to display container info!');
    }
}

/**
 * Shows info for a namespace
 * @param {*} e
 * @param {*} namespace
 */
function showNamespaceInfo(e, namespace) {
    if (namespaceInfo !== undefined) {
        if (namespace === null || namespace === undefined || namespace === selectedBoat) {
            namespaceInfo.setAttribute('visible', false);
            return;
        }

        let vector = new THREE.Vector3();
        namespace.object3D.updateMatrixWorld();
        vector.setFromMatrixPosition(namespace.object3D.matrixWorld);
        vector.add(new THREE.Vector3(0, 1, 0));

        namespaceInfo.setAttribute('visible', true);
        namespaceInfo.setAttribute('groups', namespace.data.groups.filter(group => {
            return group !== null && group.length > 0;
        }).map(group => {
            return group[0].parent.type + ':' + group.length;
        }).join(','));
        namespaceInfo.setAttribute('name', namespace.data.type);
        namespaceInfo.setAttribute('position', vector);
        namespaceInfo.setAttribute('billboard-scale', 3);
    } else {
        log('Missing element to display namespace info!');
    }
}

/**
 * Shows info for a group of pods.
 * @param {*} e
 * @param {*} pod
 */
function showPodInfo(e, pod) {
    if (podInfo !== undefined) {
        if (pod === null || pod === undefined || pod.parentNode !== selectedBoat || inContainer === true) {
            podInfo.setAttribute('visible', false);
            return;
        }

        let vector = new THREE.Vector3();
        pod.object3D.updateMatrixWorld();
        vector.setFromMatrixPosition(pod.object3D.matrixWorld);
        vector.add(new THREE.Vector3(0, 1, 0));

        podInfo.setAttribute('visible', true);
        podInfo.setAttribute('containers', pod.data.serverGroups.length);
        podInfo.setAttribute('name', pod.data.type);
        podInfo.setAttribute('position', vector);
        podInfo.setAttribute('billboard-scale', 3);
    } else {
        log('Missing element to display pod info!');
    }
}