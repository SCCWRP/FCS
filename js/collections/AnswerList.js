var AnswerList = Backbone.Collection.extend({
	initialize: function(){
        },
	model: Answer,
	url: 'http://fcs.sccwrp.org/fcs/index2.php/surveys'
});
