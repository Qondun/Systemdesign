const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        range1: 3,
        range2: 3,
        range3: 3,
    },
    methods: {
        test (){
            console.log(this.range1);
            console.log(this.range2);
            console.log(this.range3);
        }
    }
})
