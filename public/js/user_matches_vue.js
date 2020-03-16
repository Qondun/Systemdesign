const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        profile: {},
        matches: [],
        
        selectedProfile: {},
        showMatch: false,
        id: window.location.href.split("?id=")[1]
    },
    created: function () {
	socket.emit('getProfile',this.id);
        socket.on('profileFromServer', function(id,profile){
            if(id == this.id){
		console.log(profile);
                this.profile = profile;
                console.log(this.profile);
                
            }
        }.bind(this));

        socket.emit('getMatchProfiles', this.id);
        socket.on('profileMatchesFromServer', function(matches){
            this.matches = matches;
        }.bind(this));

    },
    methods: {
        selectMatch: function(match) {
            this.selectedProfile = match;
            this.showMatch = true;
        },
        closeMatch: function() {
            this.showMatch = false;
        },
        copyText: function(id) {
            let test = document.querySelector(id);
            console.log(test);
            test.setAttribute('type', 'text');
            test.select();
            document.execCommand('copy');
            test.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
        },
        goBack: function(forReal){
            if(forReal){
                window.location.href = "/user_menu?id="+this.id;
            }
            else{
                window.location.href = window.location.href;
            }
        }
    }    
})


socket.emit('getProfile', vm.id);

