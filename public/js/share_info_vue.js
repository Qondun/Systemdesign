const vm = new Vue({
    el: '#main_box',
    data: {
        dates: ['Johnny', 'Johnny', 'Johnny'],
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '1',
        answerNumber: '1',
        triedSubmitting: false
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
                this.questionsDone = true;
                window.location.assign("/user_menu");
            }

        }
    }

})
