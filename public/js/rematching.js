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
        sameGender: [],
        differentGender: [],
        newPairs: [],
        index: 0,
        chosenIsMan: true
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.pairs = data.pairs;
            this.update();
        }.bind(this));
        socket.on('pairsFromServer', function (data) {
            this.pairs = data.pairs;
            this.update();
        }.bind(this));
    },
    methods: {

        update: function () {
            if (this.pairs != undefined) {
                this.sameGender = [];
                this.differentGender = [];
                this.chosenIsMan = true;
                for (var pair of this.pairs) {
                    if (pair.selected) {
                        this.sameGender.push(pair.man);
                        this.differentGender.push(pair.woman);
                    }
                    else{
                        this.newPairs.push(pair);
                    }
                }
                this.chosenPerson = this.sameGender[0];
            }
            else{
                this.chosenPerson = {
                    name: "N/A",
                    picture: "http://guides.global/images/guides/global/dummy_web_page.jpg"
                }
            }
            this.index = 0;
        },
        changePerson: function (forward) {
            if(forward) {this.index++;}
            else {this.index--;}
            if(this.index < 0){this.index = this.sameGender.length -1}
            this.index = this.index % this.sameGender.length;
            this.chosenPerson = (this.sameGender[this.index]);
        },
        changeGender: function(){
            let temp = this.sameGender;
            this.sameGender = this.differentGender;
            this.differentGender = temp;
            this.chosenPerson = this.sameGender[this.index];
            this.chosenIsMan = !this.chosenIsMan;
        },
        reMatch: function(key){
            if(this.chosenIsMan){
                this.newPairs.push({
                    man: this.sameGender[this.index],
                    woman:  this.differentGender[key],
                    percentMatch: 95,
                    selected: false,
                });
            }else{
                this.newPairs.push({
                    man:  this.differentGender[key],
                    woman: this.sameGender[this.index],
                    percentMatch: 95,
                    selected: false,
                });
            }
            this.sameGender.splice(this.index, 1);
            this.differentGender.splice(key, 1)
            
            if(this.sameGender.length == 0){

                socket.emit('pairsToServer', this.newPairs);
                window.location.href = "/matches"
            }
            else if(this.index > this.sameGender.length -1 ) {
                this.index -= 1;
            }
            this.chosenPerson = this.sameGender[this.index];
        }
    }
})