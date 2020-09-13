require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const messageBird = require('messagebird')(process.env.LIVE);

app.engine('handlebars', expressHbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.use(bodyParser.urlencoded({extended:true}));

// Enter the Mobile Number

app.get('/',(req,res)=>{
    res.render('step1');
});

app.post('/step2',(req,res)=>{
    var number = req.body.number;

    messageBird.verify.create(number,{
        template:'Your verification code is %token'
    },(err,response)=>{
        if(err){
            console.log(err);
            res.render('step1',{
                error:err.errors[0].description
            });
        }else{
            console.log(response);
            res.render('step2',{
                id: response.id
            });
        }
    })
});

app.post('/step3',(req,res)=>{
    var id = req.body.id
    var token = req.body.token
    messageBird.verify.verify(id,token,(err,response)=>{
        if(err){
            res.render('step2',{
                error:err.errors[0].description,
                id:id
            });
        }else{
            res.render('step3');
        }
    })
})

// Starting the Server
app.listen(PORT,()=>{
    console.log(`Server is running on PORT:${PORT}`);
});

