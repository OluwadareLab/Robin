
import * as nodemailer from 'nodemailer';
import config, { paths } from '../config.mjs';

var transporter = nodemailer.createTransport({
    service: config.emailServer,
    auth: {
      user: config.email,
      pass: config.emailPass
    }
    
  });


var mailOptions = {
    from: config.email,
    to: "mmfuller22@gmail.com",
    subject: `Your job, job #${1} ${config.projectName} has been completed..`,
    text: `you can view the results at: ${config.webPath}/${paths.results}${1}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });