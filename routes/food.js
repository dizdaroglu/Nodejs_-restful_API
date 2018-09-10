var router = global.router;
let Food = require('../models/FoodModel');
var mongoose = require('mongoose');
let fs = require('fs');


router.get('/list_all_foods', (request, response, next) => {
    Food.find({}).limit(100).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                messege: "Query list of foods successfully"
            });
        }
    });
});
router.get('/get_food_with_id', (request, response, next) => {
    Food.findById(require('mongoose').Types.ObjectId(request.query.food_id),
        (err, food) => {
            if (err) {
                response.json({
                    result: "failed",
                    data: {},
                    messege: `Error is : ${err}`
                });
            } else {
                response.json({
                    result: "ok",
                    data: food,
                    messege: "Query food by Id successfully"
                });
            }
        });
});
router.get('/list_foods_with_criteria', (request, response, next) => {
    if (!request.query.name) {
        response.json({
            result: "failed",
            data: [],
            messege: "Input parameters is wrong!. 'name' must be not NULL"
        });
    }
    let criteria = {
        
        name: new RegExp('^' + request.query.name + '$', "i"),//"i" = case-insensitive
    };
    const limit = parseInt(request.query.limit) > 0 ? parseInt(request.query.limit) : 100;
    Food.find(criteria).limit(limit).sort({name: 1}).select({
        name: 1,
        foodDescription: 1,
        created_date: 1,
        status: 1
    }).exec((err, foods) => {
        if (err) {
            response.json({
                result: "failed",
                data: [],
                messege: `Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: foods,
                count: foods.length,
                messege: "Query list of foods successfully"
            });
        }
    });
});
router.post('/insert_new_food', (request, response, next) => {
    console.log(`request.body.name = ${request.body.name}`);
    const newFood = new Food({
        name: request.body.name,
        foodDescription: request.body.foodDescription
    });
    newFood.save((err) => {
        debugger;
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
                    messege: "Insert new food successfully"
                }
            });
        }
    });
});

router.put('/update_a_food', (request, response, next) => {
    let conditions = {};
    if (mongoose.Types.ObjectId.isValid(request.body.food_id) == true) {
        conditions._id = mongoose.Types.ObjectId(request.body.food_id);
    } else {
        response.json({
            result: "failed",
            data: {},
            messege: "You must enter food_id to update"
        });
    }
    let newValues = {};
    if (request.body.name && request.body.name.length > 2) {
        newValues.name = request.body.name;
    }
    //Update image
    if (request.body.image_name && request.body.image_name.length > 0) {
      
        const serverName = require("os").hostname();
        const serverPort = require("../app").settings.port;
        newValues.imageUrl = `${serverName}:${serverPort}/open_image?image_name=${request.body.image_name}`
    }
    const options = {
        new: true, 
        multi: true
    }
    if (mongoose.Types.ObjectId.isValid(request.body.category_id) == true) {
        newValues.categoryId = mongoose.Types.ObjectId(request.body.category_id);
    }
    Food.findOneAndUpdate(conditions, {$set: newValues}, options, (err, updatedFood) => {
        if (err) {
            response.json({
                result: "failed",
                data: {},
                messege: `Cannot update existing food.Error is : ${err}`
            });
        } else {
            response.json({
                result: "ok",
                data: updatedFood,
                messege: "Update food successfully"
            });
        }
        
    });
});
router.post('/upload_images', (request, response, next) => {
   
   
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

router.delete('/delete_a_food/:id', (request, response, next) => {
   var id = request.params.id;

   Food.findByIdAndRemove({_id:id}, (err,delet) => {
        if(err){
            response.json({
                result:"failed",
                data:{},
                messege:`Error is ${err}`
            });
        }else{
            response.json({
                result:'ok',
                data:delet,
                messege:'Delete Food successfully'
            });
        }
   })
  
}); 
module.exports = router;