require("dotenv").config();
const {
    runEntireScraper
} = require("@sesamestrong/json-scraper");
(async () => {
    console.log(await runEntireScraper(require("./overleaf.json"), {
        username: process.env.EMAIL,
        password: process.env.PASSWORD,
        invitee: process.env.INVITEE,
        projectName: process.env.PROJECT_NAME,
        template: process.env.TEMPLATE || "none"
    }));
})().catch(err=>console.log(err.toString(),err.jsonData,err.stepNumber));
