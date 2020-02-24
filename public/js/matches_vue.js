const vm = new Vue({
    el: '#main_box',
    data: {
        person1: ['John Doe', '40', 'jd@gmail.com', []],
        person2: ['John Doe2', '40', 'jd2@gmail.com', []],
        person3: ['John Doe', '40', 'jd@gmail.com', [this.person1, this.person2]],
    },
    methods: {
        test (){
            console.log(this.person3);
        }
    }
})
