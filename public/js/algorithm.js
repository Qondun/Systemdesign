'use strict';
const socket = io();

const Algorithm = new Vue({
    el: '#allMatches',
    data: {
        pairs: [],
        numberOfSelected: 0
    },
    created: function() {
        socket.on('initialize', function(data) {
            this.pairs = data.pairs;
            this.setup();
        }.bind(this));
        socket.on('pairsFromServer', function(data) {
            this.pairs = data.pairs;
            this.setup();
        }.bind(this));
    },
    methods: {
        setup: function() {
            this.numberOfSelected = 0;
            //disables or enables button depending on number of selected pairs
            for (let pair of this.pairs) {
                if (pair.selected) {
                    this.numberOfSelected++;
                }
            }

            let bt = document.getElementById("nextButton");
            let popText = document.getElementById("popupText");
            if (this.numberOfSelected < 2) {
                bt.disabled = true;
                popText.style.visibility = "visible";
            } else {
                bt.disabled = false;
                popText.style.visibility = "hidden";
            }
        },
        selectPair: function(index) {
            this.pairs[index].selected = !this.pairs[index].selected;

            //disables or enables button depending on number of selected pairs
            if (this.pairs[index].selected) { this.numberOfSelected++; } else { this.numberOfSelected--; }
            let bt = document.getElementById("nextButton");
            let popText = document.getElementById("popupText");
            if (this.numberOfSelected < 2) {
                bt.disabled = true;
                popText.style.visibility = "visible";
            } else {
                bt.disabled = false;
                popText.style.visibility = "hidden";
            }
        }
    }
})


const btn = new Vue({
    el: '#nextButton',
    methods: {
        toRematch: function() {
            socket.emit('pairsToServer', Algorithm.pairs);
        }
    }
})