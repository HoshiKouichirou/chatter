$(()=>{
	const db = firebase.firestore()
	db.collection("rooms").doc("test").collection("messages").onSnapshot(function(snapshot){
		snapshot.docChanges().forEach(function(change) {
				if (change.type === "added") {
          $("<li />").appendTo(".message")
          $("<span />").text(change.doc.data().message).appendTo(".message > li:last")
					$(".message").scrollTop($(".message")[0].scrollHeight)
				};   
		});
});
	$(".send").on("click", ()=>{
		const message = $(".text").val();
		db.collection("rooms").doc("test").collection("messages").add({
			message:message
		});
	});
	console.log(db)
});