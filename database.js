const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db
        .query(`SELECT * FROM images ORDER BY created_at DESC`)
        .then(function(results) {
            return results.rows;
        });
};

exports.uploadsInDatabase = function(username, title, description, imageName) {
    return db
        .query(
            `INSERT INTO images (username, title, description, image) VALUES ($1, $2, $3, $4) RETURNING id`,
            [username, title, description, imageName]
        )
        .then(function(results) {
            return results.rows[0].id;
        });
};

exports.singleImage = function() {
    return db.query(`SELECT * FROM comments`).then(function(results) {
        return results.rows[0];
    });
};

exports.getImageById = function(id) {
    return db
        .query(`SELECT * FROM images WHERE id = $1`, [id])
        .then(function(results) {
            return results.rows[0];
        });
};

exports.addComment = function(image_id, comment, username) {
    return db
        .query(
            `INSERT INTO comments (image_id, comment, username) VALUES ($1, $2, $3)`,
            [image_id, comment, username]
        )
        .then(function(results) {
            return results.rows[0];
        });
};

exports.getComments = function(image_id) {
    return db
        .query(`SELECT * FROM comments WHERE image_id = $1`, [image_id])
        .then(function(results) {
            return results.rows;
        });
};
