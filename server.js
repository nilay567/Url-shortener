const express = require('express') 

const app = express()
const PORT=3000
const cors=require("cors")
const BodyParser=require("body-parser")
const ShortUrl=require('./models/shortUrl')
const mongoose=require('mongoose') 
const {MongoClient}=require("mongodb")
mongoose.connect("mongodb+srv://nilayagrawal9:r2Yd8rbWFwpzmEkD@cluster0.us7ivsi.mongodb.net/urlShortener?retryWrites=true&w=majority",{
 
 useNewUrlParser:true,useUnifiedTopology:true

}).then(()=>console.log("mongodb connected "));

const Client =new MongoClient("mongodb+srv://nilayagrawal9:r2Yd8rbWFwpzmEkD@cluster0.us7ivsi.mongodb.net/urlShortener?retryWrites=true&w=majority")
app.set('view engine','ejs')

app.use(BodyParser.json())
app.use(BodyParser.urlencoded({extended:true}))
app.use(cors())

var collection
app.get("/search",async(request,response)=>{
 
 try{

  let result=await collection.aggregate([

   {

    "$search":{
       "autocomplete":{
            "query": `${request.query.term}`,
            "path":"full",
            
       }
    }

   }

  ]).toArray();
  response.send(result);
  

 }catch(e){
      response.status(500).send({message:e.message})
 }




}); 
app.get('/',async(req,res)=>{ 
      const shortUrls=await ShortUrl.find() 
      
      res.render('index',{shortUrls}) 
      
      
})

app.post('/shortUrls',async(req,res)=>{
      await ShortUrl.create({full : req.body.fullUrl })
      res.redirect('/')
})

app.get('/:shortUrl',async(req,res)=>{
      const shortUrl=await ShortUrl.findOne({short:req.params.shortUrl})

    if(shortUrl==null)return res.sendStatus(404)
     
   shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)

})






app.listen( PORT,async()=>{

 try{

  await Client.connect();
  collection=Client.db("urlShortener").collection("shorturls");
  console.log(`server started at port :${PORT}`)
 
 }catch(e){ 

 console.error(e)

 }

});

