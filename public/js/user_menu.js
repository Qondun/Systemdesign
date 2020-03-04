'use strict';
const socket = io();

const user_menu = new Vue({
    el: '#main_box',
    data: {
    name: window.location.href.split("?name=")[1],
    id: -1
    },
    methods:{
        start_event: function(){
            socket.emit('iWantId', 0);
            socket.on('idFromServer', function (data) {
                this.id = data.id;
                console.log(data);
                window.location.href = "/show_info?id=" + this.id;
            });
        }
    }
})
