const vm = new Vue({
    el: '#main_box',
    data: {
        questions: ['Did you enjoy the date?', 'Did you think the age gap was too big?','Did you find this match to be correct for you?'],
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '1',
        answerNumber: '1',
        triedSubmitting: false,
        currentDate: null
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
            if (this.questionNumber > 1) {
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
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                console.log(this.answers);
                window.location.assign("/show_info");
                this.questionsDone = true;
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