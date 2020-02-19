'use strict';

const vm = new Vue({
    el: '#myID',
    data: {
      time: '00:00:00.000',
      roundNumber: '1',
      ongoingRound: false,
      eventDone: false
    },
    methods: {
        startRound: function (){
            this.ongoingRound = true;
            //start();
        },
        endRound: function(){
        let rn = this.roundNumber;
        if (rn < 3){
          rn++;
        }else{
          this.eventDone = true;
        }
        this.roundNumber = rn;
        this.ongoingRound = false;
      }
    }
})

document.getElementById("startRoundButton").addEventListener("click",start);

var timeBegan = null
, timeStopped = null
, stoppedDuration = 0
, started = null
, running = false;

function start() {
  if(running) return;
  
  if (timeBegan === null) {
    reset();
    timeBegan = new Date();
  }

  if (timeStopped !== null) {
    stoppedDuration += (new Date() - timeStopped);
  }

  started = setInterval(clockRunning, 10);	
  running = true;
}

function stop() {
  running = false;
  timeStopped = new Date();
  clearInterval(started);
}

function reset() {
  running = false;
  clearInterval(started);
  stoppedDuration = 0;
  timeBegan = null;
  timeStopped = null;
  vm.time = "00:00:00.000";
}

function clockRunning(){
  var currentTime = new Date()
  , timeElapsed = new Date(currentTime - timeBegan - stoppedDuration)
  , hour = timeElapsed.getUTCHours()
  , min = timeElapsed.getUTCMinutes()
  , sec = timeElapsed.getUTCSeconds()
  , ms = timeElapsed.getUTCMilliseconds();

  vm.time = 
    zeroPrefix(min, 2) + ":" + 
    zeroPrefix(sec, 2);
};

function zeroPrefix(num, digit) {
  var zero = '';
  for(var i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
}