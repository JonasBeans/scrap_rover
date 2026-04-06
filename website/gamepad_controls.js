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

function handleSticks(axis) {
    let x = axis[0];
    let y = axis[1];

    console.log(x)
    console.log(y)

    if (isBetween(x, 1, 0.97) && (isBetween(y, 0.5, -0.5))) {
        console.log("moved right...")
        move_camera_right();
    }

    else if (isBetween(x, -0.97, -1) && (isBetween(y, 0.5, -0.5))) {
        console.log("moved left...")
        move_camera_left();
    }

    else if (isBetween(y, 1, 0.97) && (isBetween(x, 0.5, -0.5))) {
        console.log("moved up...")
        move_camera_down();
    }

    else if (isBetween(y, -0.97, -1) && (isBetween(x, 0.5, -0.5))) {
        console.log("moved down...")
        move_camera_up();
    }

}

function controlLoop() {
    if (controllerIndex !== null) {
        const gamepad=   navigator.getGamepads()[controllerIndex];
        handleSticks(gamepad.axes);
    }
    requestAnimationFrame(controlLoop);
}

controlLoop();
