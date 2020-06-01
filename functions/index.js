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

exports.addXP = functions.https.onRequest(async (data, resp) => {
  const userID = data.query.userID

  const writeResult = await admin
    .firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get()
    .then(usr => {
      return resp.json({ idOut: writeResult })
    })

  // return new Promise((resolve, reject) => {
  //
  // resolve({ userM00002: data })
  // })
  // ref.on('value', snap => {
  //   pic = snap.val()
  // })
  // return context.auth.uid
  // return new Promise((resolve, reject) => {
  //   resolve({ userM00002: userMail.email })
  // })
})
