const GrovePi = require('node-grovepi').GrovePi;
const Board = GrovePi.board;

const sensors = require('../sensors');

let board = null;
let loudness = null;
let rotaryAngle = null;
let button = null;

function start() {
    console.log('starting')

    board = new Board({
        debug: true,
        onError: function (err) {
            console.log('test error:' + err);
        },
        onInit: function (res) {
            if (res) {
                loudness = new sensors.SoundAnalogSensor(2, 5);
                loudness.start();
                setInterval(soundLoop, 1000);

                rotaryAngle = new sensors.RotaryAngleSensor(1);
                rotaryAngle.on('change', function (res) {
                    console.log('Rotary value: ' + res);
                });
                rotaryAngle.watch();

                button = new sensors.ButtonSensor(4);
                button.on('change', function (res) {
                    console.log('Button value: ' + res);
                });
                button.watch(10);

            } else {
                console.log('Error: test cannot start, problem in the board?');
            }
        }
    })
    board.init();
}


function soundLoop() {
    if (!loudness) throw Error('you need to initialize the sensor');
    let res = loudness.read();
    console.log('Sound value: ' + res);
}

function onExit(err) {
    console.log('ending');
    loudness.stop();
    clearInterval(soundLoop);
    board.close();
    process.removeAllListeners();
    process.exit();
    if (typeof err != 'undefined')
        console.log(err);
}

// starts the test
start();
// catches ctrl+c event
process.on('SIGINT', onExit);