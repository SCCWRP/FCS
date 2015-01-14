var StorageView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-storage-details').html()),
	initialize: function(){
		alert("initialize StorageView");
		//window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFSSuccess, app.onError);
		directoryLocation.getFile(timestampFile, {create:false}, this.fileAppend, app.onError);
	},
  	fileAppend: function(fs){
		alert("fileAppend");
  		alert(fs.fullPath);
    		fs.createWriter(function(fileWriter) {
			alert("fs.createWriter");
			fileWriter.onwrite = function(evt) {
		            app.showContent("fileAppend wrote to file");
		        };
			//go to the end of the file...
			//fileWriter.seek(fileWriter.length);
			//get local data to store
			var tmpSave = app.getLocalData("local","save");
			var localSave = JSON.stringify(tmpSave);
			alert(localSave);
			//fileWriter.write(localSave);
			//fileWriter.write("test");
			//var localSave = new Blob(['this is a test emergency'], {type: 'text/plain'});
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
