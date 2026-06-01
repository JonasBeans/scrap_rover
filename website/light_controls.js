function enable_light() {
    fetch('/switch/light', { method: 'POST' })
}

document.getElementById('enable_pulsating_light').addEventListener('click', enable_light);
