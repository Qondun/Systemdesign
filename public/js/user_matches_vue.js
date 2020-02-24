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
        
        selectedName: '',
        selectedAge: '',
        selectedEmail: '',
        showMatch: false,
    },
    created: function () {
        this.matches = [this.person1, this.person2, this.person3];
    },
    methods: {
        selectMatch: function(match) {
            this.selectedName = match.name;
            this.selectedAge = match.age;
            this.selectedEmail = match.email;
            this.showMatch = true;
        },
        closeMatch: function() {
            this.showMatch = false;
        },
        copyText: function(id) {
            let test = document.querySelector(id);
            console.log(test);
            test.setAttribute('type', 'text');
            test.select();
            document.execCommand('copy');
            test.setAttribute('type', 'hidden')
            window.getSelection().removeAllRanges()
        }
    }
    
    
})
