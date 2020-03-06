'use strict';
const socket = io();

const user_menu = new Vue({
    el: '#main_box',
    data: {
    id: window.location.href.split("?id=")[1]
    },
    methods:{
        start_event: function(){
            window.location.href = "/show_info?id=" + this.id;
        },
        goToProfilePage: function(){
            window.location.href = "/profile_page?id=" + this.id;
        },  
        goToUserMatches: function(){
            window.location.href = "/user_matches?id=" + this.id;
        }
    }
})
