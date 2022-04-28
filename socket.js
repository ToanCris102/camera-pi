const io = require('socket.io-client');
const util = require('./util')
require('dotenv').config();
const { StreamCamera, Codec, Flip, SensorMode } = require('pi-camera-connect');
const socket = io.connect(process.env.SERVER);
let connect = false;
const streamCamera = new StreamCamera({
    codec: Codec.MJPEG,
    flip: Flip.Vertical,
    sensorMode: SensorMode.AutoSelect
});
const camera = process.env.CAMERA

socket.on('connect', () => {
    socket.sendBuffer = [];
    socket.emit("pi-cam-init", camera);
    console.log("Connected to the server!" + socket.id);
})

socket.on('start-camera-pi', async (data) => {
    console.log(data + ' get data camera-pi');    
    streamCamera.on('frame', (data) => {
	socket.binary(true).emit('pi-video-stream', camera, "data:image/jpeg;base64," + data.toString("base64"));
    });    

});

socket.on('stop-camera-pi', (data) => {
    console.log(data + ' has left the stream');
    	
    cameraStopCapture().then(() => {
       console.log('Camera is stopped');
    });
});




async function cameraStartCapture() {
    await streamCamera.startCapture();
}

async function cameraStopCapture() {
    await streamCamera.stopCapture();
}

// cameraStartCapture().then(() => {
//     console.log('Camera is now capturing');
// });
