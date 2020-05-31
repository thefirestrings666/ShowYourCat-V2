const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// exports.addMessage = functions.https.onCall(async (req, context) => {
//   // Grab the text parameter.
//   const original = req.text
//   // Push the new message into Cloud Firestore using the Firebase Admin SDK.
//   const writeResult = await admin
//     .firestore()
//     .collection('messages')
//     .add({ original: original })
//   // Send back a message that we've succesfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` })
// })

exports.addXP = functions.https.onCall(async (data, context) => {
  ref = await admin.database().ref('/users/aIGyOo9AL8gZx9jYCR9XnWEt0yZ2')

  ref
    .once('value')
    .then(snapshot => {
      var event = (snapshot.val() && snapshot.val().email) || 'Anonymous'
      return event
    })
    .catch(error => {})

  // ref.on('value', snap => {
  //   pic = snap.val()
  // })

  // return context.auth.uid
  // return new Promise((resolve, reject) => {
  //   resolve({ userM00002: userMail.email })
  // })
})
