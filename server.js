//Initiialise Morgan, Express and Body Parser , mongodb
var morgan=require('morgan');
var express=require('express');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

//Instantiate Express
var app = express();

//Instantiate Express Rouoter
var router=express.Router();

//Register Body Parser Middleware
app.use(bodyParser('{urlEncoded: true}'));
app.use(bodyParser.json());

//Register morgan middleware
app.use(morgan('dev'));

//Register express routing middleware
app.use('/',router);

//Connencting database
mongoose.connect('mongodb://localhost:27017/ProjectDB',function(err,db){
    if(err){
        console.log('error in connecting mongodb!! '+err);
    }else{
        console.log('connection to mongodb successfull');
    }
});

var Users=mongoose.model('Users',{
    Name: String,
    Username: String,
    Password: String
});

router.get('/dashboard',function(req,res){
    res.sendfile('index.html');
});

//API call to create a user
router.post('/createUser',function(req,res){
    Users.create({
        Name: req.body.Name,
        Username: req.body.Username,
        Password: req.body.Password
    },function(err,success){
        if(!err){
            res.send('User Created Successfully!');
        }
        else{
            res.send('Something went wrong :( '+err);
        }
    });
});

//API call to get all users
router.get('/getUsers',function(req,res){
    Users.find(function(err,response){
        if(!err){
            res.json(response);
        }
        else{
            res.send('Unable to query the DB');
        }
    });
});

//API call to get one user by ID
router.get('/getUserById/:id',function(req,res){
    Users.findOne({
        _id: req.params.id
    },function(err,response){
        if(!err){
            res.json(response);
        }
        else{
            res.send('unable to read from database');
        }
    });
});

//API call to update one user by id
router.put('/updateUser/:id',function(req,res){
    Users.update({
        _id: req.params.id,
        Name:req.body.Name,
        Username: req.body.Username,
        Password: req.body.Password
    },function(err,response){
        if(!err){
            res.send('user updated Successfully');
        }
        else{
            res.send('user could not be updated');
        }
    });
});

//API to deete a user
router.delete('/deleteUser/:id',function(req,res){
    Users.remove({
        _id: req.params.id
    },function(err,response){
        if(!err){
            res.send('User deleted Successfully');
        }
        else{
            res.send('Unable to delete user');
        }
    });
});

//API for user login
router.post('/authenticateUser',function(req,res){
   
});

//Start HTTp server at given port
app.listen(3000,function(err){
    if(!err){
        console.log('I am listening!');
    }else{
        console.log('Sometging went wrong');
    }
});