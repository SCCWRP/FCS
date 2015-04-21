var ExitView = Backbone.View.extend({
	template:_.template($('#tpl-exit-details').html()),
	initialize: function(){
	},
    	events: {
		"click #exitCancel": "cancel",
		"click #exitRestart": "reload"
	},
    	cancel: function (e) { 
	  	$("#popupExit").popup("close");
		this.cleanup();
		answerListView.goBack();
		return;
	},
    	reload: function (e) { 
	  	$("#popupExit").popup("close");
		answerListView.saveExit();
	},
	cleanup: function() {
	        this.undelegateEvents();
	        this.$el.removeData().unbind();
	        Backbone.View.prototype.remove.call(this);
	},
	render: function(){
		$(this.el).html(this.template());	
		return this;
	}
});
