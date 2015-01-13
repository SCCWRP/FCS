var IntroView = Backbone.View.extend({
	//el: '#landing',
	template:_.template($('#tpl-intro-details').html()),
	initialize: function(){
	},
	events:{
		"click #startSurvey":"startSurvey",
		"click #deleteLocal":"deleteLocal",
		"click #saveLocal":"saveLocal",
		"click #saveLocalSD":"saveLocalSD",
		"click #showLocalSD":"showLocalSD",
		"click #submitLocal":"submitLocal",
		"click #submitLocalSD":"submitLocalSD",
		"click #showGPS":"getGPS",
		"click #showCamera":"getCamera"
	},
    	startSurvey: function(){
		this.cleanup();
		headerView = new HeaderView;
		$("#home").show();
		footerView = new FooterView;
	     	var questionList = new QuestionList();
	      	questionList.fetch({
			success: function(response){
				question = questionList.get(1);
				var type = question.attributes.type;
				questionListView = new QuestionListView({model: question});
				questionListView.render();
			},
			error: function(response){
				console.log("questionList Failed");
			}
		});		
     	},
	showContact: function(){
		headerView = new HeaderView;
		contactView = new ContactView;
	},
	getCamera: function(){
		alert("getCamera");
	     	function onSuccess(imageURI){
	        	var image = document.getElementById('myImage');
	         	image.src = imageURI;
	     	}
         	function onFail(message){
	       		alert("Failed because: "+ message);
	        }
	     	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
	},
  	getGPS: function(){
		alert("getGPS");
    		navigator.geolocation.getCurrentPosition(app.getGPSOnSuccess, app.getGPSOnFailure);
  	},
  	getGPSOnSuccess: function(position){
    		window.localStorage.setItem("current-latitude", position.coords.latitude);	
    		window.localStorage.setItem("current-longitude", position.coords.longitude);	
  	},
  	getGPSOnFailure: function(error){
		alert("code: "+ error.code);
		alert("message: "+ error.message);
  	},
	deleteLocal: function(){
	    	alert("deleteLocal");
	    	window.localStorage.clear();
	    	alert("Check: " + window.localStorage.getItem("sensor-keys"));
     	},
	saveLocal: function(){
    		alert("saveLocal");
    		var prevStorage = window.localStorage.getItem("fcs-keys");
    		var latitude = window.localStorage.getItem("current-latitude");
    		var longitude = window.localStorage.getItem("current-longitude");
    		if (prevStorage != null){
    			window.localStorage.setItem("fcs-keys", ""+ prevStorage +",fcs-keys-"+ SESSIONID +"-1,fcs-keys-"+ SESSIONID +"-2");
    		} else {
    			window.localStorage.setItem("fcs-keys","fcs-keys-"+ SESSIONID +"-1,fcs-keys-"+ SESSIONID +"-2");
    		} 
    		window.localStorage.setItem('fcs-keys-'+ SESSIONID +'-1', '{"id":"1","time":"14:34:56","ph":"4.5","orp":"234","do":"4.7","ec":"211μs","temp":"89","color":"4.5","lat":"'+latitude+'","lon":"'+longitude+'"}');
    		window.localStorage.setItem('fcs-keys-'+ SESSIONID +'-2', '{"id":"2","time":"09:03:23","ph":"3.0","orp":"450","do":"5.9","ec":"123μs","temp":"85","color":"2.1","lat":"'+latitude+'","lon":"'+longitude+'"}');
    		var currentStorage = window.localStorage.getItem("fcs-keys");
    		alert("Test pull on fcs-keys: "+ currentStorage);
  	},
	saveLocalSD: function(){
    		alert("saveLocalSD");
		headerView = new HeaderView;
		storageView = new StorageView;
  	},
	showLocalSD: function(){
    		alert("showLocalSD");
		headerView = new HeaderView;
		storageListView = new StorageListView;
  	},
	cleanup: function() {
		//console.log("IntroView cleanup");
	        this.undelegateEvents();
	        this.$el.removeData().unbind();
	        Backbone.View.prototype.remove.call(this);
	},
	render: function(){
		//console.log("introview render");
		/* clear the interface */
		$("#header").hide();
		//$("#landing").show();
		$(this.el).html(this.template());	
		$("#footer").hide();
		////console.log(jQuery("html").html());
		// code below is for devices taking too long to render
		// its ugly but it works
		if(isDevice){
		setTimeout(function() {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}, 0);
		} else {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}
		return this;
	}
});
