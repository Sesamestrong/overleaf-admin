const express = require("express");
require("dotenv").config();
const app = express();
const {
    runEntireScraper
} = require("@sesamestrong/json-scraper");

const overleaf=require("./overleaf.json");
//console.log(overleaf.steps.length);

//})().catch(err=>console.log(err.toString(),err.jsonData,err.stepNumber));
const shareWithEmail = ({
        invitee,
  projectName,
  template="none"
    }) =>
    runEntireScraper(overleaf, {
        username: process.env.EMAIL,
        password: process.env.PASSWORD,
        invitee,
        projectName,
        template,
    });
// Read the Certbot response from an environment variable; we'll set this later:
const letsEncryptReponse = process.env.CERTBOT_RESPONSE;
// Return the Let's Encrypt certbot response:
app.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send(letsEncryptReponse);
});

app.get("/", (req, res) =>res.send("API call is /:projectName/:email?template=none"));
app.get("/create/:projectName/:email", async (req, res) => {
    const {
        projectName,
        email
    } = req.params;
    const {
        template
    } = req.query;
    if (projectName && email) {
      if(email.match(process.env.ALLOWED_EMAILS)==null) return res.send({err:"Disallowed email."});
      try{
        const {expires}=await shareWithEmail({projectName,invitee:email,template});
        return res.send({expires});
      }
      catch(err){
        res.send({err:"I'm not telling what the error is, but rest assured that it's been logged."});
        console.log("ERROR:");
        if(err.jsonData){
        const {invitee,template,csrf,expires}=err.jsonData;
        console.log("Data:",invitee,template,csrf,expires);
        }
        console.log("Step index:",err.stepNumber);
        throw err;
      }
    }
    return res.send({
        err: "Must include project name and email"
    });
});
app.listen(process.env.PORT||3000);
