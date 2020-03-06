'use strict'
const socket = io();

const vm = new Vue({
    el: '#main_box',
    data: {
        dates: [{ name: 'Johnny',id: '1', age: '78', table: 'A12', match: 62, image: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Bernie_Sanders_July_2019_retouched.jpg'},
                { name: 'Arnold', id: '2', age: '72', table: 'B3', match: 99, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg/330px-Arnold_Schwarzenegger_by_Gage_Skidmore_4.jpg'},
                { name: 'Keanu', id: '3', age: '55', table: 'C9', match: 88, image: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg'}],
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        currentDate: null,
        questionNumber: 1,
        answerNumber: 1,
        triedSubmitting: false,
        id: window.location.href.split("?id=")[1]
    },
    methods: {
        incrementNumber: function() {
            if (this.questionNumber < 4) {
                let qn = this.questionNumber;
                qn++;
                this.questionNumber = qn;
                if(this.questionNumber <= 3){
                    this.currentDate = this.dates[qn-1];
                }
            }
        },
        decrementNumber: function() {
            if (this.questionNumber > 1) {
                let qn = this.questionNumber;
                qn--;
                this.questionNumber = qn;
                this.currentDate = this.dates[qn-1];
            }
        },
        addAnswer: function(ans) {
            this.answers[this.questionNumber - 1] = ans;
            this.incrementNumber();
        },
        submitAnswers: function() {
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                console.log(this.answers);
                socket.emit('sharesToServer','dummyProfile',this.answers);
                this.questionsDone = true;
                window.location.assign("/user_menu?id="+this.id);
            }

        }
    }

});

vm.currentDate = vm.dates[0];
