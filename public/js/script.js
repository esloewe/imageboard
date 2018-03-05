(function() {
    new Vue({
        el: "#main", //where our app will load. el means element in this case we chose an id
        data: {
            images: [] //here is where we set up he model of our data
        },
        mounted: function() {
            axios.get("/images").then(results => {
                console.log("results", results);
                //attach this to out data
                this.images = results.data.images;
                //create a v-for, loop thhrough images and display
            });
        }
    });
})();
