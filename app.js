/* jslint node: true */
/* eslint-env node */
'use strict';

// Require express, socket.io, and vue
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Pick arbitrary port for server
const port = 3000;
app.set('port', (process.env.PORT || port));

// Serve static assets from public/
app.use(express.static(path.join(__dirname, 'public/')));
// Serve vue from node_modules as vue/
app.use('/vue',
    express.static(path.join(__dirname, '/node_modules/vue/dist/')));
// Serve index.html directly as root page
app.get('/profile_page', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/profile_page.html'));
});
app.get('/user_menu', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/user_menu.html'));
});

app.get('/user_matches', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/user_matches.html'));
});

app.get('/matches', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/matches.html'));
});

app.get('/rematches', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/rematches.html'));
});

app.get('/example', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/example.html'));
});

app.get('/arranger', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/arranger.html'));
});

app.get('/ongoing_event', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/ongoing_event.html'));
});

app.get('/ongoing_round', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/ongoing_round.html'));
});

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/show_info', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/show_info.html'));
});

app.get('/share_info', function(req, res) {
	  res.sendFile(path.join(__dirname, 'views/share_info.html'));
});
// Store data in an object to keep the global namespace clean and
// prepare for multiple instances of data if necessary
function Data() {
    this.profiles = [ { name: 'Pontus', id: 'dummyProfile', answers: [], shares: [], matches: [], isMan: true, completed: true},
                      { name: 'Johnny', id: 'std1', age: '78', answers: [], shares: ['1'], matches: [],
			isMan: true, completed: true, email: "bs@mail.us", 
			image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg'},
                      { name: 'Arnold', id: 'std2', age: '72', answers: [], shares: ['1'], matches: [], isMan: true, 
			completed: true, email: "TheArnold@gmail.com", 
			image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg'},
                      { name: 'Keanu', id: 'std3', age: '55', answers: [], shares: ['1'], matches: [], isMan: true,
			completed: true, email: "Keanu@keanu.com", 
			image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg'}];
    this.pairs = {};
    this.round = 1;
    this.latestMatching = 0;
    this.reviewsDone = 0;
    this.currentId = 0;
    this.numberOfUsersReady = 0;
    this.idReady = [];
}

Data.prototype.getAllData = function() {
  return this;
};

Data.prototype.pairsToServer = function(pairs) {
  this.pairs = pairs;
};

Data.prototype.getAllPairs = function() {
  return this.pairs;
};

Data.prototype.getId = function() {
  this.currentId++;
  return this.currentId;
};

Data.prototype.roundToServer = function(round) {
  this.round = round;
};

Data.prototype.answersToServer = function(id,answers){
    let profile = this.getProfile(id);
    if(profile){
        profile.answers.push(answers);
        let ans = profile.answers[0];
        console.log("Recieved answer to profile " + profile.id + " answers: " + ans.rating + " " + ans.a1 + " " + ans.a2 + " " + ans.a3 + " "  + ans.comment);
        this.reviewsDone++;
    }
}

// Shares is an array of profile ids
Data.prototype.sharesToServer = function(id, shares){
    let profile = this.getProfile(id);
    let myShares = shares;
    if(profile){
        for(var shareId of myShares){
	    if (shareId != 'No'){
		profile.shares.push(shareId);
		console.log("Profile " + profile.id + " shared contact info with " + shareId);
	    }
        }
        this.updateMatches(id);
    }
}

Data.prototype.collectMatches = function(id){
    let profile = this.getProfile(id);
    let myMatches = profile.matches;
    let matches = [];
    for (let match of myMatches){
        matches.push(this.getProfile(match.id));
    }
    return matches;
}

Data.prototype.updateMatches = function(id){
    let myProfile = this.getProfile(id);
    if(myProfile){
        let shares = myProfile.shares;
        for(var shareId of shares){
            let profile = this.getProfile(shareId);
            if (profile && profile.shares.includes(id)){
                myProfile.matches.push({id: shareId});
                profile.matches.push({id: myProfile.id, name: myProfile.name});
                console.log("succesful match! " + shareId + " with " + myProfile.id);
            }
        }
    }
}

Data.prototype.getProfile = function(id){
    return this.profiles.find(function(element){
        return element.id == id; 
    });
}
                             

Data.prototype.getRound = function() {
  return this.round;
};

const data = new Data();

io.on('connection', function(socket) {
  // Send list of orders when a client connects
  socket.emit('initialize', data.getAllData());
  // When a connected client emits an "addOrder" message
  socket.on('pairsToServer', function(pairs) {
    data.pairsToServer(pairs)
    // send updated info to all connected clients,
    // note the use of io instead of socket
    io.emit('pairsFromServer',  {pairs: data.getAllPairs()});
  });
    socket.on('answersToServer', function(id,answers) {
        // Send answers to the server, push it to profile with id id
        data.answersToServer(id,answers); 
    });
    socket.on('getProfile', function(id) {
        io.emit('profileFromServer', id, data.getProfile(id));
    });
    socket.on('sharesToServer', function(id,shares){
        data.sharesToServer(id,shares);
    });
    socket.on('getMatchProfiles', function(id){
        socket.emit('profileMatchesFromServer', data.collectMatches(id))
    });
    socket.on('profileToServer', function(editedProfile){
        for (let profile of data.profiles){
            if(profile.id == editedProfile.id) {
                editedProfile.matches = profile.matches;
                editedProfile.shares = profile.shares;
                profile.name = editedProfile.name;
                profile.isMan = editedProfile.isMan;
                profile.completed = true;
                break;
            }
        }
        console.log(editedProfile);
        console.log(data.getProfile(editedProfile.id));
    });
    socket.on('roundToServer', function(round) {
      data.roundToServer(round);
      // send updated info to all connected clients,
      // note the use of io instead of socket
      io.emit('roundFromServer',  {round: data.getRound() });
    });
    socket.on('setLatestMatching', function(round) {
      data.latestMatching = round;
      // send updated info to all connected clients,
      // note the use of io instead of socket
      io.emit('getLatestMatching',  {latestMatching: data.latestMatching });
    });
    socket.on('startRoundToServer', function(data) {
	io.emit('startRoundFromServer', {});
    });
    socket.on('quitDateToServer', function(data) {
	io.emit('quitDateFromServer', {});
    });
    socket.on('iWantId', function(nothin) {
        let newId = data.getId();
        io.emit('idFromServer', {id: newId});
        data.profiles.push({ name: '', id: newId.toString(), answers: [], shares: [], matches: [], isMan: false, completed: false});
    });
    socket.on('readyForEvent', function(id){
	if(!data.idReady.includes(id)){
	    data.numberOfUsersReady++;
	    data.idReady.push(id);
	    io.emit('numberOfUsersReady', {number: data.numberOfUsersReady});
	}
    });
    socket.on('zeroUsers', function(){
	data.numberOfUsersReady = 0;
	data.idReady = [];
	io.emit('numberOfUsersReady', {number: 0});
    });
});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});
