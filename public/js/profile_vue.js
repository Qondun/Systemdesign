'use strict';
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        range1: '',
        range2: '',
        range3: '',
        id: window.location.href.split("?id=")[1],
        submitted: false,
        pick: false
    },
    methods: {
        test: function(){
            if(this.fullname == ''){
                window.alert("Enter name before submitting!");
            }
            else if(confirm("Send info?")){
                socket.emit('profileToServer', { name: this.fullname, id: this.id, answers: [], shares: [], matches: [], isMan: this.pick})
                console.log(this.pick);
		        window.location.href = '/user_menu?id='+this.id;
            }
        },
        goBack: function(){
            window.location.href = "/user_menu?id="+this.id;
        }
        
    }
})
