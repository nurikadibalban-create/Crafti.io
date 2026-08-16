/* =========================================================
   CRAFTFUN CONTROLS & CONTROLLER (SCRIPT.JS UPDATE)
   ========================================================= */

// 1. إعدادات الحركة والتحكم
let keys = {};
let isFlying = false;
let cameraMode = '1st'; // '1st' أو '3rd' (رؤية الشخصية)
const moveSpeed = 0.15;

// استماع لأزرار الكيبورد
window.addEventListener('keydown', (e) => {
  keys[e.code] = true;

  // زر E لفتح الشنطة (Inventory)
  if (e.code === 'KeyE') {
    toggleInventory();
  }

  // زر F للتنقل بين المشي والطيران (Fly)
  if (e.code === 'KeyF') {
    isFlying = !isFlying;
    console.log('Flying Mode:', isFlying);
  }

  // زر F5 لرؤية جسم الشخصية (منظور شخص ثالث 3D)
  if (e.code === 'F5') {
    e.preventDefault();
    toggleCameraView();
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

// 2. دالة المشي والطيران (تضاف داخل دالة التحديث animate)
function updatePlayerMovement() {
  if (keys['KeyW']) camera.translateZ(-moveSpeed);
  if (keys['KeyS']) camera.translateZ(moveSpeed);
  if (keys['KeyA']) camera.translateX(-moveSpeed);
  if (keys['KeyD']) camera.translateX(moveSpeed);

  // الطيران أو القفز (Space للارتفاع، Shift للهبوط)
  if (keys['Space']) {
    if (isFlying) camera.position.y += moveSpeed;
    else camera.position.y += 0.1; // قفز عادي
  }
  if (keys['ShiftLeft'] && isFlying) camera.position.y -= moveSpeed;
}

// 3. البناء والكسر باستخدام الماوس
window.addEventListener('mousedown', (e) => {
  // استخدام Raycaster لتحديد المكعب المستهدف
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const hit = intersects[0];

    if (e.button === 0) {
      // كليك يسار: محو / كسر البلوكة
      scene.remove(hit.object);
    } else if (e.button === 2) {
      // كليك يمين: وضع / إضافة بلوكة
      const newBlock = new THREE.Mesh(hit.object.geometry, hit.object.material);
      newBlock.position.copy(hit.point).add(hit.face.normal.clone().multiplyScalar(0.5));
      newBlock.position.x = Math.round(newBlock.position.x);
      newBlock.position.y = Math.round(newBlock.position.y);
      newBlock.position.z = Math.round(newBlock.position.z);
      scene.add(newBlock);
    }
  }
});

// 4. تغيير منظور الكاميرا (F5) لرؤية الجسم
function toggleCameraView() {
  if (cameraMode === '1st') {
    cameraMode = '3rd';
    camera.position.z += 4;
    camera.position.y += 2;
  } else {
    cameraMode = '1st';
    camera.position.z -= 4;
    camera.position.y -= 2;
  }
}

// 5. فتح وإغلاق الشنطة (E)
function toggleInventory() {
  let inv = document.getElementById('inventory-menu');
  if (!inv) {
    inv = document.createElement('div');
    inv.id = 'inventory-menu';
    inv.style.position = 'fixed';
    inv.style.top = '50%';
    inv.style.left = '50%';
    inv.style.transform = 'translate(-50%, -50%)';
    inv.style.background = 'rgba(0,0,0,0.85)';
    inv.style.color = '#fff';
    inv.style.padding = '20px';
    inv.style.borderRadius = '10px';
    inv.innerHTML = '<h3>الشنطة (Inventory)</h3><p>اضغط E للإغلاق</p>';
    document.body.appendChild(inv);
  } else {
    inv.style.display = inv.style.display === 'none' ? 'block' : 'none';
  }
}
