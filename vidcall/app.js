const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let localStream;
let peerConnection;

const servers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Get local media stream
async function getLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error getting local media stream', error);
    }
}

// Start the call (placeholder WebRTC code)
async function startCall() {
    peerConnection = new RTCPeerConnection(servers);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
        remoteVideo.srcObject = event.streams[0];
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
}

// Toggle microphone
const micButton = document.getElementById('toggleMic');
let micEnabled = true;

micButton.addEventListener('click', () => {
    micEnabled = !micEnabled;
    localStream.getAudioTracks()[0].enabled = micEnabled;
    micButton.classList.toggle('mic-off');
    micButton.classList.toggle('mic-on');
    micButton.innerHTML = micEnabled ? '<i class="fas fa-microphone"></i>' : '<i class="fas fa-microphone-slash"></i>';
});

// Toggle camera
const cameraButton = document.getElementById('toggleCamera');
let cameraEnabled = true;

cameraButton.addEventListener('click', () => {
    cameraEnabled = !cameraEnabled;
    localStream.getVideoTracks()[0].enabled = cameraEnabled;
    cameraButton.classList.toggle('camera-off');
    cameraButton.classList.toggle('camera-on');
    cameraButton.innerHTML = cameraEnabled ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
});

// Call button functionality
const callButton = document.getElementById('callButton');
let isCallActive = false;

callButton.addEventListener('click', () => {
    if (isCallActive) {
        // End the call
        peerConnection.close();
        remoteVideo.srcObject = null;
        isCallActive = false;
        callButton.classList.remove('call-end');
        callButton.classList.add('call-start');
        callButton.innerHTML = '<i class="fas fa-phone"></i>';
    } else {
        // Start the call
        startCall();
        isCallActive = true;
        callButton.classList.remove('call-start');
        callButton.classList.add('call-end');
        callButton.innerHTML = '<i class="fas fa-phone-slash"></i>';
    }
});

// Speech recognition and translation functionality
const originalTextElem = document.getElementById('originalText');
const translatedTextElem = document.getElementById('translatedText');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = async (event) => {
    const originalText = event.results[0][0].transcript;
    originalTextElem.textContent = originalText;

    const translatedText = await translateText(originalText, 'es'); // Translating to Spanish for example
    translatedTextElem.textContent = translatedText;
};

micButton.addEventListener('click', () => {
    recognition.start();
});

// Translation API request
async function translateText(text, targetLang) {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=YOUR_TRANSLATION_API_KEY`, {
        method: 'POST',
        body: JSON.stringify({ q: text, target: targetLang, format: 'text' }),
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.data.translations[0].translatedText;
}

// Initialize local video
getLocalStream();
