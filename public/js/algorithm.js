'use strict';
const socket = io();

const Algorithm = new Vue({
    el: '#allMatches',
    data: {
        men: [],
        women: [],
        pairs: [],
        umatchedMen: [],
        unmatchedWomen: [],
        newPairs: [],
        numberOfSelected: 0
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.pairs = data.pairs;
            this.setup();
        }.bind(this));
        socket.on('pairsFromServer', function (data) {
            this.pairs = data.pairs;
            this.setup();
        }.bind(this));
    },
    methods: {
        setup: function () {
            if (Algorithm.pairs == undefined) {
                Algorithm.pairs = [];
                Algorithm.testSetup();
                Algorithm.pair(0);
            }

            this.numberOfSelected = 0;
            //disables or enables button depending on number of selected pairs
            for (let pair of this.pairs) {
                if (pair.selected) {
                    this.numberOfSelected++;
                }
            }

            let bt = document.getElementById("nextButton");
            let popText = document.getElementById("popupText");
            if (this.numberOfSelected < 2) { bt.disabled = true; popText.style.visibility = "visible"; }
            else { bt.disabled = false; popText.style.visibility = "hidden"; }

        },
        stdPair: function () {
            for (var i = 0; i < this.men.length; i++) {
                this.pairs.push(
                    {
                        man: this.men[i],
                        woman: this.women[i],
                        percentMatch: 99,
                        selected: false
                    });
            }
        },
        pair: function (round) {
            //Very temporary!
            while (round > 0) {
                let man = this.men.shift();
                this.men.push(man);
                round--;
            }
            this.stdPair()
        },
        addPerson: function (person, isMan, pic) {
            if (isMan) {
                this.men.push({
                    name: person,
                    picture: pic
                });
            }
            else {
                this.women.push({
                    name: person,
                    picture: pic
                });
            }
        },
        printPairs: function () {
            for (var pair of this.pairs) {
                console.log(pair.man.name + " - " + pair.woman.name);
            }
        },
        printPair: function (pair) {
            return pair.man.toString() + " - " + pair.woman.toString();
        },
        testSetup: function () {
            this.pairs = []; //Wrong?
            this.addPerson("Anders", true,
                "https://imgs.aftonbladet-cdn.se/v2/images/fa271742-05f9-499e-a82f-f42db92048d0?fit=crop&h=1540&q=50&w=1100&s=4f8e7552adaa6475fb10250c173d10c8ff12dd3c");
            this.addPerson("Karl", true,
                "https://m.media-amazon.com/images/M/MV5BMTg1MjQ0MDg0Nl5BMl5BanBnXkFtZTcwNjYyNjI5Mg@@._V1_UY1200_CR88,0,630,1200_AL_.jpg");
            this.addPerson("Anna", false,
                "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940");
            this.addPerson("Elsa", false,
                "https://upload.wikimedia.org/wikipedia/commons/b/b2/Natalie_Dormer_2014.jpg");
            this.addPerson("Arnold", true,
                "https://reterdeen.com/wp-content/uploads/2019/10/arnold.jpg");
            this.addPerson("Kamilla", false,
                "https://imgs.aftonbladet-cdn.se/v2/images/b27d5d33-e0fd-49d0-b924-2e4c9e697380?fit=crop&h=733&q=50&w=1100&s=8a1306695e56d97efbca205ad72293a21d5c7873");

        },
        selectPair: function (index) {
            this.pairs[index].selected = !this.pairs[index].selected;

            //disables or enables button depending on number of selected pairs
            if (this.pairs[index].selected) { this.numberOfSelected++; }
            else { this.numberOfSelected--; }
            let bt = document.getElementById("nextButton");
            let popText = document.getElementById("popupText");
            if (this.numberOfSelected < 2) { bt.disabled = true; popText.style.visibility = "visible"; }
            else { bt.disabled = false; popText.style.visibility = "hidden"; }
        }
    }
})


const btn = new Vue({
    el: '#nextButton',
    methods: {
        toRematch: function () {
            socket.emit('pairsToServer',
                { pairs: Algorithm.pairs }
            );
        }
    }
})