'use strict';
const socket = io();

const user_menu = new Vue({
    el: '#main_box',
    data: {
	name: window.location.href.split("?name=")[1]
    },
    methods:{
        start_event: function(){
            //socket.emit('roundToServer', 1);
            window.location.href = "/show_info";
        }
    }
})
