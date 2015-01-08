var QuestionListView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-question-details').html()),
	render: function(){
		console.log("QuestionListView");
		$(this.el).html("");
		var rawTitle = this.model.get("title");
		console.log(rawTitle);
		$(this.el).html(this.template({"title": rawTitle}));	
	}
});
