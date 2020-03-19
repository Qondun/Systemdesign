'use strict';
const socket = io();


const ongoing_event = new Vue({
    el: "#ongoing_div",
    data: {
        men: [],
        women: [],
        pairs: [],
        latestMatching: 0,
        time: '00:00:00.000',
        roundNumber: '1',
        ongoingRound: false,
        eventDone: false,
        reviewDone: true,
        users: '20',
        usersDone: '0',
        draggedPerson: null,
        draggedPair: null,
        selectedPerson: null,
        selectedMan: null,
        selectedWoman: null
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.pairs = data.pairs;
            this.roundNumber = data.round;
            this.latestMatching = data.latestMatching;
            this.users = data.numberOfUsersReady;
            this.setup(data.profiles);
        }.bind(this));
        socket.on('pairsFromServer', function (data) {
            this.pairs = data.pairs;
            this.setup(data.profiles);
        }.bind(this));
        socket.on('roundFromServer', function (data) {
            this.roundNumber = data.round;
          
        }.bind(this));
    },
    methods: {
        setup: function (profiles) {
            console.log(this.roundNumber + ", " + this.latestMatching);
            if (this.roundNumber == undefined) {
                socket.emit('roundToServer', 1);
                this.roundNumber = 1;
                console.log("Denna text verkar aldrig visas?"); //Se över denna funktion
            }

            if (this.pairs[0] == undefined) { //Bygger på att det alltid kommer finnas minst ett par.
                this.pairs = [];
                //this.testSetup();
                for (let profile of profiles) {
                    if (profile.isMan == true || profile.isMan == 'true') {
                        this.men.push(profile);
                    }
                    else {
                        this.women.push(profile);
                    }
                }

                this.pair(this.roundNumber);
                socket.emit('pairsToServer', this.pairs);
            } else if (this.latestMatching < this.roundNumber) {
                this.men = [];
                this.women = [];
                for (let pair of this.pairs) {
                    this.men.push(pair.man);
                    this.women.push(pair.woman);
                }
                this.pairs = [];
                this.pair(this.roundNumber);
                socket.emit('pairsToServer', this.pairs);
                this.latestMatching = this.roundNumber;
                socket.emit('setLatestMatching', this.roundNumber);
            }
        },
        selectMan: function (man) {
            this.selectedMan = man;
        },
        selectWoman: function (woman) {
            this.selectedWoman = woman;
        },
        deselectMan: function () {
            this.selectedMan = null;
        },
        deselectWoman: function () {
            this.selectedWoman = null;
        },
        stdPair: function () {
            for (var i = 0; i < this.men.length; i++) {
                this.pairs.push(
                    {
                        man: this.men[i],
                        woman: this.women[i],
                        percentMatch: 99,
                        table: i,
                        selected: false
                    });
            }
        },
        pair: function (round) {
            //Very temporary!
            round = 2; //Gör något åt denna!
            while (round > 1) {
                let man = this.men.shift();
                this.men.push(man);
                round--;
            }
            socket.emit('setLatestMatching', this.roundNumber);
            this.stdPair();
        },
        addPerson: function (person, isMan, pic, age, id) {
            if (isMan) {
                this.men.push({
                    name: person,
                    image: pic,
                    city: 'Uppsala',
                    age: age,
                    answers: ['5','Yes','No','Yes','I would like to sit at a new table'],
                    isMan: isMan,
                    id: id
                });
            } else {
                this.women.push({
                    name: person,
                    city: 'Uppsala',
                    image: pic,
                    age: age,
                    answers: ['5','Yes','No','Yes','I would like to sit at a new table'],
                    isMan: isMan,
                    id: id
                });
            }
        },
        testSetup: function () {
            this.pairs = []; //Wrong?
        },
        allowDrop: function (ev) {
            ev.preventDefault();
        },
        dragMan: function (ev) {
            let pair = this.pairs[ev.target.getAttribute('value')];
            let draggedPerson = pair.man;
            this.draggedPerson = draggedPerson;
            console.log("dragging: " + draggedPerson.name);
            this.draggedPair = pair;
        },
        dragWoman: function (ev) {
            let pair = this.pairs[ev.target.getAttribute('value')];
            let draggedPerson = pair.woman;
            this.draggedPerson = draggedPerson;
            console.log("dragging: " + draggedPerson.name);
            this.draggedPair = pair;
        },
        dragTable: function (ev) {
            let pair = this.pairs[ev.target.getAttribute('value')];
            this.draggedPair = pair;
        },
        drop: function (ev) {
            ev.preventDefault();
            if (this.draggedPerson == null && this.draggedPair == null) return;
            console.log("dropped on index" + ev.target.getAttribute('value'));
            let droppedPair = this.pairs[ev.target.getAttribute('value')];
            if (this.draggedPerson == null && this.draggedPair != null) {
                console.log("Table swoopdiwoop");
                let manToSwap = droppedPair.man;
                let womanToSwap = droppedPair.woman;
                droppedPair.man = this.draggedPair.man;
                droppedPair.woman = this.draggedPair.woman;
                this.draggedPair.man = manToSwap;
                this.draggedPair.woman = womanToSwap;
                return;
            }
            if (this.draggedPerson.isMan == 'true' ||
		this.draggedPerson.isMan == true ) {
                let manToSwap = droppedPair.man;
                droppedPair.man = this.draggedPerson;
                this.draggedPair.man = manToSwap;
            } else {
                let womanToSwap = droppedPair.woman;
                droppedPair.woman = this.draggedPerson;
                this.draggedPair.woman = womanToSwap;
            }

            this.draggedPerson = null;
            this.draggedPair = null;
        },
        getGender: function (pair, gender) {
            return pair.man;
        },
        startRound: function () {
            if (confirm("Start next round?")) {
                socket.emit('pairsToServer', this.pairs);
                socket.emit('startRoundToServer', {});
                this.ongoingRound = true;
                this.usersDone = 0;
                //this.reviewDone = false;
                reset();
                start();
            }
        },
        endRound: function () {
            let rn = this.roundNumber;
            rn++;
                if (rn > 3) {
                    this.eventDone = true;
                }
            this.roundNumber = rn;
            this.ongoingRound = false;
            socket.emit('roundToServer', this.roundNumber);
            ongoing_event.roundNumber = this.roundNumber;
            ongoing_event.setup();
            socket.emit('quitDateToServer', {});
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

            if (this.usersDone >= this.users) {
                this.reviewDone = true;
            }
        },
        skipReview: function () {
            if(confirm("Skip review phase?")){
                this.reviewDone = true;
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
    ongoing_event.time = "00:00:00.000";
}

function clockRunning() {
    var currentTime = new Date()
        , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
        , hour = timeElapsed.getUTCHours()
        , min = timeElapsed.getUTCMinutes()
        , sec = timeElapsed.getUTCSeconds()
        , ms = timeElapsed.getUTCMilliseconds();

    ongoing_event.time =
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
