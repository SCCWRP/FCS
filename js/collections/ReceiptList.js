var ReceiptList = Backbone.Collection.extend({
	model: Receipt,
	url: 'http://data.sccwrp.org/fcs/index2.php/surveys'
});
