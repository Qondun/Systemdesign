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
    // this.profiles = [],
    this.profiles = [// { name: 'Pontus', id: 'dummyProfile', answers: [], shares: [], matches: [], isMan: true, completed: true},
        //{ name: 'Johnny', id: 'std1', age: '78', answers: [], shares: ['1'], matches: [],
	//  isMan: true, completed: true, email: "bs@mail.us", 
	//  image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg'},
        { name: 'Arnold', id: '101', age: '72', answers: [], shares: ['1'], matches: [], dates: [], isMan: true, 
	  completed: true, email: "TheArnold@gmail.com", 
	  image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg'},
        { name: 'Keanu', id: '102', age: '55', answers: [], shares: ['1'], matches: [], dates: [], isMan: true,
	  completed: true, email: "Keanu@keanu.com", 
	  image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg'},
        { name: 'Anna', id: '103', age: '35', answers: [], shares: ['2', '3'], matches: [], dates: [], isMan: false,
	  completed: true, email: "anna@anna.com", 
	  image: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"},
	{ name: 'Elsa', id: '104', age: '25', answers: [], shares: ['1'], matches: [], dates: [], isMan: false,
	  completed: true, email: "elsa@elsa.com",
	  image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Natalie_Dormer_2014.jpg"},
	/*{ name: 'Kamilla', id: '104', age: '25', answers: [], shares: ['1','2', '3'], matches: [], dates: [], isMan: false,
	  completed: true, email: "elsa@elsa.com", 
	  image: "https://imgs.aftonbladet-cdn.se/v2/images/b27d5d33-e0fd-49d0-b924-2e4c9e697380?fit=crop&h=733&q=50&w=1100&s=8a1306695e56d97efbca205ad72293a21d5c7873"}*/],
    this.pairs = [];
    this.round = 1;
    this.latestMatching = 0;
    this.reviewsDone = 0;
    this.currentId = 0;
    this.numberOfUsersReady = 0;
    this.idReady = [];
    this.womanPics = ["https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
		    "https://upload.wikimedia.org/wikipedia/commons/b/b2/Natalie_Dormer_2014.jpg",
            "https://imgs.aftonbladet-cdn.se/v2/images/b27d5d33-e0fd-49d0-b924-2e4c9e697380?fit=crop&h=733&q=50&w=1100&s=8a1306695e56d97efbca205ad72293a21d5c7873",
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Melania_Trump_official_portrait.jpg/220px-Melania_Trump_official_portrait.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Queen_Silvia_of_Sweden%2C_June_8%2C_2013_%28cropped%29.jpg/320px-Queen_Silvia_of_Sweden%2C_June_8%2C_2013_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg/244px-Billie_Eilish_2019_by_Glenn_Francis_%28cropped%29_2.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Annie_L%C3%B6%C3%B6f_2019_%28cropped%29.jpg/225px-Annie_L%C3%B6%C3%B6f_2019_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/EBT_Almedalen_2018_%28cropped%29.jpg/225px-EBT_Almedalen_2018_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Queen_Elizabeth_II_March_2015.jpg/455px-Queen_Elizabeth_II_March_2015.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Katy_Perry_2019_by_Glenn_Francis.jpg/800px-Katy_Perry_2019_by_Glenn_Francis.jpg'
        ];
    this.womanNames = ['Ms. stock photo', 'Natalie', 'Emma', 'Melania', 'Silvia', 'Billie', 'Annie', 'Ebba', 'Elizabeth', 'Katy'];
    this.manPics = ['https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg',
		    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/250px-Donald_Trump_official_portrait.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Vladimir_Putin_%282020-02-20%29.jpg/473px-Vladimir_Putin_%282020-02-20%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Crafoord_Prize_D81_9141_%2842282165922%29_%28cropped%29.jpg/800px-Crafoord_Prize_D81_9141_%2842282165922%29_%28cropped%29.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kim_Jong_Un_with_Honor_Guard_portrait.jpg/800px-Kim_Jong_Un_with_Honor_Guard_portrait.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sabaton%2C_Joakim_Brod%C3%A9n_06.jpg/800px-Sabaton%2C_Joakim_Brod%C3%A9n_06.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/5/53/Pewdiepie_head_shot.jpg',
            'https://imgs.aftonbladet-cdn.se/v2/images/8bf7de5d-528b-454d-a71f-b2f9ac03a12c?fit=crop&h=638&q=50&w=844&s=6784bffa6f872f1d1738316669da90bf79694aa8'
        ];
    this.manNames = ['Bernie', 'Arnold', 'Keanu', 'Donald', 'Vladimir', 'Carl', 'Kim', 'Joakim', 'Felix', 'Bjorne'];
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

Data.prototype.sendDates = function() {
    for(let pair of this.pairs){
	console.log(pair);
	io.emit('setDate', {id: pair.man.id, date: pair.woman});
	io.emit('setDate', {id: pair.woman.id, date: pair.man});
	this.getProfile(pair.man.id).dates.push(pair.woman);//{name: pair.woman.name, image: pair.woman.image});
	this.getProfile(pair.woman.id).dates.push(pair.man);//{name: pair.man.name, image: pair.man.image});
    }
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
    socket.on('fillUp', function(id){

        let moreMen = 0; //Increase for each man, decrease for each woman.
        for (let profile of data.profiles){
            if(profile.isMan == 'true' || profile.isMan == true){
                moreMen++;
            }
            else{
                moreMen--;
            }
        }

        if(moreMen < 0){
            while(moreMen < 0){
                let newId = data.getId();
                let pic = data.manPics[newId % data.manPics.length];
                let name = data.manNames[newId % data.manNames.length];
                data.profiles.push({ name: name, id: newId.toString(), age:'40', answers: [], shares: ['1', '2', '3', '4', '5'], 
                                     matches: [], dates: [], previousDates: [], isMan: true, city: 'Uppsala', travel: 5, workout: 5, food: 5, mail: '', phone: '', completed: true, 
				     image: pic});
                moreMen++;
                data.numberOfUsersReady++;
	        data.idReady.push(newId);
            console.log("new user: " + name);
            }   
        }
        else {
            while(moreMen > 0){
                let newId = data.getId();
                let pic = data.womanPics[newId % data.womanPics.length];
                let name = data.womanNames[newId % data.womanNames.length];
                data.profiles.push({ name: name, id: newId.toString(), age:'30', answers: [], shares: ['1', '2', '3', '4', '5'], 
                                     matches: [], dates: [], previousDates: [], isMan: false, city: 'Uppsala', travel: 5, workout: 5, food: 5, mail: '', phone: '', completed: true, 
                image: pic});
                moreMen--;
                data.numberOfUsersReady++;
        	data.idReady.push(newId);
            console.log("new user: " + name);
            }   
        }
	io.emit('numberOfUsersReady', {number: data.numberOfUsersReady});
    });
    socket.on('profileToServer', function(editedProfile){
        for (let profile of data.profiles){
            if(profile.id == editedProfile.id) {
                editedProfile.matches = profile.matches;
                editedProfile.shares = profile.shares;
                editedProfile.previousDate = profile.previousDates;
                profile.name = editedProfile.name;
                profile.mail = editedProfile.mail;
                profile.phone = editedProfile.phone;
                profile.isMan = editedProfile.isMan;
                profile.city = editedProfile.city;
                profile.travel = editedProfile.travel;
                profile.workout = editedProfile.workout;
                profile.food = editedProfile.food;
                profile.completed = true;
                profile.age = editedProfile.age;
		if(profile.isMan == true || profile.isMan == 'true'){
            profile.image = "https://m.media-amazon.com/images/M/MV5BMTg1MjQ0MDg0Nl5BMl5BanBnXkFtZTcwNjYyNjI5Mg@@._V1_UY1200_CR88,0,630,1200_AL_.jpg";
            //data.manPics[profile.id%3];
		}
		else{
            profile.image = "https://upload.wikimedia.org/wikipedia/commons/d/d9/191125_Taylor_Swift_at_the_2019_American_Music_Awards.png";
            //data.womanPics[profile.id%3];
		}
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
    socket.on('startRoundToServer', function(nothing) {
	console.log(data.pairs);
	/*for(let pair of data.pairs){
	    console.log(pair);
	    io.emit('setDate', {id: pair.man.id, date: pair.woman});
	    io.emit('setDate', {id: pair.woman.id, date: pair.man});
	    }*/
	data.sendDates();
	io.emit('startRoundFromServer', {});
    });
    socket.on('quitDateToServer', function(data) {
	io.emit('quitDateFromServer', {});
    });
    socket.on('iWantId', function(nothin) {
        let newId = data.getId();
        io.emit('idFromServer', {id: newId});
        data.profiles.push({ name: '', id: newId.toString(), age:30, answers: [], shares: [], matches: [], dates: [], isMan: false, completed: false});
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
