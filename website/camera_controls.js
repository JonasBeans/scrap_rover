async function move_camera_up() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=up',
    });
}

async function move_camera_down() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=down',
    });
}

async function move_camera_left() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=left',
    });
}

async function move_camera_right() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=right',
    });
}

document.getElementById('button_up').addEventListener('click', move_camera_up);
document.getElementById('button_down').addEventListener('click', move_camera_down)
document.getElementById('button_left').addEventListener('click', move_camera_left)
document.getElementById('button_right').addEventListener('click', move_camera_right)

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': move_camera_up(); break;
        case 'ArrowDown': move_camera_down(); break;
        case 'ArrowLeft': move_camera_left(); break;
        case 'ArrowRight': move_camera_right(); break;
    }
})