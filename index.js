const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {
    getImages,
    uploadsInDatabase,
    singleImage,
    getImageById,
    addComment,
    getComments,
    getMoreImages
} = require("./database");
const config = require("./config");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
const s3 = require("./s3");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require("body-parser").json());

app.get("/images", (req, res) => {
    console.log("inside get request");

    getImages().then(results => {
        let images = results;
        images.forEach(function(item) {
            let url = config.s3Url + item.image; // this gives me the amazon part of the url
            item.image = url;
        });
        res.json({ images: images });
    });
});

app.get("/image/:imageId", (req, res) => {
    const imageId = req.params.imageId;
    Promise.all([getImageById(imageId), getComments(imageId)]).then(image => {
        image[0].image = config.s3Url + image[0].image;
        res.json({
            image: image[0],
            imageComments: image[1]
        });
    });
});

app.get("/moreimages", (req, res) => {
    getMoreImages(req.query.id).then(results => {
        console.log("testing for id", req.query.id);
        console.log("testing for IDDDD", results);

        let images = results;
        images.forEach(function(item) {
            let url = config.s3Url + item.image; // this gives me the amazon part of the url
            item.image = url;
        });
        if (!results.length) {
            res.sendStatus(500);
        } else {
            res.json({
                moreImages: images
            });
        }
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("inside post upload");
    // If nothing went wrong the file is already in the uploads directory

    if (req.file) {
        uploadsInDatabase(
            req.body.title,
            req.body.description,
            req.body.username,
            req.file.filename
        ).then(id => {
            res.json({
                image: {
                    title: req.body.title,
                    description: req.body.description,
                    username: req.body.username,
                    image: config.s3Url + req.file.filename,
                    id
                },

                success: true
            });
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/comments", (req, res) => {
    console.log("coment strgd", req.body);
    addComment(req.body.imageId, req.body.comment, req.body.username).then((
        results // when we are returning something from database or from select statememts and results can be called whatever i want
    ) => {
        console.log("results from database", results);
        res.json({
            results: results
        });
    });
});

app.listen(8080, () => {
    console.log("listening");
});
