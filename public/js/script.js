(function() {
    new Vue({
        el: "#main", //where our app will load. el means element in this case we chose an id
        data: {
            images: [],
            form: {
                // v-model stuff on html
                username: "",
                description: "",
                title: "",
                file: void 0 // this is the best way to set an empty value
            }
        },
        methods: {
            // functions in Vue belong in methods
            handleChange: function(e) {
                this.form.file = e.target.files[0];
                console.log(this);
            },
            handleSubmit: function(e) {
                e.preventDefault();
                const formData = new FormData();
                formData.append("file", this.form.file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);
                console.log("about to run post/upload");

                axios.post("/upload", formData).then(results => {
                    // results in axios is literally the stuff we res.json
                    console.log("upload worked", results);
                    this.images.unshift(results.data.image);

                    //reset all the values on the vmodel form set them to empty strings

                    // the image data will be in results data image
                    // unshift the new image into this.images by using the array method by adding to the beginning using unshift method
                });
            }
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
