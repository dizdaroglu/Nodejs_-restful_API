var router = global.router;
let Movie = require('../models/MovieModel');
var mongoose = require('mongoose');
let fs = require('fs');

router.post('/insert_new_movie', (request, response, next) => {
    const newMovie = new Movie({
        name: request.body.name,
        MovieDescription: request.body.MovieDescription
    });
    newMovie.save((err) => {

        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: {
                    name: request.body.name,
                    MovieDescription: request.body.MovieDescription,
                    messege: "Insert new movie successfully",
                }
            });
        }
    });
});
router.get('/movies', (request, response, next) => {
    Movie.find({}).limit(100).sort({ name: 1 }).select({
        name: 1,
        MovieDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, movie) => {
        if (err) {
            response.json({
                result: 'failed',
                data: [],
                messege: `Error is: ${err}`,
            });
        } else {
            response.json({
                result: 'ok',
                data: movie,
                count: movie.length,
                messege: 'list of movies successfully'
            });
        }
    });
});
router.delete('/delete_movie/:id', (request, response, next) => {
    var id = request.params.id;

    Movie.findByIdAndRemove({ _id: id }, (err, delet) => {
        if (err) {
            response.json({
                result: 'failed',
                data: {},
                messege: `Error is ${err}`
            });
        } else {
            response.json({
                result: 'ok',
                data: delet,
                messege: 'Delete Movie successfully'
            });
        }
    })
})
module.exports = router;