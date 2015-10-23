var defT1 = "Main Argument";
var defT2 = "Extra Info";



$(function () {
    $('#dialog_register').dialog({
        autoOpen: false,
        width: 250,
        height: 275
    });

    $('#dialog_login').dialog({
        autoOpen: false,
        width: 250,
        height: 250
    });

    
});

$(document).on('click', '#register_button', function () {
    $('#register_username').val('');
    $('#register_email').val('');
    $('#register_password').val('');
    $('#dialog_register').dialog('open');
});

$(document).on('click', '#login_button', function () {
    $('#login_email').val('');
    $('#login_password').val('');
    $('#dialog_login').dialog('open');
});

$(document).on('click', '.dialog_cancel', function () {
    $(this).parent().dialog('close');
});

$(document).on('click', '.dialog_register', function () {
    var ref = new Firebase('https://discpoll.firebaseio.com/');
    ref.createUser({
        email: $('#register_email').val(),
        password: $('#register_password').val()
    }, function (error, userData) {      
        if (error) {
            console.log("Error creating user:", error);
        }
        else {
            console.log("Successfully created user account with uid:", userData.uid);
            var newRef = new Firebase('https://discpoll.firebaseio.com/Users');
            newRef.on('value', function (snapshot) {
                var data = snapshot.val();
                console.log('test');
                data[userData.uid] = { 'username': $('#register_username').val() };
                newRef.set(data);
                newRef.off();
            });
        }
    });
    
    $(this).parent().dialog('close');
});

$(document).on('click', '#logout_button', function () {
    var ref = new Firebase('https://discpoll.firebaseio.com/');
    ref.unauth();
});

$(document).on('click', '.dialog_login', function () {
    var ref = new Firebase('https://discpoll.firebaseio.com/');
    ref.authWithPassword({
        email: $('#login_email').val(),
        password: $('#login_password').val()
    }, function (error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });

    $(this).parent().dialog('close');
});

$('.poll_arg').css({ 'display': 'block' });

var argIndex = 3;
var toggle2 = false;
var toggle = false;
$(document).on("mouseover", '.poll_arg', function () {
    $(this).find('.extra_arg_info_txt').stop(true).slideDown(400);
});

$(document).on("mouseout", '.poll_arg', function () {
    if (toggle2 == false)
        $(this).find('.extra_arg_info_txt').stop(true).slideUp(400);
});

$(document).on("mouseenter", '.add_arg', function () {
    $(this).find('.arg_add_info_container').stop(true, true).toggle('slide', { direction: 'left' }, 400);
});

$(document).on("mouseleave", '.add_arg', function () {
    $(this).find('.arg_add_info_container').stop(true, true).toggle('slide', { direction: 'left' }, 400);
});

$(document).on("mouseenter", 'footer', function () {
    $(this).find('#footer_contents').stop(true, true).animate({
        'margin-top': '17.5px'
    }, 300);
});

$(document).on("mouseleave", 'footer', function () {
    $(this).find('#footer_contents').stop(true, true).animate({
        'margin-top': '50px'
    }, 300);
});

$(document).on("click", '.arg_text', function () {
    if (toggle == false) {
        $(this).html('<textarea >' + $(this).text() + '</textarea>');
        $(this).focus();
        toggle = true;
        return false;
    }
});
$(document).on("focusout", '.arg_text', function () {
    if (toggle == true && $(this).text() != "") {
        var text = $(this).find('textarea').val();
		var _text = $(this).text();
        var _opt = $(this).parent().attr('id').split('|');
        var opt = _opt[1];
        var id = _opt[0];
        var discId = window.location.href.substring(window.location.href.indexOf('/discussion/') + 12);
        var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/' + discId + '/Options/Option' + opt + '/Arguments/' + id);
        ref.update({ mainText: text });
		if (_text != text)
			angular.element('#args').scope().updateFact();
        $(this).html('<h3 >' + $(this).text() + '</h3>');
        
        toggle = false;
        return false;
    }
});
//$('.arg_add_button').click(function () {
//    $(document).on('DOMNodeInserted', function () {
//        $('div[style="display:none;"]').each(function () {
//            $(this).slideDown(400);
//        });
//    });
//});

//$(document).on('DOMNodeInserted', function () {
//    $('div[style="display:none;"]').each(function () {
//        $(this).slideDown(400);
//    });
//});
function test() {
    console.log("test");
}
$(document).on("click", '.extra_arg_info_txt', function () {
    if (toggle2 == false) {
        $(this).html('<textarea onkeyup="test()">' + $(this).text() + '</textarea>');
        toggle2 = true;
        return false;
    }
});
$(document).on('focusout', '.extra_arg_info_txt', function () {
    if (toggle2 == true && $(this).text() != "") {
        var text = $(this).find('textarea').val();
		var _text = $(this).text();
        var _opt = $(this).parent().parent().attr('id').split('|');
        var opt = _opt[1];
        var id = _opt[0];
        var discId = window.location.href.substring(window.location.href.indexOf('/discussion/') + 12);
        var ref = new Firebase('https://discpoll.firebaseio.com/Discussions/' + discId + '/Options/Option' + opt + '/Arguments/' + id);
        ref.update({ secondText: text });
        if (_text != text)
			angular.element('#args').scope().updateFact();
        $(this).html($(this).text());
        toggle2 = false;
        return false;
    }
});

