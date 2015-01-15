//global
var isDevice = false;
var loginStatus = false;
var networkStatus;
var HOME = location.href;
var SESSIONID = +new Date;
var USERID;
var user;
var fileSystem;
var directoryLocation;
var timestampFile;
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
var EventBus = _.extend({}, Backbone.Events);
function custom_alert(output_msg, title_msg, callback) {
	    if (!title_msg)
		    title_msg = '';

	    if (!output_msg)
		    output_msg = 'No Message to Display.';
	    
 	   $("<div id=popup>").simpledialog2({
       		mode: "blank",
		headerText: title_msg,
		headerClose: true,
		blankContent: "<p>" + output_msg + "</p>" + 
		   "<a rel='close' data-role='button' href='#'>Close</a>",
		callbackClose: callback 
		});		   
};

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
