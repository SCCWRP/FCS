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
  onDeviceReady: function(){
 	// jquery cors support for phonegap
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
			app.onDeviceReady();
		},true);
	} else {
		app.onDeviceReady();
	}
  }
};
app.initialize();
