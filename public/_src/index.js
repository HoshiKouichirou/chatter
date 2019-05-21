$(() => {

	let selfEmail = "",
			selfThumbnail = "",
			selfDisplayName = ""

	firebase.auth().getRedirectResult().then(function(result) {
		if (result.credential) {
			addChatInterface(result.user);
		}
	}).catch(function(error) {
		console.error(error);
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			addChatInterface(user);
		} else {
			console.log("non-logged-in");
		}
	});

	function signIn() {
		const provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);
	}

	function signOut() {
		firebase.auth().signOut();
	}

	$(".auth").on("click", () => {
		signIn();
	});

	function addChatInterface(user) {
		console.log(user);
		selfEmail = user.email;
		selfThumbnail = user.photoURL;
		selfDisplayName = user.displayName;
		$(".logging-screen").addClass("authed");
	}

	const db = firebase.firestore()
	db.collection("rooms").doc("test").collection("messages").orderBy("timestamp", "asc").onSnapshot(function(snapshot){
		snapshot.docChanges().forEach(function(change) {
			if (change.type === "added") {

				const profileImage = change.doc.data().thumbnail;

				if ($(".user-messages:last").attr("data-thumbnail") === profileImage) {

					$("<li class='self' />").appendTo(".user-messages:last");
					$("<span />").text(change.doc.data().message).appendTo(".user-messages:last > li:last");
					$(".message").scrollTop($(".message")[0].scrollHeight);

				} else {

					if (change.doc.data().email === selfEmail) {

						$(`<div class='user-messages self' data-thumbnail=${profileImage} />`).appendTo(".message");
						$(`<div class='profile-img' data-display-name='${change.doc.data().displayName}' style='background-image: url("${profileImage}")' />`).appendTo(".user-messages:last");

						$("<li class='self' />").appendTo(".user-messages:last");
						$("<span />").text(change.doc.data().message).appendTo(".user-messages:last > li:last");
						$(".message").scrollTop($(".message")[0].scrollHeight);

					} else {

						$(`<div class='user-messages' data-thumbnail=${profileImage} />`).appendTo(".message");
						$(`<div class='profile-img' data-display-name='${change.doc.data().displayName}' style='background-image: url("${profileImage}")' />`).appendTo(".user-messages:last");

						$("<li />").appendTo(".user-messages:last");
						$("<span />").text(change.doc.data().message).appendTo(".user-messages:last > li:last");
						$(".message").scrollTop($(".message")[0].scrollHeight);
					}
				}
			};
		});
	});

	$(".input").submit(e => {
		if ($(".text").val().trim() === "") {return false};

		const message = $(".text").val();

		e.preventDefault();
		$(".text").val("");

		db.collection("rooms").doc("test").collection("messages").add({
			message: message,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			email: selfEmail,
			thumbnail: selfThumbnail,
			displayName: selfDisplayName
		});
	});
});
