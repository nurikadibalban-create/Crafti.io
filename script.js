const container = document.getElementById('canvas-container');
const invModal = document.getElementById('inventory');
const invGrid = document.getElementById('invGrid');

let scene, camera, renderer, raycaster;
let blocks = [];
let keys = {};
let yaw = 0, pitch = 0;
let isPointerLocked = false;
let isGameRunning = false;

const baseUrl = 'https://raw.githubusercontent.com/InventivetalentDev/minecraft-assets/1.19/assets/minecraft/textures/block/';

// مكتبة جميع بلوكات ماينكرافت وماين فاين
const itemsList = [
    { name: 'Grass', tex: baseUrl + 'grass_block_top.png' },
    { name: 'Dirt', tex: baseUrl + 'dirt.png' },
    { name: 'Coarse Dirt', tex: baseUrl + 'coarse_dirt.png' },
    { name: 'Stone', tex: baseUrl + 'stone.png' },
    { name: 'Smooth Stone', tex: baseUrl + 'smooth_stone.png' },
    { name: 'Cobblestone', tex: baseUrl + 'cobblestone.png' },
    { name: 'Mossy Cobble', tex: baseUrl + 'mossy_cobblestone.png' },
    { name: 'Oak Planks', tex: baseUrl + 'oak_planks.png' },
    { name: 'Spruce Planks', tex: baseUrl + 'spruce_planks.png' },
    { name: 'Birch Planks', tex: baseUrl + 'birch_planks.png' },
    { name: 'Oak Log', tex: baseUrl + 'oak_log.png' },
    { name: 'Bedrock', tex: baseUrl + 'bedrock.png' },
    { name: 'Sand', tex: baseUrl + 'sand.png' },
    { name: 'Red Sand', tex: baseUrl + 'red_sand.png' },
    { name: 'Gravel', tex: baseUrl + 'gravel.png' },
    { name: 'Bricks', tex: baseUrl + 'bricks.png' },
    { name: 'Stone Bricks', tex: baseUrl + 'stone_bricks.png' },
    { name: 'Nether Bricks', tex: baseUrl + 'nether_bricks.png' },
    { name: 'Glass', tex: baseUrl + 'glass.png' },
    { name: 'Crafting Table', tex: baseUrl + 'crafting_table_front.png' },
    { name: 'Furnace', tex: baseUrl + 'furnace_front.png' },
    { name: 'Chest', tex: baseUrl + 'chest_front.png' },
    { name: 'TNT', tex: baseUrl + 'tnt_side.png' },
    { name: 'Bookshelf', tex: baseUrl + 'bookshelf.png' },
    { name: 'Obsidian', tex: baseUrl + 'obsidian.png' },
    { name: 'Coal Ore', tex: baseUrl + 'coal_ore.png' },
    { name: 'Iron Ore', tex: baseUrl + 'iron_ore.png' },
    { name: 'Gold Ore', tex: baseUrl + 'gold_ore.png' },
    { name: 'Diamond Ore', tex: baseUrl + 'diamond_ore.png' },
    { name: 'Emerald Ore', tex: baseUrl + 'emerald_ore.png' },
    { name: 'Lapis Ore', tex: baseUrl + 'lapis_ore.png' },
    { name: 'Redstone Ore', tex: baseUrl + 'redstone_ore.png' },
    { name: 'Coal Block', tex: baseUrl + 'coal_block.png' },
    { name: 'Iron Block', tex: baseUrl + 'iron_block.png' },
    { name: 'Gold Block', tex: baseUrl + 'gold_block.png' },
    { name: 'Diamond Block', tex: baseUrl + 'diamond_block.png' },
    { name: 'Emerald Block', tex: baseUrl + 'emerald_block.png' },
    { name: 'Lapis Block', tex: baseUrl + 'lapis_block.png' },
    { name: 'Oak Leaves', tex: baseUrl + 'oak_leaves.png' },
    { name: 'Sponge', tex: baseUrl + 'sponge.png' }
];

let selectedItem = itemsList[0];

