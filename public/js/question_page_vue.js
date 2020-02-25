'use strict';
const socket = io();


const vm = new Vue({
    el: '#main_box',
    data: {
        questions: ['Did you enjoy the date?', 'Did you think the age gap was too big?','Did you find this match to be correct for you?'],
        overallRating: '5',
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '0',
        answerNumber: '1',
        triedSubmitting: false,
        currentDate: null,
        round: 0
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.round = data.round;
            console.log("question page: " + data.round);
        }.bind(this));
        socket.on('roundFromServer', function (data) {
            this.round = data.round;
        }.bind(this));
        this.answers = [this.overallRating].concat(this.answers);
    },
    methods: {
        incrementNumber: function() {
            if (this.questionNumber < 4) {
                let qn = this.questionNumber;
                qn++;
                this.questionNumber = qn;
            }
        },
        decrementNumber: function() {
            if (this.questionNumber > 0) {
                let qn = this.questionNumber;
                qn--;
                this.questionNumber = qn;

            }
        },
        addAnswer: function(ans) {
            this.answers[this.questionNumber] = ans;
            this.incrementNumber();
        },
        submitAnswers: function() {
            console.log(this.answers);
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                if(this.round >= 3){
                    window.location.href = "/share_info"; //Byta ut
                    this.questionsDone = true;
                }
                else{
                    socket.emit('roundToServer', this.round + 1)
                    window.location.assign("/show_info");
                    this.questionsDone = true;
                }

            }
            
        },
        setDate: function(name, age, match, table, img){
            let myDate = {name, age, match, table, img};
            this.currentDate = myDate;
        }
    }

})

vm.setDate("Johnny",78,62,"E12",'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Bernie_Sanders_July_2019_retouched.jpg/800px-Bernie_Sanders_July_2019_retouched.jpg');
console.log(vm.currentDate.img);
