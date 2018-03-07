(function() {
    Vue.component("single-image", {
        //child of main
        props: ["id"],
        data: function() {
            return {
                image: "",
                username: "",
                title: "",
                description: "",
                comments: [],
                commentForm: {
                    comment: "",
                    username: ""
                }
            };
        },
        template: "#modal",

        mounted: function() {
            //this get route should also return the comments associated with this image
            axios.get("/image/" + this.id).then(resp => {
                this.image = resp.data.image.image;
                this.username = resp.data.image.username;
                this.title = resp.data.image.title;
                this.description = resp.data.image.description;
                this.comments;
            });
        },
        methods: {
            commentPost: function(e) {
                e.preventDefault();
                axios
                    .post("/comments", {
                        // this part add my comments to comments database
                        imageId: this.id,
                        comment: this.commentForm.comment,
                        username: this.commentForm.username
                    })
                    .then(function() {
                        //we need to work on this partttt
                        // this.comments.unshift(this.comments);
                    });
            }
        }
    });

    new Vue({
        el: "#main", //where our app will load. el means element in this case we chose an id - parent
        data: {
            images: [],
            selectedImage: null,
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
                    this.form = "";
                });
            },

            showModal: function(id) {
                console.log(id);
                this.selectedImage = id;
            }
        },
        mounted: function() {
            axios.get("/images").then(results => {
                console.log("results", results);
                this.images = results.data.images;
            });
        }
    });
})();
