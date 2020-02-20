'use strict';
const socket = io();

const rematching = new Vue({
    el: '#main',
    data: {
        pairs: [],
        chosenPerson: {
            name: "",
            picture: "http://guides.global/images/guides/global/dummy_web_page.jpg"
        },
        unmatchedMen: [],
        unmatchedWomen: [],
        differentGender: [],
        newPairs: []
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.pairs = data.orders.pairs;
            this.update();
        }.bind(this));
        socket.on('currentQueue', function (data) {
            this.pairs = data.orders.pairs;
            this.update();
        }.bind(this));
    },
    methods: {

        update: function () {
            if (this.pairs != undefined) {
                this.chosenPerson = this.pairs[0].man;
                this.unmatchedMen = [];
                this.unmatchedWomen = [];
                for (var pair of this.pairs) {
                    if (pair.selected) {
                        this.unmatchedMen.push(pair.man);
                        this.unmatchedWomen.push(pair.woman);
                    }
                    else{
                        this.newPairs.push(pair);
                    }
                }
                this.differentGender = this.unmatchedWomen;
                console.log(this.unmatchedWomen.length)
            }
        },
        changePerson: function (forward) {

        }
    }
})