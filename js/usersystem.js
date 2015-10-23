var ref = new Firebase('https://discpoll.firebaseio.com/');
$(document).on('DOMNodeInserted', function () {
    if ($('footer').length) {
        var authData = ref.getAuth();

        if (authData) {
            console.log("Authenticated user with uid:", authData.uid);
            $('#register_button').hide();
            $('#login_button').hide();
        }
        else {
            console.log('ayy');
            $('#logout_button').hide();
        }
    }
});

ref.onAuth(function (authData) {
    if (authData) {
        $('#register_button').hide();
        $('#login_button').hide();
        $('#logout_button').show();
    }
    else {
        $('#logout_button').hide();
        $('#register_button').show();
        $('#login_button').show();
    }
});