// تعبئة الشنطة
itemsList.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'inv-item';
    div.innerHTML = `<img src="${item.tex}"><span>${item.name}</span>`;
    div.onclick = () => {
        selectedItem = item;
        invModal.style.display = 'none';
        container.requestPointerLock();
    };
    invGrid.appendChild(div);
});

function enterWorld() {
    document.getElementById('lobbyScreen').style.display = 'none';
    document.getElementById('crosshair').style.display = 'block';
    document.getElementById('ui-overlay').style.display = 'block';
    document.getElementById('exitBtn').style.display = 'block';

    if (!isGameRunning) {
        initGameEngine();
        isGameRunning = true;
    }
    container.requestPointerLock();
}

function returnToLobby() {
    document.exitPointerLock();
    document.getElementById('lobbyScreen').style.display = 'flex';
    document.getElementById('crosshair').style.display = 'none';
    document.getElementById('ui-overlay').style.display = 'none';
    document.getElementById('exitBtn').style.display = 'none';
    invModal.style.display = 'none';
}

function initGameEngine() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x78a7ff);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // بناء أرضية البداية
    for(let x = -7; x <= 7; x++) {
        for(let z = -7; z <= 7; z++) {
            createBlock(x, 0, z, itemsList[0]);
        }
    }

    camera.position.set(0, 3, 5);

    container.addEventListener('click', () => {
        if (invModal.style.display !== 'block' && document.getElementById('lobbyScreen').style.display === 'none') {
            container.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isPointerLocked = (document.pointerLockElement === container);
    });

    // تحريك الماوس والرؤية
    document.addEventListener('mousemove', (e) => {
        if (!isPointerLocked) return;
        yaw -= e.movementX * 0.0025;
        pitch -= e.movementY * 0.0025;
        pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
    });

    // التحكم بالأزرار (WASD, Shift, Space, C, E)
    document.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (e.code === 'KeyE' && isGameRunning) {
            if (invModal.style.display === 'block') {
                invModal.style.display = 'none';
                container.requestPointerLock();
            } else {
                invModal.style.display = 'block';
                document.exitPointerLock();
            }
        }
    });

    document.addEventListener('keyup', (e) => { keys[e.code] = false; });

    // بناء وتكسير البلوكات بالماوس
    window.addEventListener('mousedown', (e) => {
        if (!isPointerLocked) return;
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const intersects = raycaster.intersectObjects(blocks);

        if (intersects.length > 0) {
            const hit = intersects[0];
            if (e.button === 0) { // زر الماوس الأيسر = تكسير
                scene.remove(hit.object);
                blocks = blocks.filter(b => b !== hit.object);
            } else if (e.button === 2) { // زر الماوس الأيمن = بناء
                const pos = hit.point.add(hit.face.normal.clone().multiplyScalar(0.5));
                createBlock(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z), selectedItem);
            }
        }
    });

    window.addEventListener('contextmenu', e => e.preventDefault());
    animate();
}

// دالة إنشاء البلوك بالتكستشر المخصص
function createBlock(x, y, z, item) {
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(item.tex);
    texture.magFilter = THREE.NearestFilter; // الحفاظ على دقة Pixel Art

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const boxMat = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(boxGeo, boxMat);
    cube.position.set(x, y, z);

    scene.add(cube);
    blocks.push(cube);
}

// تحديث الحركة مع كل إطار (Loop)
function animate() {
    requestAnimationFrame(animate);
    if (isPointerLocked) {
        const speed = keys['ShiftLeft'] || keys['ShiftRight'] ? 0.22 : 0.1;
        const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        const side = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

        if (keys['KeyW']) camera.position.addScaledVector(dir, speed);
        if (keys['KeyS']) camera.position.addScaledVector(dir, -speed);
        if (keys['KeyD']) camera.position.addScaledVector(side, speed);
        if (keys['KeyA']) camera.position.addScaledVector(side, -speed);
        if (keys['Space']) camera.position.y += speed; // صعود
        if (keys['KeyC']) camera.position.y -= speed; // نزول أسفل
    }
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});
