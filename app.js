const express = require('express');
const nodemailer = require('nodemailer');
const bodyparser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars');
const { getMaxListeners } = require('process');

let app = express();

// view engine setup
app.engine('handlebars', exphbs({ extname: 'hbs', defaultLayout: false, layoutsDir: 'views/'}));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('contact')
});

var email;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        user: 'xyz@gmail.com', // Enter your email
        pass: 'xyz970'         // Enter your password
    }
});

let otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

app.post('/send', (req, res) => {

    console.log(req.body)

    email = req.body.email;

    // send mail with defined transport object
    let mailOptions = {
        to: email,
        subject: "OTP for registration is:",
        html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            return console.log(error)
        }

        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.render('otp');        
    })
});

app.post('/resend',function(req,res){
    var mailOptions={
       to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('otp',{msg:"otp has been sent"});
    });

});

app.post('/verify',function(req,res){

    if(req.body.otp==otp){
        res.send("You have been successfully registered!!!!!!!!!!!!!!!!!!");
    }
    else{
        res.render('otp',{msg : 'otp is incorrect'});
    }
});  

//defining port
const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Hello World')
})