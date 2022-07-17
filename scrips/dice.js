
const diceElement = document.getElementById('dice');
export const faces = {
    front: {
        normal: {x: 0, y: 0, z: -1}
    },
    back: {
        normal: {x: 0, y: 0, z: 1}
    },
    top: {
        normal: {x: 0, y: 1, z: 0}
    },
    bottom: {
        normal: {x: 0, y: -1, z: 0}
    },
    left: {
        normal: {x: 1, y: 0, z: 0}
    },
    right: {
        normal: {x: -1, y: 0, z: 0}
    },

};
for (const faceName of ['front', 'back', 'left', 'right', 'top', 'bottom']) {
    faces[faceName].element = $(diceElement).find(`.${faceName}`)[0];
}

const ROTATION_STEP = Math.PI / 2;

window.addEventListener('keydown', event => {
    triggerFrontFaceListener(event.key);
});

export function rollUp () {
    rotateDice('x', ROTATION_STEP);
}

export function rollDown () {
    rotateDice('x', -ROTATION_STEP);
}

export function rollRight () {
    rotateDice('y', ROTATION_STEP);
}

export function rollLeft () {
    rotateDice('y', -ROTATION_STEP);
}

function rotateDice (axis, angle) {
    let transform = diceElement.style.getPropertyValue('transform');
    transform = `rotate${axis.toUpperCase()}(${angle}rad) ${transform}`;
    diceElement.style.setProperty('transform', transform);
    rotateAllNormals(axis, angle);
}

/**
 * Returns the vector rotated.
 * @param {{x: number, y: number, z: number}} vector 
 * @param {string} axis 
 * @param {number} angle 
 */
 function rotateVector (vector ,axis , angle) {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;
    let rotated = {x: 0, y: 0, z: 0};
    switch (axis) {
        case 'x':
            rotated = {
                x: x,
                y: y * Math.cos(angle) - z * Math.sin(angle),
                z: y * Math.sin(angle) + z * Math.cos(angle)
            };
            break;
        case 'y':
            rotated = {
                x: x * Math.cos(angle) + z * Math.sin(angle),
                y: y,
                z: z * Math.cos(angle) - x * Math.sin(angle)
            };
            break;
        case 'z':
            rotated = {
                x: x * Math.cos(angle) - y * Math.sin(angle),
                y: x * Math.sin(angle) + y * Math.cos(angle),
                z: z
            };
            break;
    }
    for (const [key, value] of Object.entries(rotated)) {
        if (Math.abs(value) < 1)
            rotated[key] = 0;
    }

    return rotated;
}

/**
 * Rotates all the normals of all the faces
 * @param {string} axis 
 * @param {number} angle 
 */
 function rotateAllNormals (axis, angle) {
    for (const face of Object.values(faces)) {
        face.normal = rotateVector(face.normal, axis, angle);
    }
}

/**
 * Replaces the content of the face facing the direction relative to the camera
 * @param {string} direction front, back, left, right, top or bottom 
 * @param {{
 *  element: Element,
 *  eventListener: function 
 * }} content 
 */
export function setFacingFaceContent (direction, content) {
    const face = facingFace(direction);
    face.element.innerHTML = '';
    face.element.appendChild(content.element);
    face.eventListener = content.eventListener;
}

/**
 * Replaces the content of the face facing the direction relative to the camera.
 * Then, rotates to that face.
 * @param {string} direction up, down, left or right
 * @param {{
 *  element: Element,
 *  eventListener: function 
 * }} content 
 */
export function setFacingFaceContentAndRoll (direction, content) {
    let faceDirection = 'back';
    switch (direction) {
        case 'up':
            faceDirection = 'bottom';
            break;
        case 'down':
            faceDirection = 'top';
            break;
        case 'left':
            faceDirection = 'left';
            break;
        case 'right':
            faceDirection = 'right';
            break;
    }

    setFacingFaceContent(faceDirection, content);
    switch (direction) {
        case 'up':
            rollUp();
            break;
        case 'down':
            rollDown();
            break;
        case 'left':
            rollLeft();
            break;
        case 'right':
            rollRight();
            break;
    }
}

/**
 * Returns the face facing the direction relative to the camera.
 * @param {string} direction 
 */
function facingFace (direction) {
    switch (direction) {
        case 'front':
            return Object.values(faces).find(f => f.normal.z == -1);
        case 'back':
            return Object.values(faces).find(f => f.normal.z == 1);
        case 'left':
            return Object.values(faces).find(f => f.normal.x == -1);
        case 'right':
            return Object.values(faces).find(f => f.normal.x == 1);
        case 'top':
            return Object.values(faces).find(f => f.normal.y == 1);
        case 'bottom':
            return Object.values(faces).find(f => f.normal.y == -1);
    }
}

function triggerFrontFaceListener (key) {
    const face = facingFace('front');
    face.eventListener(key);
}

window.rollUp = rollUp;
window.rollDown = rollDown;
window.rollLeft = rollLeft;
window.rollRight = rollRight;
window.faces = faces;