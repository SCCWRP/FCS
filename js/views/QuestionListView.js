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
			// get coordinates from model to make sure they have been saved
			var fcsIdSet = this.model.get("fcs_id");
			var latLonSet = this.model.get("coordinates");
			$(this.el).html('<b id="fcsid">FCSID:'+fcsIdSet+'</b><br><b id="latlonid">Lat/Lon:'+latLonSet+'</b>');	
		}
		$(this.el).append(this.template({"title": rawTitle}));	
	}
});
