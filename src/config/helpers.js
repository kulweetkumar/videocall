const FCM = require('fcm-node');
var apn = require('apn');

// var options = {
//     token: {
//       key: "AuthKey_CTQBFQLX9C.p8",
//       keyId: "CTQBFQLX9C",
//       teamId: "26V56T23S8"
//     },
//     production: true
// };
// var apnProvider = new apn.Provider(options);

module.exports = {
    // sendFCMotification: function (deviceToken, data, notification_code) {
    //     var serverKey = 'AAAArDGxX34:APA91bFnV-lSOKxx4u77wZKMduAPPAT6ZXt3GodhKCLqqiD6Xmts-jggb3FNjovKZGjr1ypqQuaYOzAVU0_fxHqphU5iHXTSvLJOn8ARGyEaRMzVaMkSoc0GznAHdKzrSWJ2a52mek8p'; //put your server key here
    //     var fcm = new FCM(serverKey);

    //     data.title = 'Bahama Event';
    //     var message = { 
    //         to: deviceToken, 
    //         collapse_key: 'your_collapse_key',
    //         data: data
    //     };
    //     console.log('==========push noti============',message);
    //     fcm.send(message, function(err, response){
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             console.log("Successfully sent with response: ", response);
    //         }
    //     });
    // },
    // sendApnNotification: function (deviceToken, payload, notification_code) {
    //     // console.log(deviceToken);
    //     payload.notification_code = notification_code;
    //     var note = new apn.Notification();
    //     note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    //     note.badge = 1;
    //     note.sound = "default";
    //     note.alert = payload.message;
    //     note.title = 'Bahama Events';
    //     note.payload = payload;
    //     note.topic = "com.live.BahamasEvents";

    //     apnProvider.send(note, deviceToken).then( (result) => {
    //       console.log(result, "result-----------")
    //     });
    // },

    // async sendNotification (token, data, deviceType) {
    //     console.log('---')
	// 	if(deviceType == 1) {
    //         console.log('---if')
    //         var serverKey = 'AAAArDGxX34:APA91bFnV-lSOKxx4u77wZKMduAPPAT6ZXt3GodhKCLqqiD6Xmts-jggb3FNjovKZGjr1ypqQuaYOzAVU0_fxHqphU5iHXTSvLJOn8ARGyEaRMzVaMkSoc0GznAHdKzrSWJ2a52mek8p'; //put your server key here
    //         var fcm = new FCM(serverKey);
	
	// 		// data.title = constants.appName;
	// 		var message = { 
	// 			// to: token, 
    //             registration_ids: token,
	// 			collapse_key: 'your_collapse_key',
	// 			data: data
	// 		};
	// 		console.log('======================',message);
	// 		fcm.send(message, function(err, response){
	// 			if (err) {
	// 				console.log("Something has gone wrong!",err);
	// 			} else {
	// 				console.log("Successfully sent with response: ", response);
	// 			}
	// 		});
	// 	}else{
    //         console.log('----elses')
    //         var note = new apn.Notification();
    //         note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    //         note.badge = 1;
    //         note.sound = "default";
    //         note.alert = data.message;
    //         note.title = 'Bahama Events';
    //         note.payload = data;
	// 		note.topic = "com.live.BahamasEvents";
	// 		console.log('note======================',note); 
	// 		apnProvider.send(note, token).then( (result) => {
	// 			console.log(result, "result-----------")
	// 		});
	// 	}
	// },
}