var express = require('express');
var router = express.Router();
let Food = require('../models/FoodModel');
let fs = require('fs');

router.get('/list_all_foods', (request, response, next) => {
    //response.end("GET requested => list_all_foods");
    Food.find({}).limit(100).sort({name:1}).select({
        name:1,
        foodDescription:1,
        created_date:1,
        status:1
    }).exec((err,foods)=>{
        if(err){
            response.json({
                result:'faild',
                data:[],
                messege:`Error is ${err}`
            })
        }else{
            response.json({
                result:'ok',
                data:foods,
                count:foods.length,
                messege:'Query list of foods successfully'
            })
        }
    })
});

router.get('/get_food_with_id',(request,response,next)=>{
    Food.findById(require('mongoose').Types.ObjectId(request.query.food_id),
        (err,food)=>{
            if(err){
                response.json({
                    result:'failed',
                    data:{},
                    messege:`Error is ${err}`
                });
            }else{
                response.json({
                    result:'ok',
                    data:food,
                    messege:'Query food by Id Succesfully'
                })
            }
        })
});
router.get('/list_foods_with_criteria',(request,response,next)=>{
    let criteria = {
        //name:new RegExp(request.query.name, 'i'),
        name: new RegExp('^'+request.query.name + '$','i'),
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    Food.find(criteria).limit(limit).sort({name:1}).select({
        name:1,
        foodDescription:1,
        created_date:1,
        status:1
    }).exec((err,foods)=>{
        if(err){
            response.json({
                result:'faild',
                data:[],
                messege:`Error is ${err}`
            })
        }else{
            response.json({
                result:'ok',
                data:{foods},
                count:foods.length,
                messege:"Query list foods successfulyy"
            })
        }
    })
});
router.post('/insert_new_food', (request, response, next) => {
    const newFood = new Food({
        name: request.body.name,
        foodDescription: request.body.foodDescription,
        imageUrl:request.body.imageUrl
    });
    newFood.save((err) => {
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
                    foodDescription: request.body.foodDescription,
                    imageUrl:request.body.imageUrl,
                    messege: "Insert new food successfully"
                }
            });
        }
    });
});
router.post('/upload_images', (request, response, next) => {
    let formidable = require('formidable');
    // parse a file upload
    var form = new formidable.IncomingForm();
    form.uploadDir = "./uploads";
    form.keepExtensions = true;
    form.maxFieldsSize = 10 * 1024 * 1024; //10 MB
    form.multiples = true;
    form.parse(request, (err, fields, files) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot upload images.Error is : ${err}`
            });
        }
        
        var arrayOfFiles = [];
        if(files[""] instanceof Array) {
            arrayOfFiles = files[""];
        } else {
            arrayOfFiles.push(files[""]);
        }
        
        if (arrayOfFiles.length > 0) {
            var fileNames = [];
            arrayOfFiles.forEach((eachFile)=> {
                 //fileNames.push(eachFile.path)
                fileNames.push(eachFile.path.split('\\')[1]);
            });
            response.json({
                result: "ok",
                data: fileNames,
                numberOfImages: fileNames.length,
                messege: "Upload images successfully"
            });
        } else {
            response.json({
                result: "failed",
                data: {},
                numberOfImages: 0,
                messege: "No images to upload !"
            });
        }
    });
});
router.get('/open_image', (request, response, next) => {
    let imageName = "uploads/" + request.query.image_name;
    fs.readFile(imageName, (err, imageData) => {
        if (err) {
            response.json({
                result: "failed",
                messege: `Cannot read image.Error is : ${err}`
            });
            return;
        }
        response.writeHead(200, {'Content-Type': 'image/jpeg'});
        response.end(imageData); // Send the file data to the browser.
    });
});
router.put('/update_a_food', (request, response, next) => {
    response.end("PUT requested => update_a_food");
});

router.delete('/delete_a_food', (request, response, next) => {
    response.end("DELETE requested => delete_a_food");
});
module.exports = router;