var AnswerListView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		//console.log("AnswerListView");
		//Start idle counter
		var that = this;
		$(document).ready(function () {
			var interval = setInterval(function(){that.idleCounter(that);}, 60000);
			$(document).mouseover(function(e) {
				that.idleTime = 0;
			});
			$(document).keypress(function(e) {
				that.idleTime = 0;
			});
		});
		// must unbind event before each question or will end up with wrong model
		// null out qhistory otherwise the object lingers
		this.qHistory = [];
		$(this.el).unbind("click");
		this.listenTo(this.model, 'sync', this.nextQuestion);
		this.listenTo(footerView, 'forward', this.saveAnswer); 
		this.listenTo(footerView, 'back', this.goBack); 
		this.listenTo(this.model, 'change:status', this.nextQuestion);
		this.listenTo(this.model, 'change:type', function() {
			if(["radio", "select"].indexOf(this.model.get('type')) >=  0) {
				$('#forward').hide();
			} else {
				$('#forward').show();
			};
			// Points of no-return
			if(this.model.get('qcount') == 12) {
				$("#back").css("visibility", "hidden");
			} else {
				$("#back").css("visibility", "visible");
			};
			// No saving until module 2 
			if(this.model.get('qcount') <= 13) {
				$("#restart").css("visibility", "hidden");
			} else {
				$("#restart").css("visibility", "visible");
			};
		});
		},
	events:{
		"click .save":"saveAnswer",
		"change select[name=aid]":"saveAnswer",
    		"click .decline":"declineAnswer",
    		"click #decline":"declineAnswer",
    		"change input[type=radio]":"saveAnswer",
		"keyup input[type=text]" : "processKeyup"
	},
	idleTime: 0,
	idleCounter: function(x) {
		x.idleTime = x.idleTime + 1;
		if(x.idleTime > 19 && x.model.get("qcount") > 13) {
			x.cleanup();
			location.reload();
		};
	},
	processKeyup: function(event) {
		if(event.keyCode == 13){
			this.saveAnswer(event);
		}
	},
	change:function(event){
		var that = this;
		//console.log("change");
		//console.log(event);
		that.nextQuestion();
	},
    	declineAnswer:function(event){
		formtype = this.model.get("type");
		this.saveAnswer(event, true);
	},
	qHistory: [],
	goBack: function(event){
		index = this.qHistory.pop();
		if(index) {
			this.model.set("qcount", index); 
			this.nextQuestion(this.model);
		} else {
			appRouter.navigate("");
		};
	},
	nextQuestion:function(t, response, options){	
		//console.log("nextQuestion");
		//console.log(this.model);
		//console.log(this.model.attributes);
		var val = this.model.validate(this.model.attributes);
		if(val){
			footerView.toggle("on");
			return;
		}
		var that = this;
		// get current question number
		var nextQcount = t.get("qcount");
	//	if(nextQcount > this.endquestion) return;
		// changed - to above for receipt
		//var nextQcount = response.qcount;
		////console.log(response.qcount);
     		var questionList = new QuestionList();
		questionList.fetch({success: getQuestion,error: errorQuestion});
		function getQuestion(){
			gotQuestion = questionList.get(nextQcount);
			var fixMenu = gotQuestion.attributes.menu.split(",")
			t.set({	'title': gotQuestion.attributes.title,
				'menu': fixMenu,
				'type': gotQuestion.attributes.type,
				'placeholder': gotQuestion.attributes.placeholder,
				'decline': gotQuestion.attributes.decline});
			questionListView = new QuestionListView({model: gotQuestion});
			questionListView.render();
			//updateProgressBar();
			//that.render();
			$("#content").append(that.render().el);
			updateProgressBar(t);
			appRouter.css();
			//$(window).scroll(appRouter.positionFooter).resize(appRouter.positionFooter)
		}
		function updateProgressBar(t){
			var modOne = 13;
			var modTwo =17;
			var modThree = 12;
			var modFour = 14;
			var modFive = 6;
			var modSix = 8;
			var nextQcount = t.get("qcount");
			if (nextQcount < 13) {
				$('#Modprogress-bar').val((nextQcount/modOne)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 13 && nextQcount <26){				
				$('#Modprogress-bar').val(((nextQcount-13)/modTwo)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 26 && nextQcount < 35){
				$('#Modprogress-bar').val(((nextQcount-26)/modThree)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 35 && nextQcount < 72){
				$('#Modprogress-bar').val(((nextQcount-35)/modFour)*100);
     				$('#Modprogress-bar').slider('refresh');
			}	
			if (nextQcount > 72 && nextQcount < MAXQUESTION){
				$('#Modprogress-bar').val(((nextQcount-72/modFive)*100));
     				$('#Modprogress-bar').slider('refresh');
			}	
			$('#Fullprogress-bar').val((nextQcount/MAXQUESTION)*100); 			
     			$('#Fullprogress-bar').slider('refresh');
		}
		function errorQuestion(model,response){
			//console.log(response);
		}
    	},
	selectorString: {
				"radio":"#aid input[type = 'radio']:checked",
				"text":"#aid",
				"select":"#aid",
				"multi":"#aid input[type = 'checkbox']:checked",
				"sevenday":"#aid input[type = 'checkbox']:checked",
				"numberSelect":"#aid",
				"dateSelect":"[id=aid]",
				"dateTimeInterval":"[id=aid]"
	},
	extractAnswer: function () {
		var currentAnswer = $(this.selectorString[formtype]); 
		if(formtype == "multi" || formtype == "sevenday") {
			var temparray = [];
			currentAnswer.map(function () { temparray.push(this.value); });
			currentAnswer = temparray.join();
		} else if(formtype == "numberSelect") {
			currentAnswer = $("select").val() + " : " + currentAnswer.val();
		} else if(formtype == "dateSelect") {
			var locations = currentAnswer.map(function(x) {return $(this).val() });
			var dates = $("[id=date]").map(function(x) {return $(this).attr("name")});
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = locations[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
		} else if(formtype == "dateTimeInterval") {
			currentAnswer = currentAnswer.map(function(x) {return $(this).val() });
			var start = currentAnswer.filter(function(x,i) {return x % 2 == 0});
			var end  = currentAnswer.filter(function(x,i) {return x % 2 != 0});
			var intervals = _.zip(start, end).map(function(x) {return x.join("-");});
			var dates = $("[id=date]").map(function(x) {return $(this).attr("name")});
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = intervals[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
		} else {
			currentAnswer = currentAnswer.val();	
		};
		if(!currentAnswer || currentAnswer == []) {
			currentAnswer = "";
		};
		//console.log("currentAnswer: "+ currentAnswer);
	 	return currentAnswer;	
		       },
	saveAnswer:function(event, decline, other){
		$("body").css("background-color", "gray");
		$("body").css("opacity", "0.5");
		var timer = 0;
		var appID;
		var that = this;
		formtype = this.model.get("type");
		// disable radio button double click
                if(formtype == "radio"){
		        $(".ui-radio").css("pointer-events", "none");
		}
		if(other) {
			var currentAnswer = other;
		} else if(!decline) {
			var currentAnswer = this.extractAnswer();
		} else {
			var currentAnswer = "Did not Enter";	
		};
		if(currentAnswer == "Other") {
			footerView.toggle("on");
			return;
		};
		// current question
		var currentQuestion = Number(this.model.get("qcount")); 
		appID = Number(this.model.get("id")); 
	

		// next question  
		var nextQuestion = (currentQuestion + 1);
		// storing userid email and phone
		// set userid for answer also
		//if(currentQuestion == 1){
		//	 this.cleanup();
		//	$("#content").html( new IntroView().render().el );
		//}
		if(currentQuestion == 1) {
			this.model.set({"user_id": USERID});
		};
		if(currentQuestion == 6 || currentQuestion == 7) {
			currentAnswer = currentAnswer.replace(/\W/g, '');
		};
		if(currentQuestion == 6){
			// CRITICAL - need to add error checking for existing user account
			user.save({ phone: currentAnswer }, {
				wait: true,
				success: function(response){
					//console.log(user.toJSON());
				},
				error: function(model, response){
				  if(response.status == 500){
					custom_alert("You are attempting to enroll with phone/email that is already been registered. If you have already completed enrollment please login instead. If you were unable to complete enrollment please wait 20 minutes and your incomplete enrollment will be removed from the system.", "", function() {loginView = new LoginView;});
				  }
				}
			});
			// maybe a better place to set userid-uid
			//this.model.set({"user_id": USERID}); //- moved to question1
			this.model.set("q7", currentAnswer);
		}
		if(currentQuestion == 8){
			// CRITICAL - need to add error checking for existing user account
			user.save({ email: currentAnswer }, {
				wait: true,
				success: function(response){
					//console.log(user.toJSON());
					//if device save to user key
					userPhoneEmail = '{"email":"'+user.get('email')+'","phone":"'+user.get('phone')+'","id":"'+USERID+'"}';
					var userKey = window.localStorage.getItem("user");
					// add to keychain
					if(userKey != null){
						userKey = ''+userKey+','+USERID+'';
						window.localStorage.setItem("user", userKey);
					} else {
					// new keychain
						window.localStorage.setItem("user", USERID);
					}
					window.localStorage.setItem("user-"+USERID, userPhoneEmail);
					// set userid in database and forms
				},
				error: function(response){
				  if(response.status == 500){
					custom_alert("You are attempting to enroll with phone/email that is already been registered. If you have already completed enrollment please login instead. If you were unable to complete enrollment please wait 20 minutes and your incomplete enrollment will be removed from the system.", "", function() {loginView = new LoginView;});
				  }
				}
			});
			this.model.set("q9", currentAnswer);
			//appRouter.navigate('shs2/receipt/' + appID, {trigger: true});
		}
		if(currentQuestion == 11){
			var setContact = this.model.get('contact');
			var setList = this.model.get('q10');
			user.save({ "contact": setContact, "list": setList, "status": "complete" });
		}
                // logic for skipping certain questions
		if([20, 23, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63].indexOf(currentQuestion) > -1  && currentAnswer == "No"){
			nextQuestion += 1;
		};
		if(currentQuestion == 63 && currentAnswer == "No" && _.all(_.map(this.model.pick('q35', 'q37', 'q39', 'q41', 'q43', 'q45', 'q47', 'q51', 'q53', 'q55', 'q57', 'q59', 'q61' ), function(x) {return x == 'No';}))) {
			nextQuestion += 6;	
		};
		// module3 did not surf
		if(currentQuestion == 26 && currentAnswer == "Did not Enter"){
			this.model.set({q27: null, q28: null, q29: null, q30: null, q31: null, q32: null, q33: null});
			nextQuestion +=  7;
		};
		// this should really go somewhere after sync happens maybe next question
		// also status needs to be toggled to complete in database
		if(currentQuestion == 13){
			user.save({ status: "complete" });
		};
		if(currentQuestion >=  this.endquestion){
			//console.log("endquestion: "+this.endquestion);
			/* user is finished with survey enrollment/weekly - record is complete */
			// code below should only happen once - edit mode will cause code to re-execute
			var current_status = this.model.get('status');
			if(current_status != "edit"){
				this.model.set({ status: "complete" });
				/* notify user if this is an enrollment */
				var survey_type = this.model.get('survey_type');
				if(survey_type == "enrollment"){
	                		var email = this.model.get('contact');
	                		var id = this.model.get('user_id');
					app.notify(email,id);
				}
			}
			/* set timer so after save the app goes to receipt */
			timer = 4;
		};
		// create answerDetails object
		answerDetails = {};
		answerDetails["q"+currentQuestion] = currentAnswer;
		this.model.set("q"+currentQuestion, currentAnswer);
		answerDetails.qcount = nextQuestion;
		// either set or save here
		//this.model.set(answerDetails, {validate:true});
		//if(timer != 0){ use this code if you want break up modules and then save
		// dump saved answers to json string 
		var parsedJSON = JSON.stringify(this.model.toJSON());
		this.model.save(answerDetails, {
				wait: false,
				success: function(model,response){
					//console.log("success");
					//console.log(model);
					if(that.qHistory.indexOf(currentQuestion) == -1)that.qHistory.push(currentQuestion);
					//appID = Number(this.model.get("id")); 
					// if module1 - then notify user 
					// ****** notify user - working code ********** //
					//var currentEmail = model.get("q8");
					//app.notify(currentEmail);
					// ******************************************** // 
					// last module - go to receipt
					if(timer == 4){
						// clear stage and events
						that.cleanup();
						// return receipt from database
						// check for ie9 or less - no receipt
						var ie = (function(){ 
							var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');				 
							while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
						       	return v > 4 ? v : undef;
					       	}());
						if(ie <= 9){
							custom_alert("Survey is Complete. Come Back Next Week", "", function() { 
								appRouter.navigate('/', {trigger: false});
								location.assign(HOME);
							});

						} else {
							networkStatus != "offline" ? appRouter.navigate('shs/receipt/' + appID, {trigger: true}) : (function () {appRouter.navigate('/', {trigger: true});location.assign(HOME);})();  
						}
					}
				},
				error: function(model,response){
				  if(response.status == 500){
					if(response.responseText.indexOf("SQLSTATE[23000]") !== -1){
						user.save({ status: "duplicate" });
						custom_alert("You are attempting to enroll with phone/email that is already been registered. Please attempt to login instead. If you continue to fail login please wait one hour and your incomplete enrollment will be removed from the system.", "", function() {
							that.cleanup();
							appRouter.navigate('/', {trigger: false});	
							location.assign(HOME);
						});
					} else {
						custom_alert("The application has encountered an error saving the most recent question. Your record has been saved up to the last question. Please re-login to finish the survey. The SHS team has been notified of the error.", "", function() {
							that.cleanup();
							appRouter.navigate('/', {trigger: false});	
							location.assign(HOME);
						});
					}
					// send sccwrp error message
					app.xhr_get('http://shs.sccwrp.org/shs2/mail-sccwrp.php',response.responseText).done(function(data) { /* console.log(data.answer); */ });
					//model.destroy({remote: false});
				  }
       				}
			});
			//console.log(this.model);
		$("body").css("background-color", "white");
		$("body").css("opacity", "1");
		}, /* end saveAnswer */
	cleanup: function() {
		//console.log("AnswerListView cleanup");
	        this.undelegateEvents();
		this.unbind();
		this.remove();
	},
	render: function(){
		//console.log("AnswerListView render");
		$(this.el).html("");
		$(headerView.el).show();
		$(footerView.el).show();
		$(this.el).html(this.template(this.model.toJSON()));
		$('input:checkbox[value="Other"]').on('change', function(s) {
			$('<div>').simpledialog2({
				mode: 'button',
		   		headerText: '',
		   		headerClose: true,
				buttonPrompt: 'Type your response',
				buttonInput: true,
				buttons : {
			  		'OK': {
				    		click: function () { 
							var name = $.mobile.sdLastInput;
							var i = "'" + name + "'";
						   	$("#aid").controlgroup("container").append('<input type="checkbox" value="' + name + '" id="id' + i + '"> <label for="id' + i + '">' + name + '</label>');
						   	$("#aid").trigger("create");
						   	$("input:checkbox[value="+i+"]").prop('checked', true).checkboxradio('refresh');
					   	}
			  		},
		   		}
	  		})
		});
		$('select').on('change', function(s) {
				var selectTarget = $(s.currentTarget);
				$("body").css("background-color", "white");
				$("body").css("opacity", "1");
				if(selectTarget.val() == "Other") {
					$('<div>').simpledialog2({
					    mode: 'button',
				   	    headerText: '',
				   	    headerClose: true,
				    	    buttonPrompt: 'Type your response',
				    	    buttonInput: true,
				    	    buttons : {
				          	'OK': {
					          click: function () { 
							var newoption = $.mobile.sdLastInput;
							$("select").append($("<option></option>").attr("value", newoption).text(newoption));
						       	selectTarget.val(newoption);
							selectTarget.trigger('change');
							}
						},
				    	   }
			 	 	})	
				};
			});
		//$('#multi-view').trigger('create');
		//$("input[type='checkbox']").checkboxradio();
		//$(this.el).trigger('create');
		//console.log(Math.round($('#content').height()));
		footerView.toggle("on");
		return this;
	}
});
