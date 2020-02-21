function user(name,age,email,number,matches){
    this.name = name;
    this.age = age;
    this.email = email;
    this.number = number;
    this.matches = matches;
}

let person1 = new user('John Doe', '40', 'jd@gmail.com', []);
console.log(person1.name);

const vm = new Vue({
    el: '#main_box',
    data: {
        person1: ''
    },
    methods: {
        createUser (name, age, email, number, matches) {
            
        }
    }
})
