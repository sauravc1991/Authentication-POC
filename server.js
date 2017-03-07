//Initiialise Morgan, Express and Body Parser
var morgan=require('morgan');
var express=require('express');
var bodyParser=require('body-parser');

//Instantiate Express
var app = express();

//Instantiate Express Rouoter
var router=express.Router();

//register Body Parser Middleware
app.use(bodyParser('{urlEncoded: true}'));
app.use(bodyParser.json());

//register morgan middleware
app.use(morgan('dev'));

//register express routing middleware
app.use('/',router);

router.get('/', function(req,res){
    res.sendfile('stacy.jpg');
});

//register routes
router.get('/verify',function(req,res){
    res.send('API is working');
});

//Unauthenticated routes
router.post('/login',function(req,res){
    var username=req.body.username;
    var pass=req.body.password;
    var token='supersecret';
    if(username=='Saurav' && pass=='1234'){
        res.json({"message": "success", "token": token});
    }
    else{
        res.json({"message": "authentication failed"});
    }
});

//Authentication Middleware
router.use(function(req, res,next){
    if(req.headers['x-access-token']=='supersecret'){
        next();
    }
    else{
        return res.json({"message": "Invalid token"});
    }
});

router.get('/data', function(req,res){
    var data =[{"name":"Saurav",
                "age":"25"},
                {"name":"Subho",
                "age":"22"
            },
            {"name":"Akash",
                "age":"22"}];

    res.json(data);
});


app.listen(3000,function(err){
    if(!err){
        console.log('I am listening!');
    }else{
        console.log('Sometging went wrong');
    }
});
