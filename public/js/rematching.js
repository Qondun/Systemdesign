'use strict';
const socket = io();

const rematching = new Vue({
    data:{
        pairs: []
    },
    created: function(){
        socket.on('initialize', function(data) {
            this.pairs = data.orders;
        }.bind(this));
        socket.on('currentQueue', function(data) {
            this.pairs = data.orders.pairs;
            console.log(this.pairs[1].man.name);
        }.bind(this));
    },
    methods:{
        changePerson: function(forward){
            
        }
    }
})