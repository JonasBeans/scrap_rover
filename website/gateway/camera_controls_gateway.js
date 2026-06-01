export async function move_camera_up() {
    const response = await fetch("http://192.168.1.100:5000/ptz", {
        method: "POST",
        body: 'move=up',
    });
}

export async function move_camera_down() {
    const response = await fetch("http://192.168.1.100:5000/ptz", {
        method: "POST",
        body: 'move=down',
    });
}

export async function move_camera_left() {
    const response = await fetch("http://192.168.1.100:5000/ptz", {
        method: "POST",
        body: 'move=left',
    });
}

export async function move_camera_right() {
    const response = await fetch("http://192.168.1.100:5000/ptz", {
        method: "POST",
        body: 'move=right',
    });
}
