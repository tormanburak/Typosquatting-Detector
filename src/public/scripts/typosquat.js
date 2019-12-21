function getQueue(input){

	var str = input;
	//console.log(str);
	if(str.substring(0, 4) != "www." || str.charAt(str.length-4) != '.'){
	alertUser();
	return 0;
	}
	var list = [];
	list.push("http://www" + str.substring(4, str.length));
	//alert(list[0]);
	str = str.toLowerCase()
	var k = charOmission(str);
	list = list.concat(k);
	//console.log(list.toString());
	k = charSwapped(str);
	list = list.concat(k);
	k = duplicateChar(str);
	list = list.concat(k);
	k = adjacentKeyboard(str)
	list = list.concat(k);
	//console.log(list);
	return list;
	//run(list[0])
}
//method 2 of typosquatting. missing a character in the name.
function charOmission(str){
	//console.log("here")
	var charOmmited = new Set();
	var mod = str.substring(4, str.length-4);
	for (var i = 0; i <mod.length; i++) {
		k = mod.substring(0, i) + mod.substring(i+1, mod.length);
		charOmmited.add("http://"+k+ ".com");
		//console.log(k);

	}
	//console.log(charOmmited.length)
	return Array.from(charOmmited);
}

//charcter is swapped with the next charcater
function charSwapped(str){
	var charSwapped = new Set();
	var mod = str.substring(4, str.length-4);
	for (var i = 0; i <mod.length-2; i++) {
		var firstPart = mod.substring(0, i);
		var lastPart = mod.substring(i+2, mod.length);
		var k = firstPart + mod.charAt(i+1) + mod.charAt(i) + lastPart;
		if(k != mod){
			charSwapped.add("http://"+k+ ".com");
			//console.log(k);
		}



	}
	//console.log(charSwapped.length)
	return Array.from(charSwapped);
}
//duplicate characters
function duplicateChar(str){
	var dups = new Set();
	var levels = [ "qwertyuiop", "asdfghjkl", "zxcvbnm" ];
	var mod = str.substring(4, str.length-4);
	for (var i = 0; i <mod.length; i++) {
		var firstPart = mod.substring(0, i);
		var lastPart = mod.substring(i+1, mod.length);
		var k = firstPart + mod.charAt(i) + mod.charAt(i) + lastPart;
		dups.add("http://"+k+ ".com");

        for(var j = 0; j < 3; j++){
        			var level = levels[j];
        			if(level.includes(mod.charAt(i)+ "")){
        				var index = level.indexOf(mod.charAt(i)+"");
        				if(index-1<0){ //add replace with right
        					var k = firstPart + level.charAt(index-1) + mod.charAt(i) + lastPart
        					//var k = mod.replace(mod.charAt(i), level.charAt(index+1));
        					dups.add("http://"+k+ ".com");
        				}
        				else if(index+1>=level.length){
        					//var k = mod.replace(mod.charAt(i), level.charAt(index-1));
        					var k = firstPart + level.charAt(index+1) + mod.charAt(i) + lastPart
        					dups.add("http://"+k+ ".com");
        				}
        				else{
        					//var k = mod.replace(mod.charAt(i), level.charAt(index-1));
        					var k = firstPart + level.charAt(index-1) + mod.charAt(i) + lastPart
        					dups.add("http://"+k+ ".com");
        					//k = mod.replace(mod.charAt(i), level.charAt(index+1));
        					var k = firstPart + level.charAt(index+1) + mod.charAt(i) + lastPart
        					dups.add("http://"+k+ ".com");
        				}
        			}
        		}
		dups.add("http://"+k+ ".com");
		//console.log(dups);

	}
	return Array.from(dups);
}

function adjacentKeyboard(str){
	var levels = [ "qwertyuiop", "asdfghjkl", "zxcvbnm" ];

	var adj = new Set();
	var mod = str.substring(4, str.length-4);
	for (var i = 0; i <mod.length; i++) {
		for(var j = 0; j < 3; j++){
			var level = levels[j];
			if(level.includes(mod.charAt(i)+ "")){
				var index = level.indexOf(mod.charAt(i)+"");
				if(index-1<0){ //add replace with right
					var k = mod.substring(0, i) + level.charAt(index+1) + mod.substring(i+1, mod.length)
					//var k = mod.replace(mod.charAt(i), level.charAt(index+1));
					adj.add("http://"+k+ ".com");
				}
				else if(index+1>=level.length){
					//var k = mod.replace(mod.charAt(i), level.charAt(index-1));
					var k = mod.substring(0, i) + level.charAt(index+1) + mod.substring(i+1, mod.length)
					adj.add("http://"+k+ ".com");
				}
				else{
					//var k = mod.replace(mod.charAt(i), level.charAt(index-1));
					var k = mod.substring(0, i) + level.charAt(index-1) + mod.substring(i+1, mod.length)
					adj.add("http://"+k+ ".com");
					//k = mod.replace(mod.charAt(i), level.charAt(index+1));
					var k = mod.substring(0, i) + level.charAt(index+1) + mod.substring(i+1, mod.length)
					adj.add("http://"+k+ ".com");
				}
			}
		}

	}
	return Array.from(adj);
}
module.exports.getQueue = getQueue;
