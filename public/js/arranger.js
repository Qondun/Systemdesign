'use strict';

const vm = new Vue({
    el: '#myID',
    data: {
      roundNumber: '1',
      ongoingRound: false,
      eventDone: false
    },
    methods: {
        startRound: function (){
            this.ongoingRound = true;
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