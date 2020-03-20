'use strict';
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        age: 30,
        range1: '3',
        range2: '3',
        range3: '3',
        id: window.location.href.split("?id=")[1],
        submitted: false,
        pick: false,
        profile: {id: '', name: '', age: '', city: '', isMan: true, travel: 3, workout: 3, food: 3, matches: [], shares: [], answers: []}
    },
    created: function () {
        socket.emit('getProfile', this.id);
        socket.on('profileFromServer', function(id,profile) {
            if(id == this.id && profile != null){
                this.profile = profile;
                console.log("profile: " + this.profile.name + " " + this.profile.age);
            }
        }.bind(this));
    },
    methods: {
        test: function(){
            if(this.profile.name == ''){
                window.alert("Enter name before submitting!");
            }
            else if(confirm("Send info?")){
                socket.emit('profileToServer', this.profile);
                console.log(this.pick);
		        window.location.href = '/user_menu?id='+this.id;
            }
        },
        goBack: function(){
            window.location.href = "/user_menu?id="+this.id;
        }
        
    }
})
