$(() => {

	let selfEmail = "";

	firebase.auth().getRedirectResult().then(function(result) {
		if (result.credential) {
			addChatInterface(result.user);
		}
	}).catch(function(error) {
		console.error(error);
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log(user);
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
		$(".logging-screen").addClass("authed");
	}

	const db = firebase.firestore()
	db.collection("rooms").doc("test").collection("messages").orderBy("timestamp", "asc").onSnapshot(function(snapshot){
		snapshot.docChanges().forEach(function(change) {
			if (change.type === "added") {
				$("<li />").appendTo(".message");
				$("<span />").text(change.doc.data().message).appendTo(".message > li:last");
				$(".message").scrollTop($(".message")[0].scrollHeight);
			};
		});
	});

	$(".input").submit(e => {
		if ($(".text").val().trim() === "") {return false};

		const message = $(".text").val();

		e.preventDefault();
		$(".text").val("");

		db.collection("rooms").doc("test").collection("messages").add({

			message:message,
			timestamp: firebase.firestore.FieldValue.serverTimestamp()
		})
	})
	console.log(db)
});
