const express = require('express')
var cors = require('cors')
const axios = require('axios')
require('dotenv').config(); 
const bodyParser = require("body-parser");

var token = process.env.WHATSAPP_TOKEN;
var _configs;
var businessPhoneNumberId = "115611391531993"; // 90810 00757 
const app = express()
const port = 4000

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
app.use(bodyParser.json());
app.get('/Test', (req, res) => {
  res.send('Hello World! '+ new Date())
})

app.post('/SendInvoiceToCustomer_WhatsAppAPI', (request, response, next) => {

  ////https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/media-message-templates
  console.log("LOG - SendInvoiceToCustomer_WhatsAppAPI")
  console.log(request.body)
  /* 
   {
    "phonenumber": "", 
    "link": "",
    "caption": "",
    "filename": "",
     "name": ""
}
  */
  let customerDetails = request.body;

  let data = {
    "messaging_product": "whatsapp",
    "to": customerDetails.phonenumber,
    "type": "template",
    "template": {
      "name": "sendinvoice_template",
      "language": {
        "code": "en_US"
      },
      "components": [
           {
          "type": "header",
          "parameters": [
            {
              "type": "document",
              "document": {
                "link": customerDetails.link,
                "filename": customerDetails.filename
              }
            }
          ]
        },
        {
          "type": "body",
          "parameters": [
            {
              "type": "text",
              "text": customerDetails.name
            }
          ]
        }
      ]
    }
  }

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: process.env.FB_WHATSAPP_CLOUD_API + "/" + businessPhoneNumberId + "/messages?access_token=" + token,
    data: data,
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    console.log("Success");
    response.sendStatus(200);
    //console.log(response.data);
  }, (error) => {
    console.log("Error");
    console.log(error);
  });;

})

 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})