const crawler = require("./public/scripts/crawler.js");

var Queue = require('bee-queue');
var queue = new Queue('remotequeue',{
  redis:{
    host:'127.0.0.1',
    port:6379,
    db:0,
    options:{}
  },
  removeOnSuccess:true,
  removeOnFailure:true
});

var result = {
  list:[]
};
queue.on('ready', function () {
  queue.process(function (job,done){
      var crawledSite = crawler.run(job.data.domain);
      console.log("job id processing "+job.id);
      setTimeout(function(){
        done(null,crawledSite);
      },10);
  });
  console.log('processing jobs...');
});
