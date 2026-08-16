// تحميل خامات ماين كرافت (Textures) للمكعبات
const textureLoader = new THREE.TextureLoader();

// استدعاء خامات Minecraft مجانية وعالية الجودة
const textures = {
  dirt: textureLoader.load('https://raw.githubusercontent.com/InventorG/Minecraft-Textures/master/dirt.png'),
  grassTop: textureLoader.load('https://raw.githubusercontent.com/InventorG/Minecraft-Textures/master/grass_top.png'),
  grassSide: textureLoader.load('https://raw.githubusercontent.com/InventorG/Minecraft-Textures/master/grass_side.png'),
  stone: textureLoader.load('https://raw.githubusercontent.com/InventorG/Minecraft-Textures/master/stone.png'),
  wood: textureLoader.load('https://raw.githubusercontent.com/InventorG/Minecraft-Textures/master/plank.png')
};

// إعداد خامات مكعب العشب (Grass Block Materials)
const grassMaterials = [
  new THREE.MeshBasicMaterial({ map: textures.grassSide }), // Right
  new THREE.MeshBasicMaterial({ map: textures.grassSide }), // Left
  new THREE.MeshBasicMaterial({ map: textures.grassTop }),  // Top
  new THREE.MeshBasicMaterial({ map: textures.dirt }),      // Bottom
  new THREE.MeshBasicMaterial({ map: textures.grassSide }), // Front
  new THREE.MeshBasicMaterial({ map: textures.grassSide })  // Back
];

const dirtMaterial = new THREE.MeshBasicMaterial({ map: textures.dirt });
const stoneMaterial = new THREE.MeshBasicMaterial({ map: textures.stone });
const woodMaterial = new THREE.MeshBasicMaterial({ map: textures.wood });
