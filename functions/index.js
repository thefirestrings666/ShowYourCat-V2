const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp()

<<<<<<< HEAD
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
=======
exports.addXP = functions.https.onCall(async (req, context) => {
  const userID = context.auth.uid

  const userData = await admin
    .firestore()
    .doc('users/' + userID)
    .get()

  var timeDuringVotes = Date.now() - userData.data().lastVoteTime.seconds * 1000

  if (timeDuringVotes > 2500) {
    // Vote accepted
    var xpToApply = (userData.data().user_xp += 15)
    const updateXP = await admin
      .firestore()
      .doc('users/' + userID)
      .update({
        user_xp: (userData.data().user_xp += 15)
      })
  } else {
    console.info('Vote rejected : Too fast')
    return 'Too fast'
  }

  const addVoteArchived = await admin
    .firestore()
    .doc('users/' + userID)
    .collection('votesArchived')
    .add({ original: 'original' })

  const updateLastVote = await admin
    .firestore()
    .doc('users/' + userID)
    .update({
      lastVoteTime: FieldValue.serverTimestamp()
    })

  return xpToApply
>>>>>>> 8b9e57bdb57e71e32b8fedc23ebfc6b4181973a4
})

exports.SetNewUserData = functions.firestore
  .document('/users/{userId}')
  .onCreate(async (snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const original = snap.data().original

    console.info(snap)

    await admin
      .firestore()
      .doc('users/' + context.params.userId)
      .collection('userData')
      .add({
        level: 1,
        coins: 0,
        xp: 0
      })

    const uppercase = original.toUpperCase()

    return snap.ref.set({ uppercase }, { merge: true })
  })
