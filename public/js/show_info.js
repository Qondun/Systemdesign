'use strict';
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        dateAvailible: false,
        currentDate: null,
        done: false,
        okPressed: false,
        round: 1
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.round = data.round;
        }.bind(this));
        socket.on('roundFromServer', function (data) {
            this.round = data.round;
        }.bind(this));
    },
    methods: {
        okSubmit: function() {
            this.okPressed = true;
            console.log(this.round);
            setInterval(function() { window.location.assign("/question_page")  }, 3000);
        },
        setDate: function(name, age, match, table, img){
            let myDate = {name, age, match, table, img};
            this.currentDate = myDate;
            this.dateAvailible = true;
        },
        completeDate: function(){

            this.currentDate = null;
            this.dateAvailible = false;
            setTimeout(function(){
                vm.setDate("Johnny",78,62,"E12",'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bernie_Sanders_July_2019_retouched.jpg/800px-Bernie_Sanders_July_2019_retouched.jpg');
            },5000)
        }
    }
})


setInterval(vm.completeDate(),50);