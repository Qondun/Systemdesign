'use strict';
const socket = io();

const Algorithm  = new Vue({
    el: '#allMatches',
    data:{
        men: [],
        women: [],
        pairs: [],
        umatchedMen: [],
        unmatchedWomen: [],
        newPairs: []
    },
    methods:{
        stdPair: function(){
            for(var i = 0; i<this.men.length; i++){
                this.pairs.push(
                    {
                        index: i,
                        man: this.men[i],
                        woman: this.women[i],
                        percentMatch: 99,
                        selected: false
                    });
            }
        },
        addPerson: function(person, isMan){
            if(isMan){
                this.men.push({
                   name: person,
                   picture: "https://reterdeen.com/wp-content/uploads/2019/10/arnold.jpg"
                });
            }
            else{
                this.women.push({
                   name: person,
                   picture: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                });
            }
        },
        printPairs: function(){
            for (var pair of this.pairs){
                console.log(pair.man.name + " - " + pair.woman.name);
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
            this.addPerson("Arnold", true);
            this.addPerson("Kamilla", false);
            
        },
        selectPair: function(index){
            this.pairs[index].selected = !this.pairs[index].selected;
            console.log(this.pairs[index].man.name + " - " + this.pairs[index].woman.name);
        }
        
    }
})


const btn = new Vue({
    el: '#nextButton',
    methods: {
        toRematch: function(){
            for(var pair of Algorithm.pairs){
                /*if(pair.selected){
                    Algorithm.umatchedMen.push(pair.man);
                    Algorithm.umatchedWomen.push(pair.woman);
                }*/
            }
            socket.emit('addOrder', 
            {pairs: Algorithm.pairs}
            )
        }
    }
})

Algorithm.testSetup();
Algorithm.stdPair();
