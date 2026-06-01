import {move_camera_up, move_camera_right, move_camera_down, move_camera_left} from './gateway/camera_controls_gateway.js'

let controllerIndex = null;

window.addEventListener('gamepadconnected', (event) => {
    const gamepad = event.gamepad;
    controllerIndex = gamepad.index;
    console.log(gamepad)
})

function isBetween(axis, max, min) {
    return axis <= max && axis >= min;
}

function handleSticks(axes) {
    let x = axes[0];
    let y = axes[1];

    if (isBetween(x, 1, 0.97) && (isBetween(y, 0.5, -0.5))) {
        move_camera_right();
    }
    else if (isBetween(x, -0.97, -1) && (isBetween(y, 0.5, -0.5))) {
        move_camera_left();
    }
    else if (isBetween(y, 1, 0.97) && (isBetween(x, 0.5, -0.5))) {
        move_camera_down();
    }
    else if (isBetween(y, -0.97, -1) && (isBetween(x, 0.5, -0.5))) {
        move_camera_up();
    }
}

function handleLightStick(axes) {
    // axes[2] = right stick X, axes[3] = right stick Y
    // Gamepad Y axis: -1 = up (full brightness), 1 = down (off)
    // Remap from [-1, 1] to [1, 0]
    const rawY = axes[3];
    const brightness = (1 - rawY) / 2;

    fetch('/light', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: brightness })
    });
}

let lastBrightness = null;

function controlLoop() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleSticks(gamepad.axes);

        const rawY = gamepad.axes[3];
        const brightness = Math.round((1 - rawY) / 2 * 100) / 100;

        if (brightness !== lastBrightness) {
            lastBrightness = brightness;
            handleLightStick(gamepad.axes);
        }
    }
    requestAnimationFrame(controlLoop);
}

controlLoop();
