var IntroView = Backbone.View.extend({
	//el: '#landing',
	template:_.template($('#tpl-intro-details').html()),
	initialize: function(){
	},
	events:{
		"click #startSurvey":"startSurvey",
		"click #submitData":"submitData",
		"click #getUtilities":"getUtilities"
	},
    	getUtilities: function(){
		$("#content").html( new UtilitiesView().render().el );
     	},
    	startSurvey: function(){
  		var prevStorage = window.localStorage.getItem("http://data.sccwrp.org/fcs/index.php/surveys");
		if(prevStorage){
			/* get last key */
			// turn string into array
			var prevArray = prevStorage.split(',');
			var locateLastKey = prevArray[prevArray.length-1];
			/* turn last key into object */
     			var lastKey = JSON.parse(window.localStorage.getItem("http://data.sccwrp.org/fcs/index.php/surveys" + locateLastKey));
			/* is current key null */
			if(lastKey.fcs_id){
				if(isDevice){
					/* get the id number from end of fcs_id and auto increment */
					var prevKeyArray = lastKey.fcs_id.split('-');
					var prevKeyCount = (Number(prevKeyArray[1]) + 1);
					var fcsID = prevKeyArray[0] + "-" + prevKeyCount;
				} else {
					var fcsID = SESSIONID + "-1";
				}
			} else {
				alert("no fcs_id key");
			}
		} else {
			/* first time data is stored locally */
			if(isDevice){
				//var fcsID = device.uuid + "-1";
				var fcsID = fieldDevice + "-1";
			} else {
				var fcsID = SESSIONID + "-1";
			}
		}
		alert(fcsID);
		this.cleanup();
		headerView = new HeaderView;
		$("#home").show();
		footerView = new FooterView;
		/* set version */
		var deviceType = navigator.userAgent + "-v.0.0.1";
		/* get last id */
	     	var questionList = new QuestionList();
		answerList = new AnswerList();
		var answerCreate = answerList.create({qcount: 1, timestamp: SESSIONID, picture_url: null, device_type: deviceType, fcs_id: fcsID, coordinates: latlon}, {
			success: function(response){
				var answer = answerList.get(response.id);
				answerListView = new AnswerListView({model: answer });
				answerListView.endquestion = MAXQUESTION;
			},
		    	error: function(model, response){
				console.log(response.responseText);
				console.log(response.status);
				console.log(response.statusText);
			}
		});
     	},
	submitData: function(){
		alert("submitData");
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getDirectory('org.sccwrp.fcs', {}, function(dirEntry){
				var dirReader = dirEntry.createReader();
				dirReader.readEntries(function(entries){
					for(var i = 0; i < entries.length; i++){
						var entry = entries[i];
						if(entry.isFile){
							//alert("File: "+entry.fullPath);
							//uploadFile(entry.fullPath);
							uploadFile(entry.name);
						}
					}
				}, app.onError);
			}, app.onError);
		}, app.onError);
		function uploadFile(f){
		//alert("uploadFile: "+f);
		//appRouter.dirty();
    		//var fileURL = "file:///storage/sdcard0/org.sccwrp.fcs/survey.txt";
    		//var fileURL = "file:///storage/sdcard0/org.sccwrp.fcs/"+f;
		var dirURL = "cdvfile://localhost/persistent/org.sccwrp.fcs/";
		var fileURL = f.fullPath;
    		function win(r){
	    		//alert(r); //alert("Code = " + r.responseCode); //alert("Response = " + r.response); //alert("Sent = " + r.bytesSent);
    		}
    		function fail(error){
    			alert("An error has occurred: Code = " + error.code);
    			alert("upload error source " + error.source);
    			alert("upload error target " + error.target);
    		}

    		var uri = encodeURI("http://data.sccwrp.org/fcs/upload.php");
    		var options = new FileUploadOptions();
    		options.fileKey = "file";
    		options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
    		//options.mimeType = "text/plain";
    		options.mimeType = "image/jpeg";
		
    		var headers={'headerParam':'headerValue'};
    		options.headers = headers;

    		var ft = new FileTransfer();
    		ft.onprogress = function(progressEvent){
		  if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			app.showContent("Uploading file: "+ perc + "% loaded...");
		  } else {
		  }
    		}
		finalURL = dirURL + options.fileName;
		ft.upload(finalURL, uri, win, fail, options);
    		//ft.upload(fileURL, uri, win, fail, options);
		}
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
