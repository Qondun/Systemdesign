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

app.get('/question_page', function(req, res) {
    res.sendFile(path.join(__dirname, '/views/question_page.html'));

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
  this.pairs = {};
  this.round = 1;
  this.latestMatching = 0;
}

/*
  Adds an order to to the queue
*/
Data.prototype.getAllData = function() {
  /*return {
    pairs: this.pairs,
    round: this.round
  }*/
  return this;

};

Data.prototype.pairsToServer = function(pairs) {
  this.pairs = pairs;
};

Data.prototype.getAllPairs = function() {
  return this.pairs;
};

Data.prototype.roundToServer = function(round) {
  this.round = round;
};

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
});

/* eslint-disable-next-line no-unused-vars */
const server = http.listen(app.get('port'), function() {
    console.log('Server listening on port ' + app.get('port'));
});
