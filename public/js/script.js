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
                console.log("resp", resp.data);
                this.image = resp.data.image.image;
                this.username = resp.data.image.username;
                this.title = resp.data.image.title;
                this.description = resp.data.image.description;
                this.comments = resp.data.imageComments;
            });
        },
        methods: {
            commentPost: function(e) {
                e.preventDefault();
                let self = this; // This is because "this" looses its meaning when going inside something that its not the axios and in the then
                axios
                    .post("/comments", {
                        // this part add my comments to comments database
                        imageId: this.id,
                        comment: this.commentForm.comment,
                        username: this.commentForm.username
                    })
                    .then(function(resp) {
                        console.log(resp.data.results, self);
                        //  resp.data.results refers to what we res.json in app.post comments
                        self.comments.unshift(resp.data.results);
                        self.commentForm = {
                            comment: "",
                            username: ""
                        };
                    });
            },
            closeModal: function() {
                this.$emit("closemodal");
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

                    this.images.unshift(results.data.image);
                    this.form = {
                        username: "",
                        description: "",
                        title: ""
                    };
                    document.querySelector("input[type='file']").value = "";
                });
            },

            showModal: function(id) {
                console.log(id);
                this.selectedImage = id;
            },
            closeModalP: function() {
                this.selectedImage = null;
            },

            infiniteScroll: function() {
                var app = this;
                infiniteScroll();

                function infiniteScroll() {
                    console.log(
                        pageYOffset,
                        innerHeight,
                        document.body.scrollHeight
                    );
                    if (
                        pageYOffset + window.innerHeight >=
                        document.body.scrollHeight
                    ) {
                        axios
                            .get(
                                "/moreimages?id=" +
                                    app.images[app.images.length - 1].id
                            )
                            .then(response => {
                                app.images = app.images.concat(
                                    response.data.moreImages
                                );
                            });
                    } else {
                        setTimeout(infiniteScroll, 1000);
                    }
                }
            }
        },

        mounted: function() {
            axios.get("/images").then(results => {
                console.log("results", results);
                this.images = results.data.images;
            });
        },
        updated: function() {
            this.infiniteScroll();
        }
    });
})();

// when open a modal i set selectedImage to a value
// selectedImage: location.hash.slice(1) || null
// mounted(
// var app = this;
// window.addEventlistener("hashchange", function() {
//     app.selectedImage = location.hash.slice(1)
// })
// )
// set location.hash = "";
// <a v-bind:href="'#' + image.id" <img  v-bind:src="image.image" alt="" v-on:click="showModal(image.id) ">
