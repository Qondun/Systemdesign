'use strict';
const socket = io();

const vm = new Vue({

    el: '#myID',
    data: {
        time: '00:00:00.000',
        roundNumber: '1',
        ongoingRound: false,
        eventDone: false,
        users: '20',
        usersDone: '0'
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.roundNumber = data.round;
            this.setup();
        }.bind(this));
        socket.on('roundFromServer', function (data) {
            this.roundNumber = data.round;
            this.setup();
        }.bind(this));
    },
    methods: {
        setup: function () {
            if (this.roundNumber == undefined) {
                socket.emit('roundToServer', 1);
                this.roundNumber = 1;
                console.log("Denna text verkar aldrig visas?"); //Se över denna funktion
            }
        },
        startRound: function () {
            if (confirm("Start next round?")) {
                this.ongoingRound = true;
                this.usersDone = 0;
                reset();
                start();
            }
        },
        endRound: function () {
            let rn = this.roundNumber;
            if (rn < 3) {
                rn++;
            } else {
                this.eventDone = true;
            }
            this.roundNumber = rn;
            this.ongoingRound = false;
            socket.emit('roundToServer', this.roundNumber);
            ongoing_event.round = this.roundNumber;
            ongoing_event.setup();
        },
        endEvent: function () {
            if (confirm("End event?")) {
                this.roundNumber = 1;
                socket.emit('roundToServer', this.roundNumber);
                socket.emit('setLatestMatching', 0);
                window.location.assign("/arranger");
            }
        },
        notifyUsers: function () {
            if (this.usersDone + 5 <= this.users) {
                this.usersDone = this.usersDone + 5;
            } else {
                this.usersDone = this.users;
            }
        },
        showMatches: function () {
            window.location.assign("/matches");
        },

    }
})


start();

var timeBegan = null
    , timeStopped = null
    , stoppedDuration = 0
    , started = null
    , running = false;

function start() {
    if (running) return;

    if (timeBegan === null) {
        reset();
        timeBegan = new Date();
    }

    if (timeStopped !== null) {
        stoppedDuration += (new Date() - timeStopped);
    }

    started = setInterval(clockRunning, 10);
    running = true;
}

function stop() {
    running = false;
    timeStopped = new Date();
    clearInterval(started);
}

function reset() {
    running = false;
    clearInterval(started);
    stoppedDuration = 0;
    timeBegan = null;
    timeStopped = null;
    vm.time = "00:00:00.000";
}

function clockRunning() {
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();

    vm.time =
        zeroPrefix(min, 2) + ":" +
        zeroPrefix(sec, 2);
};

function zeroPrefix(num, digit) {
    var zero = '';
    for (var i = 0; i < digit; i++) {
        zero += '0';
    }
    return (zero + num).slice(-digit);
}

