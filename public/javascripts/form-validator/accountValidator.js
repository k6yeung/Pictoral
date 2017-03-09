
function AccountValidator()
{
// build array maps of the form inputs & control groups //

	this.formFields = [$('#signup-user'), $('#signup-pass1'), $('#signup-pass2'), $('#signup-email')]; 
	// this.controlGroups = [$('#name-cg'), $('#email-cg'), $('#user-cg'), $('#pass-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateName = function(s) //makes sure that the username is greater than 3 charaters
	{
		return s.length >= 3;
	};
	
	this.validatePassword = function(s) // makes sure that the password is longer than 6 charaters
	{
		return s.length >= 6;
	};

	this.validateSecondPassword = function(s,e) { //makes sure that the password matches the previous password that was entered
		return s === e;
	}
	
	this.validateEmail = function(e) 
	{
		// var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// return re.test(e);
		return true;
	};
	
	this.showErrors = function(a) //shows error messages when an error occurs
	{
		$('.modal-form-errors .modal-body p').text('Please correct the following problems :');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	};

}

AccountValidator.prototype.showInvalidEmail = function() //displays an error message to the user when the email is invalid 
{
	// this.controlGroups[1].addClass('error');
	this.showErrors(['That email address is already in use.']);
}

AccountValidator.prototype.showInvalidUserName = function() //displays an error message to the user when the username is invalid
{
	// this.controlGroups[2].addClass('error');
	this.showErrors(['That username is already in use.']);
}

AccountValidator.prototype.validateForm = function()  //this are all of the other errors that can occur
{
	var e = [];
	// for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
    if (this.validateName(this.formFields[0].val()) == false) { //when username is not 3 character or more
        // this.controlGroups[2].addClass('error');
        e.push('Username Should Be At Least 3 Characters');
    }
	if (this.validatePassword(this.formFields[1].val()) == false) { //when password is less than 6 characters
		// this.controlGroups[3].addClass('error');
		e.push('Password Should Be At Least 6 Characters');
	}
	if (this.validateSecondPassword(this.formFields[1].val(), this.formFields[2].val()) == false){ //when the retyped password does not match the password entered previously
		e.push('Both Passwords Do Not Match');
	}
    if (this.validateEmail(this.formFields[3].val()) == false) { 
        // this.controlGroups[1].addClass('error');
        e.push('Please Enter A Valid Email');
    }
	if (e.length) this.showErrors(e);
	return e.length === 0;
}

	