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

function handleMotor(axes) {
    // axes[7] = R2 button axis
    // R2 axis ranges from 0 (not pressed) to 1 (fully pressed)
    const r2Value = axes[7];
    
    fetch('/motor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed: r2Value })
    });
}

let lastMotorSpeed = null;

function controlLoop() {
    if (controllerIndex !== null) {
        const gamepad = navigator.getGamepads()[controllerIndex];
        handleSticks(gamepad.axes);

        const r2Value = Math.round(gamepad.axes[7] * 100) / 100;

        if (r2Value !== lastMotorSpeed) {
            lastMotorSpeed = r2Value;
            handleMotor(gamepad.axes);
        }
    }
    requestAnimationFrame(controlLoop);
}

controlLoop();
