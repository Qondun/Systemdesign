const vm = new Vue({
    el: '#myID',
    data: {
        qustionsDone: false,
        questionNumber: '1',
        questioning: true
    },
    methods: {
        startQuestioning: function() {
            this.questioning = true;

        },

        endQuestion: function() {
            let qn = this.qustionNumber;
            if (qn < 3) {
                qn++;
            } else {
                this.questionsDone = true;
            }
            this.questonNumber = qn;
        }
    }
})

document.getElementById("q_yes").addEventListener("click", startQuestioning);

var questioning = false;

function srartQuestioning() {
    if (questioning) return;
    if (this.questionNumber < 3) {
        return this.questionNumber;
    } else break;
}