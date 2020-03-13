'use strict';
const socket = io();


const ongoing_event = new Vue({
    el: "#ongoing_div",
    data: {
        men: [],
        women: [],
        pairs: [],
        round: 0,
        latestMatching: 0,
        time: '00:00:00.000',
        roundNumber: '1',
        ongoingRound: false,
        eventDone: false,
        users: '20',
        usersDone: '0',
        draggedPerson: ''
    },
    created: function() {
        socket.on('initialize', function(data) {
            this.pairs = data.pairs;
            this.round = data.round;
            this.latestMatching = data.latestMatching;
            this.setup();
        }.bind(this));
        socket.on('pairsFromServer', function(data) {
            this.pairs = data.pairs;
            this.setup();
        }.bind(this));
        socket.on('roundFromServer', function(data) {
            this.round = data.round;
        }.bind(this));
    },
    methods: {
        setup: function() {
            console.log(this.round + ", " + this.latestMatching);
            if (this.roundNumber == undefined) {
                socket.emit('roundToServer', 1);
                this.roundNumber = 1;
                console.log("Denna text verkar aldrig visas?"); //Se över denna funktion
            }
            
            if (this.pairs[0] == undefined) { //Bygger på att det alltid kommer finnas minst ett par.
                this.pairs = [];
                this.testSetup();

                this.pair(this.round);
                socket.emit('pairsToServer', this.pairs);
            } else if (this.latestMatching < this.round) {
                this.men = [];
                this.women = [];
                for (let pair of this.pairs) {
                    this.men.push(pair.man);
                    this.women.push(pair.woman);
                }
                this.pairs = [];
                this.pair(this.round);
                socket.emit('pairsToServer', this.pairs);
                this.latestMatching = this.round;
                socket.emit('se tLatestMatching', this.round);
            }
        },
        stdPair: function() {
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
        pair: function(round) {
            //Very temporary!
            round = 2; //Gör något åt denna!
            while (round > 1) {
                let man = this.men.shift();
                this.men.push(man);
                round--;
            }
            socket.emit('setLatestMatching', this.round);
            this.stdPair();
        },
        addPerson: function(person, isMan, pic, age, id) {
            if (isMan) {
                this.men.push({
                    name: person,
                    picture: pic,
                    age: age,
                    isMan: isMan,
                    id: id
                });
            } else {
                this.women.push({
                    name: person,
                    picture: pic,
                    age: age,
                    isMan: isMan,
                    id: id
                });
            }
        },
        testSetup: function() {
            this.pairs = []; //Wrong?
            
            this.addPerson("Anders", true,
                "https://imgs.aftonbladet-cdn.se/v2/images/fa271742-05f9-499e-a82f-f42db92048d0?fit=crop&h=1540&q=50&w=1100&s=4f8e7552adaa6475fb10250c173d10c8ff12dd3c", "54");
            this.addPerson("Karl", true,
                "https://m.media-amazon.com/images/M/MV5BMTg1MjQ0MDg0Nl5BMl5BanBnXkFtZTcwNjYyNjI5Mg@@._V1_UY1200_CR88,0,630,1200_AL_.jpg", "46");
            this.addPerson("Anna", false,
                "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "27");
            this.addPerson("Elsa", false,
                "https://upload.wikimedia.org/wikipedia/commons/b/b2/Natalie_Dormer_2014.jpg", "38");
            this.addPerson("Arnold", true,
                "https://reterdeen.com/wp-content/uploads/2019/10/arnold.jpg", "72");
            this.addPerson("Kamilla", false,
                "https://imgs.aftonbladet-cdn.se/v2/images/b27d5d33-e0fd-49d0-b924-2e4c9e697380?fit=crop&h=733&q=50&w=1100&s=8a1306695e56d97efbca205ad72293a21d5c7873", "32");

        },
        allowDrop: function (ev) {
            ev.preventDefault();
        },
        drag: function(ev) {
            /*console.log(ev.dataTransfer.setData("text", ev.target.id));
            for(var pair of this.pairs){
                if(pair.man.id == ev.dataTransfer.setData("text", ev.target.id)){
                    this.draggedPerson = pair.man;
                }
                else if(pair.woman.id == ev.dataTransfer.setData("text", ev.target.id)){
                    this.draggedPerson = pair.woman;
                }
                }*/
            console.log(ev.target.getAttribute('value'));
            this.draggedPerson = this.pairs[ev.target.getAttribute('value')].man;
            console.log(this.draggedPerson);
        },
        drop: function (ev) {
            ev.preventDefault();
            //let myPair;
            /*for(var pair of this.pairs){
                if(pair.man == (ev.target.getAttribute('value')) || pair.woman == (ev.target.getAttribute('value'))){
                    myPair = pair;
                }
                }*/
            let myPair = this.pairs[ev.target.getAttribute('value')];
            //var data = ev.dataTransfer.getData("text");
            //ev.target.appendChild(document.getElementById(data));
            var tmp;
            tmp = myPair.man.picture;
            myPair.man.picture = this.draggedPerson.picture;
            this.draggedPerson.picture = tmp;
            /*if(this.draggedPerson.isMan){
                tmp = myPair.man.picture;
                myPair.man.picture = this.draggedPerson.picture;
                this.draggedPerson.picture = tmp;
            }
            else {
                tmp = myPair.woman.picture;
                myPair.woman.picture = this.draggedPerson.picture;
                this.draggedPerson.picture = tmp;
            }*/
            
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

