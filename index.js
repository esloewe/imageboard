const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { getImages } = require("./database");
const config = require("./config");

const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));

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

    // const q = `SELECT * from IMAGES`;
    // db.query(q).then(results => {
    //     let images = results.rows;
    //     images.forEach(function(item) {
    //         let url = config.s3Url + item.image; // this gives me the amazon part of the url
    //         item.image = url;
    //     });
    //     res.json({ images: images });
    //     console.log(results.rows);
    // });
});

app.listen(8080, () => {
    console.log("listening");
});

// res.json({
//     images: results.rows
// });
//
// function requiringImages() {
//     getImages().then(function() {
//         results.rows.forEach(function(image) {
//             image.image = config.s3url + image.image;
//         });
//     });
// }
