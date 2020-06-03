const functions = require('firebase-functions')
const admin = require('firebase-admin')
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp()

exports.addXP = functions.https.onCall(async (req, context) => {
  const userID = context.auth.uid

  const userInfo = await admin
    .firestore()
    .doc('users/' + userID)
    .get()

  const userData = await admin
    .firestore()
    .doc('users/' + userID + '/userData/d' + userID)
    .get()

  var timeDuringVotes = Date.now() - userInfo.data().lastVoteTime.seconds * 1000

  if (timeDuringVotes > 2500) {
    // Vote accepted
    var xpToApply = (userData.data().xp += 15)
    const updateXP = await admin
      .firestore()
      .doc('users/' + userID + '/userData/d' + userID)
      .update({
        xp: (userData.data().xp += 15)
      })
  } else {
    console.info('Vote rejected : Too fast')
    return 'Too fast'
  }

  // const addVoteArchived = await admin
  //   .firestore()
  //   .doc('users/' + userID)
  //   .collection('votesArchived')
  //   .add({ original: 'original' })

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
    console.info(context)

    await admin
      .firestore()
      .doc('users/' + context.params.userId)
      .collection('userData')
      .doc('d' + context.params.userId)
      .set({
        level: 1,
        coins: 0,
        xp: 0
      })

    return true
  })
