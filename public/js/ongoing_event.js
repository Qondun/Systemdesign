'use strict';

const ongoing_event = new Vue({
    data: {
        men: [],
        women: [],
        pairs: [],
        round: 0,
        latestMatching: 0
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
                socket.emit('setLatestMatching', this.round);
            }
        },
        stdPair: function() {
            for (var i = 0; i < this.men.length; i++) {
                this.pairs.push({
                    man: this.men[i],
                    woman: this.women[i],
                    percentMatch: 99,
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
        addPerson: function(person, isMan, pic, age, table) {
            if (isMan) {
                this.men.push({
                    name: person,
                    picture: pic,
                    age: age,
                    table: table,


                });
            } else {
                this.women.push({
                    name: person,
                    picture: pic,
                    age: age,
                    table: table,
                });
            }
        },
        testSetup: function() {
            this.pairs = []; //Wrong?
            this.addPerson("Anders", true,
                "https://imgs.aftonbladet-cdn.se/v2/images/fa271742-05f9-499e-a82f-f42db92048d0?fit=crop&h=1540&q=50&w=1100&s=4f8e7552adaa6475fb10250c173d10c8ff12dd3c", "54", "A12");
            this.addPerson("Karl", true,
                "https://m.media-amazon.com/images/M/MV5BMTg1MjQ0MDg0Nl5BMl5BanBnXkFtZTcwNjYyNjI5Mg@@._V1_UY1200_CR88,0,630,1200_AL_.jpg", "46", "B3");
            this.addPerson("Anna", false,
                "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", "27", "A5");
            this.addPerson("Elsa", false,
                "https://upload.wikimedia.org/wikipedia/commons/b/b2/Natalie_Dormer_2014.jpg", "38", "C4");
            this.addPerson("Arnold", true,
                "https://reterdeen.com/wp-content/uploads/2019/10/arnold.jpg", "72", "D2");
            this.addPerson("Kamilla", false,
                "https://imgs.aftonbladet-cdn.se/v2/images/b27d5d33-e0fd-49d0-b924-2e4c9e697380?fit=crop&h=733&q=50&w=1100&s=8a1306695e56d97efbca205ad72293a21d5c7873", "32", "B1");

        },
    }
})