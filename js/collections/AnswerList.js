var AnswerList = Backbone.Collection.extend({
	initialize: function(){
        },
	model: Answer,
	url: 'http://data.sccwrp.org/fcs/index.php/surveys'
});
