'use strict';
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        questions: ['Did you enjoy the date?', 'Did you find the age difference to be good?', 'Did you find this match to be correct for you?'],
        overallRating: '5',
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '0',
        answerNumber: '1',
        triedSubmitting: false,
        dateAvailible: false,
        dates: [{ name: 'Johnny', age: '78', table: 'A12', match: 62, image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg' },
            { name: 'Arnold', age: '72', table: 'B3', match: 99, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg' },
            { name: 'Keanu', age: '55', table: 'C9', match: 88, image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg' }
        ],
        currentDate: null,
        done: false,
        okPressed: false,
        round: 1,
        showQuestions: false
    },
    created: function() {
        socket.on('initialize', function(data) {
            this.round = data.round;
        }.bind(this));
        socket.on('roundFromServer', function(data) {
            this.round = data.round;
        }.bind(this));
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
            this.answers[this.questionNumber - 1] = ans;
            this.incrementNumber();
        },
        submitAnswers: function() {
            console.log(this.answers);
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                if (this.round >= 3) {
                    window.location.href = "/share_info"; //Byta ut
                    this.questionsDone = true;
                } else {
                    socket.emit('roundToServer', this.round + 1)
                    window.location.assign("/show_info");
                    this.questionsDone = true;
                }

            }

        },
        okSubmit: function() {
            this.okPressed = true;
            console.log(this.round);
            setInterval(function() { vm.showQuestions = true }, 3000);
        },
        setDate: function(name, age, match, table, img) {
            let myDate = { name, age, match, table, img };
            this.currentDate = myDate;
            this.dateAvailible = true;
        },
        completeDate: function() {
            this.showQuestions = false;
            this.currentDate = null;
            this.dateAvailible = false;
            setTimeout(function() {
                let date = vm.dates[vm.round - 1];
                vm.setDate(date.name, date.age, date.match, date.table, date.image);
            }, 5000)
        }
    }
})


setInterval(vm.completeDate(), 50);