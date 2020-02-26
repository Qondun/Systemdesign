const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        range1: '',
        range2: '',
        range3: '',
        submitted: false,
    },
    methods: {
        test: function(){
            if(confirm("Send info?")){
            console.log(this.fullname);
            window.location.assign('/user_menu');
            }
        }
    }
})
