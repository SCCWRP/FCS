//global
var isDevice = false;
var loginStatus = false;
var networkStatus;
var HOME = location.href;
var SESSIONID = +new Date;
var USERID;
var user;
$.ajax({
	url: "questions.json",
	dataType: 'json',
	async: false,
	success: function(qjson){
		//console.log("success");
		//global object
		questionObject = qjson;
		questionObject = questionObject.map(function(x) {
			x.title = x.title.replace("sevenDaysAgoFunction", "week");
			return x;
		});

		var idlist = [];
		for(i in qjson) {
			idlist.push(Number(qjson[i].id));
		};
		MAXQUESTION = Math.max.apply(null, idlist);
	},
	error: function () {/*console.log("error")*/}	
});
window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
