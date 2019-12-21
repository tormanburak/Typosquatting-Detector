
//Burak Torman, www.buraktormandeveloper.com
let connectionFile = require ("./connection.js")
const typosquat = require("./public/scripts/typosquat.js");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Queue = require('bee-queue');
var app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

var queue = new Queue('remotequeue',{
  redis:{
    host:'127.0.0.1',
    port:6379,
    db:0,
    options:{}
  },
  isWorker:false
});

var typos = [];
var resultSet =[];
var variantSet=[];
var jobids = [];
app.post('/',function(req,res){
  var domain = req.body.domain;
  connectionFile.insertDomain(domain);
  typos = [];
  resultSet = [];
  variantSet = [];
   compute(domain);
   setTimeout(function(){
      res.send(JSON.stringify(resultSet));
      for(var i =0; i<jobids.length;i++){
        queue.removeJob(jobids[i], function (err) {
          if (!err) {
          }
        });
      }

      for(var i =0; i < variantSet.length;i++){
        connectionFile.insertDomainVariant(domain,variantSet[i]);
      }
      console.log("finished");
     }, 45000); //45sec max
});
function compute(domain){
  console.log("in compute");
  var ret = typosquat.getQueue(domain);
  console.log(ret);
  if(ret != 0){
    typos = ret;
    for(var i=0; i<typos.length;i++){
      var job = queue.createJob({
          domain:typos[i]
        });

        job.on('succeeded',function(result){
          var variant = JSON.parse(result);
          if(variant.html != -1 && variant.img != -1 && typos.includes(variant.url)){
            resultSet.push(result);
            variantSet.push(variant);
          }
        });
        job.save(function (err, job) {
          if (err) {
            console.log('job failed to save');
            return res.send('job failed to save');
          }
          console.log('saved job ' + job.id);
          jobids.push(job.id);
        });
    }
  }
}

//-----------------STARTUP-------------------------
app.post('/getDomains',function(req,res){
  var results ;
  connectionFile.returnDomains(function(data) {
     results = data;
  });
   setTimeout(function(){res.send(results)}, 1000);
})

//------------------------------------'-----------------

//----------------- Request DomainVariants----------------
app.post('/getDomainVariants',function(req,res){
  var domainID = req.body.domain;
  var results ;
  connectionFile.returnDomainVariants(domainID,function(data) {
     results = data;
  });
   setTimeout(function(){
     res.send(results)
   }, 5100);
});


//--------------------------------------------------------

app.listen(3005);
