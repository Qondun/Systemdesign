
const Algorithm  = new Vue({
    el: '#allMatches',
    data:{
        men: [],
        women: [],
        pairs: []
    },
    methods:{
        stdPair: function(){
            for(i = 0; i<this.men.length; i++){
                this.pairs.push(
                    {
                        man: this.men[i],
                        woman: this.women[i]
                    });
            }
        },
        addPerson: function(person, isMan){
            if(isMan){
                this.men.push(person);
            }
            else{
                this.women.push(person);
            }
        },
        printPairs: function(){
            for (var pair of this.pairs){
                console.log(pair.man.toString() + " - " + pair.woman.toString());
            } 
        },
        printPair: function(pair){
            return pair.man.toString() + " - " + pair.woman.toString();
        },
        testSetup: function(){
            this.addPerson("Anders", true); 
            this.addPerson("Karl", true);
            this.addPerson("Anna", false);
            this.addPerson("Elsa", false);
            
        }
    }
})


Algorithm.testSetup();
Algorithm.stdPair();
Algorithm.printPairs();
