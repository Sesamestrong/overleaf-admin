const express = require("express");
require("dotenv").config();
const app = express();
const {
    runEntireScraper
} = require("@sesamestrong/json-scraper");

const overleaf=require("./overleaf.json");
const share=require("./share.json");
//console.log(overleaf.steps.length);

//})().catch(err=>console.log(err.toString(),err.jsonData,err.stepNumber));
const createAndShare = ({
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
const shareWithEmail=({invitee,projectId})=>runEntireScraper(share,{email:invitee,project_id:projectId});
app.get("/", (req, res) =>res.sendFile(__dirname+"/index.html"));
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
        const {expires}=await createAndShare({projectName,invitee:email,template});
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
        err: "Must include projectName and email"
    });
});

app.get("/share/:projectId/:email",async (req,res)=>{
    const {projectId,email}=req.params;
    if(projectId&&email){
        if(email.match(process.env.ALLOWED_EMAILS)==null) return res.send({err:"Disallowed email."});
        try{
            const {expires}=await shareWithEmail({projectId,invitee:email});
            return res.send({expires});
        }
        catch(err){
            res.send({err:"I'm not telling what the error is, but rest assured that it's been logged."});
            console.log("SHARE ERROR:");
            if(err.jsonData){
            const {invitee,template,csrf,expires}=err.jsonData;
            console.log("Data:",invitee,template,csrf,expires);
            }
            console.log("Step index:",err.stepNumber);
            throw err;
        }
    }
    return res.send({err:"Must include projectId and email"});
});
app.listen(process.env.PORT||3000);
