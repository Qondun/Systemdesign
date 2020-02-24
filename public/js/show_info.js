const vm = new Vue({
    el: '#main_box',
    data: {

        okPressed: false,
    },
    methods: {
        okSubmit: function() {
            this.okPressed = true;



        }
    }
})