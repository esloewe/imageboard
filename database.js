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
