const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function move_camera_up() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=up',
    });

    await delay(2000);
}

export async function move_camera_down() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=down',
    });

    await delay(2000);
}

export async function move_camera_left() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=left',
    });

    await delay(2000);
}

export async function move_camera_right() {
    const response = await fetch("http://192.168.0.155:5000/ptz", {
        method: "POST",
        body: 'move=right',
    });

    await delay(2000)
}
