var appRouter = new (Backbone.Router.extend({
  routes: {
    "fcs/": "start",
    "": "start"
  },
  question: function(){
	questionList = new QuestionList();
        questionList.fetch({ success: function(response){ /*console.log("questionList fetch - success");*/ questionList.getQuestion(); } });
  },
  start: function(){
	$("#content").html( new IntroView().render().el );
	appRouter.question();
	$("#landList").css("height", window.innerHeight);
  }
}));
var app = {
  dialog: function(message,title,button){
	function dialogCallback(){
		//custom_alert("dialogCallback closed");
	}
	if(isDevice == true){
		navigator.notification.alert(message, dialogCallback, title, button)	
	} else {
		alert(message);
	}
  },
  xhr_get: function(url,indata){
	return $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {generic: indata},
		crossDomain: true
		//beforeSend: loader
	})
	.always(function(){
		// loader
	})
	.fail(function(){
		// failures
	});
  },
  dataSyncCheck: function(da,dc,dt){
	// send autoid and captureid to see if record is in remote database
	//alert("dataSyncCheck autoid: "+ da);
	//alert("dataSyncCheck captureid: "+ dc);
	//alert("dataSyncCheck timestamp: "+ dt);
	// if the record is in database remove local record
	alert("dataSyncCheck");
        var url = 'http://data.sccwrp.org/sensor/check.php';
        message = $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/json",
                dataType: 'jsonp',
                data: {aa: da,cc: dc,tt: dt},
                crossDomain: true,
                timeout: 4000,
                error: function(x,t,m){
                         if(t==="timeout"){ alert("dataSyncCheck not Submitted"); }
                },
                success: function(data) {
			// first delete value
			var currentRecord = "sensor-keys-"+ dt +"-"+ dc;
			alert("Value to Delete: "+ currentRecord);
        		window.localStorage.removeItem(currentRecord);
			// second delete key from ring	
        		var prevStorage = window.localStorage.getItem("sensor-keys");
			// not a good idea - remove current key ring
       			//window.localStorage.removeItem("sensor-keys");
        		if (prevStorage != null){
	     			alert("Get Key Ring: " + prevStorage);
				// split key ring string into array
	     			var keysArray = prevStorage.split(',');
				alert("keysArray.length: "+ keysArray.length);
				// find key we want to delete
				var keyFind = keysArray.indexOf(currentRecord);
				if(keyFind != -1){
					alert("Key to Delete: "+ keyFind);
					// remove key from ring
					keysArray.splice(keyFind, 1);
					if(keysArray.length == 0){
						alert("keysArray is empty: "+ keysArray.length);
     						window.localStorage.removeItem("sensor-keys");
					} else {
						var newRing = keysArray.join();
						window.localStorage.setItem("sensor-keys", newRing);
					}
				} 
			}
                },
                complete: function(data) {
                        //alert("complete:"+data.key);
                }
        });
  },
  getId: function(id) {
    return document.querySelector(id);
  },
  showContent: function(s) {
    $("#log").html(s);
  },
  onFSSuccess: function(fs){
	alert("onFSSuccess");
	fileSystem = fs;
	fileSystem.root.getDirectory('org.sccwrp.fcs', {create: true},
		function(dirEntry) {
			alert("dirEntry");
			alert(timestamp);
			var timestampFile = ""+SESSIONID+".txt";
			alert(timestampFile);
			dirEntry.getFile(timestampFile, {create:true}, 
				function(f) {
					alert("getFile");
					f.createWriter(function(fileWriter){
						alert("fs.createWriter");
						fileWriter.onwrite = function(evt) {
		            				app.showContent("write to file");
		        			};
						fileWriter.write("my data");
					}, app.onError);
				}, app.onError);
		}, app.onError);
	//alert(fileSystem.name);
	//app.showContent("Got file system");
  },
  getById: function(id){
	return document.querySelector(id);
  },
  onError: function(e){
	var msg = '';
    	switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
          break;
          case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
	  break;
	  case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	  break;
	  case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	  break;
	  case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	  break;
	  default:
	      msg = 'Unknown Error';
	  break;
	};
      	alert('Error: ' + msg);
  },
  submitRemote: function(s,t){
     //alert("s:"+s);
     //function rsubmit(s){
	var url = 'http://data.sccwrp.org/sensor/load.php';
	message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {ss: s,tt: t},
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Data not Submitted"); }
		}, 
		success: function(data) {
			//alert("status:"+data.submit);
			//alert("autoid:"+data.autoid);
			//alert("captureid:"+data.captureid);
			//alert("apptime:"+data.capturetime);
			app.dataSyncCheck(data.autoid,data.captureid,data.apptime);
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
    	});
      //} 
      //rsubmit(s);
  },
  onDeviceReady: function(){
	//window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, app.onFSSuccess, app.onError);
 	// jquery cors support for phonega
	/*
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	*/
	// disable jquery mobile routing
	$.support.cors = true;
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
	//app.bindEvents();
	Backbone.history.start({pushState: true, hashChange: false});
	// check network status
 	networkStatus = navigator.onLine ? 'online' : 'offline';
	FastClick.attach(document.body);
	appRouter.start();
  },
  initialize: function(){
	if(document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1){
		isDevice = true;
	}
	if( isDevice ){
    		document.addEventListener("deviceready", function(){
			alert("isDevice deviceready");
			app.onDeviceReady();
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFSSuccess, app.onError);
		},true);
	} else {
		app.onDeviceReady();
	}
  }
};
app.initialize();
