const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        range1: 3,
        range2: 3,
        range3: 3,
        submitted: false
    },
    methods: {
        test (){
            this.submitted = true;
        }
    }
})
