const vm = new Vue({
    el: '#main_box',
    data: {
        fullname: '',
        city: '',
        range1: '',
        range2: '',
        range3: '',
        id: window.location.href.split("?id=")[1],
        submitted: false,
    },
    methods: {
        test: function(){
            if(confirm("Send info?")){
		console.log(this.fullname);
		window.location.href = '/user_menu?id='+this.id;
            //window.location.assign('/user_menu');
            }
        },
        goBack: function(){
            window.location.href = "/user_menu?id="+this.id;
        }
        
    }
})
