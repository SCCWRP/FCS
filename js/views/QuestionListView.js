var QuestionListView = Backbone.View.extend({
	el: '#header',
	template:_.template($('#tpl-question-details').html()),
	render: function(){
		//console.log("QuestionListView");
		$(this.el).html("");
		var rawTitle = this.model.get("title");
		var date = new Date();
		var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][(date.getDay()+1) % 7];
		var title = rawTitle.replace("sevenDaysAgoFunction", day);
		$(this.el).html(this.template({"title": title}));	
	}
});
