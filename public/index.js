$(()=>{
	const db = firebase.firestore()
	db.collection("rooms").doc("test").collection("messages").orderBy("timestamp", "asc").onSnapshot(function(snapshot){
		snapshot.docChanges().forEach(function(change) {
				if (change.type === "added") {
          $("<li />").appendTo(".message")
          $("<span />").text(change.doc.data().message).appendTo(".message > li:last")
					$(".message").scrollTop($(".message")[0].scrollHeight)
				};   
		});
});
	$(".send").on("click", ()=>{
		var message = $(".text").val()
		db.collection("rooms").doc("test").collection("messages").add({
			message:message,
			timestamp: firebase.firestore.FieldValue.serverTimestamp()
		})
	})
	console.log(db)
});