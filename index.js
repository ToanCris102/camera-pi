const util = require("./util");

(async function(){
    await util.init();
    require("./socket.js");
})().then(()=>{
    console.log("Successfully loaded")
}).catch(err=>{
    console.log(err)
})