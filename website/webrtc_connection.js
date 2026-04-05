async function startStream() {
    const pc = new RTCPeerConnection();

    pc.ontrack = (event) => {
        document.getElementById('stream').srcObject = event.streams[0];
    };

    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const response = await fetch('http://scraprover.local:8889/scrap_rover_cam/whep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp,
    });

    const answerSdp = await response.text();
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
}

startStream();
