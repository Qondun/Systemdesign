'use strict';
const socket = io();

const user_menu = new Vue({
    el: '#main_box',
    data: {
    id: -1
    },
    methods:{
        login: function(){
            socket.emit('iWantId', 0);
            socket.on('idFromServer', function (data) {
                this.id = data.id;
                console.log(data);
                window.location.href = "/user_menu?id=" + this.id;
            });
        }
    }
})
