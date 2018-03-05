const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

exports.getImages = function() {
    return db.query(`SELECT * FROM images`).then(function(results) {
        return results.rows;
        console.log(results);
    });
};

// SELECT * FROM images LIMIT 10
//     ORDER BY created_at DESC
