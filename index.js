
$(()=>{
	const db = firebase.firestore()
	db.collection("rooms").doc("test").collection("messages").onSnapshot(function(snapshot){
		snapshot.docChanges().forEach(function(change) {
				if (change.type === "added") {
					$(".message").append(`<li>${change.doc.data().message}</li>`);
				}   
		});
});
	$(".send").on("click", ()=>{
		var message = $(".text").val()
		db.collection("rooms").doc("test").collection("messages").add({
			message:message
		})
	})
	console.log(db)
});
