
$(document).ready(function(){

    var lv = new LoginValidator();
    var lc = new LoginController();
    var av = new AccountValidator();
    var sc = new SignupController();

    // Login
    $('#login').ajaxForm({
        beforeSubmit : function(formData, jqForm, options){
            return lv.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') window.location.href = '/home';
        },
        error : function(e){
            lv.showLoginError('Login Failure', 'Please check your username and/or password');
        }
    });



    //Sign-Up
    $('#signup').ajaxForm({
        beforeSubmit : function(formData, jqForm, options){
            return av.validateForm();
        },
        success	: function(responseText, status, xhr, $form){
            if (status == 'success') $('.modal-alert').modal('show');
        },
        error : function(e){
            if (e.responseText == 'email-taken'){
                av.showInvalidEmail();
            }	else if (e.responseText == 'username-taken') {
                av.showInvalidUserName();
            }
        }
    });


// setup the alert that displays when an account is successfully created //

    $('.modal-alert').modal({ show:false, keyboard : false, backdrop : 'static' });
    $('.modal-alert .modal-header h4').text('Account Created!');
    $('.modal-alert .modal-body p').html('Your account has been created.</br>Click close to return to the login page.');




});
