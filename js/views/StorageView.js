var StorageView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-storage-details').html()),
	initialize: function(){
		alert("initialize StorageView");
		//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFSSuccess, app.onError);
		directoryLocation.getFile(timestampFile, {create:true}, this.fileAppend, app.onError);
	},
  	fileAppend: function(fs){
		//alert("fileAppend");
  		//alert(fs.fullPath);
		var localSave;
    		fs.createWriter(function(fileWriter) {
			//alert("fs.createWriter");
			fileWriter.onwrite = function(evt) {
		            app.showContent("fileAppend wrote to file");
		        };
			//go to the end of the file...
			fileWriter.seek(fileWriter.length);
			localSave = app.getLocalData("local","save"); 
			/*
			var prevStorage = window.localStorage.getItem("http://data.sccwrp.org/fcs/index.php/surveys");
	                //alert("prevStorage: "+prevStorage);
	                if (prevStorage != null){
				var keysArray = prevStorage.split(',');
				var currentKey; // currentKey = sessionid
				var loopNum=keysArray.length;
				//alert("Should loop " + loopNum + " times");
	     			for(var i=0; i<loopNum; i++){
		     			currentKey = keysArray.pop();
		     			//alert("currentKey: "+currentKey);
		     			var read =  window.localStorage.getItem("http://data.sccwrp.org/fcs/index.php/surveys" + currentKey);
					readString += read;
					//var readObj =  JSON.parse(window.localStorage.getItem("http://data.sccwrp.org/fcs/index.php/surveys" + currentKey));
					//fileWriter.write(readString);
					//alert(JSON.stringify(readObj));
					//var localSave = new Blob([read], {type: 'text/plain'});
					//fileWriter.write(localSave);
					//fileWriter.write(localSave);
				}
			}
			*/
			//alert("readObj: "+ localSave);
			var blob = new Blob([localSave], {type: "text/plain"});
			fileWriter.write(blob);
    		}, app.onError);
        },
	render: function(){
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Camera");
		$(this.el).html("");
		//$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
	}
});
