// Access the camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        document.getElementById('cameraBox').innerHTML = '';
        document.getElementById('cameraBox').appendChild(video);

        // Placeholder for handling video processing
        // You can add your sign language detection and translation logic here
        video.addEventListener('playing', function() {
            // Example: Update translation output (this should be replaced with actual translation logic)
            setTimeout(() => {
                document.getElementById('outputBox').innerText = "Hello, World!";
            }, 3000); // Simulate a translation delay
        });

    })
    .catch(function(error) {
        console.log("An error occurred: " + error);
        document.getElementById('cameraBox').innerText = "Unable to access camera.";
    });

    // Typewriter effect function
function typewriterEffect(text) {
    const outputBox = document.getElementById('outputBox');
    let index = 0;
    outputBox.innerHTML = ''; // Clear any existing content

    function type() {
        if (index < text.length) {
            outputBox.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 100); // Adjust the speed here
        } else {
            outputBox.classList.remove('typing'); // Stop the blinking cursor after typing
        }
    }

    outputBox.classList.add('typing');
    type();
}