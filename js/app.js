  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDRmoqbwC2efNl9azidFOvph0wrUAEH__Y",
    authDomain: "codecaster-2147a.firebaseapp.com",
    databaseURL: "https://codecaster-2147a.firebaseio.com",
    storageBucket: "codecaster-2147a.appspot.com",
    messagingSenderId: "251138636202"
  };
  firebase.initializeApp(config);
  var usernametext;
  const dbRefUser = firebase.database().ref().child('users');

  $('#signupBtn').click(function() {
    usernametext  = $('#usernametext').val();
    const $emailtext = $('#emailtext').val();
    const $passwordtext = $('#passwordtext').val();
    const auth = firebase.auth();

    const promise = auth.createUserWithEmailAndPassword($emailtext, $passwordtext);

  })

  $('#signinBtn').click(function() {
    const $signinUserName = $('#signin-username').val();
    const $signinPassword = $('#signin-password').val();
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword( $signinUserName, $signinPassword).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(user.displayName);
      $('#username').html(user.displayName);
      $('#signoutBtn').show();
    });
  })

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      firebaseUser.updateProfile({
        displayName: usernametext
      }).then(function() {
        // Update successful.
        $('#username').html(firebaseUser.displayName);
        $('.signinform, .signupholder').hide();
        $('#signoutBtn').show();
        firebase.database().ref('users/' + firebaseUser.uid).set({
          username: firebaseUser.displayName,
          email: firebaseUser.email,
        });
        displayRooms(firebaseUser);
      }, function(error) {
        // An error happened.
      });
    }
  });

  $('#signoutBtn').click(function() {
    firebase.auth().signOut().then(function() {
      $('#username').html('').hide();
      $('#signoutBtn').hide();
      $('.signinform, .signupholder').show();
    })
  })

  function displayRooms() {
    var myUserId = firebase.auth().currentUser.uid;
    var myUserName = firebase.auth().currentUser.displayName
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = year + "/" + month + "/" + day;
    $('#add').click(function() {
      var $roomTitle = $('#roomtitle').val();
      var $roomdescription = $('#roomdescription').val();

      firebase.database().ref('rooms').push({author:myUserName, title:$roomTitle, description:$roomdescription, date:newdate});
    })

    $('#userroom').click(function(){
      $('#rooms-holder').html('');
      var userPostsRef = firebase.database().ref().child('rooms').orderByChild("author")
       .equalTo(myUserName)
       .on("child_added", function(snapshot) {
         var details = snapshot.val();
         $('#rooms-holder').append('<div class="col-md-3 room"><h3>'+details.title+'</h3><h5>'+details.description+'</h5><p>by '+details.author+'</p></div>')
        });
    });

    $('#all').click(function(){
      $('#rooms-holder').html('');
      var allpost = firebase.database().ref().child('rooms').on('child_added', function(snap) {
          var details = snap.val();
          $('#rooms-holder').append('<div class="col-md-3 room"><h3>'+details.title+'</h3><h5>'+details.description+'</h5><p>by '+details.author+'</p></div>')
      })
    });



  }

  firebase.database().ref().child('rooms').on('child_added', function(snap) {
      var details = snap.val();
      $('#rooms-holder').append('<div class="col-md-3 room"><h3>'+details.title+'</h3><h5>'+details.description+'</h5><p>by '+details.author+'</p></div>')
  })
