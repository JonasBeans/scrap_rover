const pc = new RTCPeerConnection();

async function startStream() {
    const stream = new MediaStream();
    const videoEl = document.getElementById('stream');
    videoEl.srcObject = stream;

    pc.addEventListener('track', (event) => {
        console.log('track fired!', event.track.kind);
        stream.addTrack(event.track);
        videoEl.play().catch(e => console.error(e));
    });

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const response = await fetch('http://192.168.1.100:8889/scrap_rover_cam/whep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp,
    });

    const answerSdp = await response.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    // Manually add tracks in case ontrack already fired
    console.log('receivers after setRemoteDescription:');
    pc.getReceivers().forEach(r => {
        console.log('adding track manually:', r.track.kind);
        stream.addTrack(r.track);
    });

    videoEl.play().catch(e => console.error('play error:', e));
}

startStream();
