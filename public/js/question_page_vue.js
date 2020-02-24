const vm = new Vue({
    el: '#main_box',
    data: {
        overallRating: '5',
        questions: ['lorem ipsum1', 'lorem ipsum2', 'lorem ipsum3'],
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '0',
        answerNumber: '1',
        triedSubmitting: false
    },
    created: function () {
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
            this.answers[this.questionNumber - 1] = ans;
            this.incrementNumber();
        },
        submitAnswers: function() {
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                console.log(this.answers);
                this.questionsDone = true;
            }
            console.log(this.answers[0]);
        }
    }

})
