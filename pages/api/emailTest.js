import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
export default async (req,res) => {
    try {

        var transporter = nodemailer.createTransport({
            host: "smtp.office365.com", // hostname
            secureConnection: true, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers:'SSLv3'
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PW
            }
            
        });

        let options = {
            from: 'Test Email <info@fruitiion.com>',
            to: 'mattnaf@gmail.com',
            subject: 'Test Email',
            html: generateEmailstring("Test Email", "Bob Sagget","Test sponsor message", ["This is the message 1", "this is the message 2"],[['www.nfl.com','View Deal →']])
          }
        
          await new Promise((resolve, reject) => {
              transporter.sendMail(options, function(error, info) {
                  if (error) {
                  console.log(error)
                  reject(error)
                  } else {
                  console.log("success")
                  resolve(info)
                  }
              })
          })
          res.status(200).json({result:'success'})
    } catch (e) {
        console.log('error')
        console.log(e)
        res.status(500).json({error:'error'})
    }
}