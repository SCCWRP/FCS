var QuestionListView = Backbone.View.extend({
	el: '#header',
	template:_.template($('#tpl-question-details').html()),
	render: function(){
		$(this.el).html("");
		if(language == "Spanish"){
			var rawTitle = this.model.get("stitle");
		} else {
			var rawTitle = this.model.get("title");
		}
		//console.log(rawTitle);
		if(isDevice){
			$(this.el).html('<b id="fcsid">FCSID:'+fcsID+'</b>');	
		}
		$(this.el).append(this.template({"title": rawTitle}));	
	}
});
