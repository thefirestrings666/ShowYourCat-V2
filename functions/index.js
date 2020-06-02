const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp()

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
