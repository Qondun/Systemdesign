const vm = new Vue({
    el: '#main_box',
    data: {
        questions: ['lorem ipsum1', 'lorem ipsum2', 'lorem ipsum3'],
        answers: ['Not answered', 'Not answered', 'Not answered'],
        questionsDone: false,
        questionNumber: '1',
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
        addAnswerYes: function() {
            this.answers[this.questionNumber - 1] = "Yes";
        },
        addAnswerNo: function() {
            this.answers[this.questionNumber - 1] = "No";
        },
        submitAnswers: function() {
            this.triedSubmitting = true;
            if (!this.answers.includes('Not answered')) {
                console.log(this.answers);
                this.questionsDone = true;
            }

        }
    }

})