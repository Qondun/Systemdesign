'use strict';
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        questions: ['Overall rating?', 'Did you enjoy the date?', 'Did you think the age gap was too big?','Did you find this match to be correct for you?', "Comments?"],
        overallRating: '5',
        answers: {rating: 5, a1: 'Not answered', a2: 'Not answered', a3: 'Not answered', comment: ''},
        questionsDone: false,
        questionsDone: false,
        questionNumber: 0,
        answerNumber: '1',
        triedSubmitting: false,
        dateAvailible: false,
        dates: [{ name: 'Johnny', age: '78', table: 'A12', match: 62, image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg'},
                { name: 'Arnold', age: '72', table: 'B3', match: 99, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg'},
                { name: 'Keanu', age: '55', table: 'C9', match: 88, image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg'}],
        currentDate: null,
        done: false,
        okPressed: false,
        round: 1,
        showQuestions: false
    },
    created: function () {
        socket.on('initialize', function (data) {
            this.round = data.round;
        }.bind(this));
        socket.on('roundFromServer', function (data) {
            this.round = data.round;
        }.bind(this));
    },
    methods: {
            incrementNumber: function() {
            if (this.questionNumber < this.questions.length) {
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
            switch(this.questionNumber){
            case 0:
                this.answers.rating = ans;
                break;
            case 1:
                this.answers.a1 = ans;
                break;
            case 2:
                this.answers.a2 = ans;
                break;
            case 3:
                this.answers.a3 = ans;
                break;
            default:
                this.answers.comment = ans;
                break;
            }
            this.answers[this.questionNumber - 1] = ans;
            this.incrementNumber();
        },
        submitAnswers: function() {
            console.log(this.answers);
            this.triedSubmitting = true;
            for(var i = 0; i < this.questions.length; i++){
                console.log(i);
                if(this.getAnswer(i) == 'Not answered') {
                    return;
                }
            }
            this.questionsDone = true;
            if(this.round >= 3){
                window.location.href = "/share_info"; //Byta ut
            }
            else{
                socket.emit('roundToServer', this.round + 1)
                window.location.assign("/show_info");
            }
        },
        okSubmit: function() {
            this.okPressed = true;
            console.log(this.round);
            setInterval(function() { vm.showQuestions = true }, 3000);
        },
        setDate: function(name, age, match, table, img){
            let myDate = {name, age, match, table, img};
            this.currentDate = myDate;
            this.dateAvailible = true;
        },
        completeDate: function(){
            this.showQuestions = false;
            this.currentDate = null;
            this.dateAvailible = false;
            setTimeout(function(){
                let date = vm.dates[vm.round-1];
                vm.setDate(date.name,date.age,date.match,date.table,date.image);
            },5000)
        },
        getAnswer: function(i){
            switch(i){
            case 0:
                return this.answers.rating;
                break;
            case 1:
                return this.answers.a1;
                break;
            case 2:
                return this.answers.a2;
                break;
            case 3:
                return this.answers.a3;
                break;
            default:
                return this.answers.comment;
                break;
            }
        }
    }
})


setInterval(vm.completeDate(),50);
