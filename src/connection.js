var mysql = require('mysql');
var async = require("async");
var con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ""
});
con.connect(function(err) {
  if (err) throw err;
});
//----------------------- RETURNING ALL DOMAINs----------------------------  For the startup of app.

var returnDomains = function (callback){
    var domains = [];
    var counter = 0 ;
    var resultObject = {};
    var key = "list";
    resultObject[key] = [];
    con.query("SELECT * FROM domain", function (err, result, rows) {
        if (err) throw err;
       for (var i = 0; i < result.length; i++) {
            var domainID = result[i].domainID;
                        var object = {
                            id:  result[i].domainID,
                            url: result[i].domainName,
                        };
                     resultObject[key].push(object);
            }
            callback(JSON.stringify(resultObject));
    });
}

//----------------------- RETURNING ALL DOMAIN  VARIANTS OF A DOMAIN---------------------------- Neeed to add specfic domain

var returnDomainVariants = function (givenID,callback){
var domains = [];
var counter = 0 ;
var resultObject = {};
var key = "list";
resultObject[key] = [];
  // GET all the variants of that domain
  var sql2;
  var sql1 = "SELECT * FROM domainVariants WHERE domainID = ?";
  con.query(sql1, givenID, function (err, result,row) {
    if (err) throw err;
        async.each(result, function (row, callback) {
            // GET all the images of the variant domain
            var domainVariantId =  row.domainVariantID;
            var domainVariantName = row.domainVariantName;
            var domainID2 = row.domainID;
            sql2 = "SELECT * FROM image WHERE foreignID = ?";
              con.query(sql2, domainVariantId, function (err, result2,row2) {
                  if (err) throw err;
                   if(result2.length > 0){
                     var object = {
                         id:  domainVariantId,
                         url: domainVariantName,
                         image: result2[0].img,
                         html: result2[0].html
                     };
                  resultObject[key].push(object);
                   }
              });
        });
        setTimeout(function(){
          callback(JSON.stringify(resultObject));
        },5000);
  });
}
var insertDomain = function(domain){
  var getSql = "SELECT domainID FROM domain WHERE domainName = ?";
  con.query(getSql,domain,function(err,result){
    if(err)throw err;
    if(result.length == 0){
      var sql = "INSERT INTO domain (domainName) VALUES (?)";
      con.query(sql,domain,function(err,result){
        if(err)throw err;
      });
    }
  });
}
var insertDomainVariant = function(domain,object){
  var domainID;
  var variant = object.url;
  var image = object.image;
  var html = JSON.stringify(object.html).replace(/[\u0800-\uFFFF]/g, '');
  var getDomainID = "SELECT domainID FROM domain WHERE domainName = ?";
  con.query(getDomainID,domain,function(err,result){
    if(err)throw err;
    domainID = result[0].domainID;
  });
  var getVariantID = "SELECT domainVariantID FROM domainVariants WHERE domainVariantName = ?"
  con.query(getVariantID,variant,function(err,result){
    if(err)throw err;
    if(result.length == 0){
      var insertVariant = "INSERT INTO domainVariants (domainVariantName,domainID) VALUES ('"+variant+"',"+domainID+")";
      con.query(insertVariant,function(err,result){
        if(err)throw err;
        con.query(getVariantID,variant,function(err,result){
          if(err)throw err;
          var foreignID = result[0].domainVariantID;
          var insertImage = "INSERT INTO image (img,foreignID,html) VALUES ('"+image+"',"+foreignID+","+html+")";
          con.query(insertImage,function(err,result){
            if(err)throw err;
          });
        });
      });
    }
  });
}


module.exports = {returnDomains ,returnDomainVariants,insertDomain,insertDomainVariant};
