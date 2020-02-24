const vm = new Vue({
    el: '#main_box',
    data: {
        person1: {
            name: 'John Doe',
            age: '41',
            email: 'jd@gmail.com'
        },
        person2: {
            name: 'John Doee',
            age: '42',
            email: 'jd2@gmail.com'
        },
        person3: {
            name: 'John Doeee',
            age: '43',
            email: 'jd3@gmail.com'
        },
        matches: [],
        selectedMatch
    },
    created: function () {
        this.matches = [this.person1, this.person2, this.person3];
    }
    
})
