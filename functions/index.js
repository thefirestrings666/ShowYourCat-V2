const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { object } = require('firebase-functions/lib/providers/storage')
const { replace } = require('lodash')
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

  var v_xpToReach = 0

  const xpToReach = await admin
    .firestore()
    .collection(`appConfiguration/levelsGrid/levelsGrid/`)
    .where('lvl', '==', userData.data().level)
    .get()
    .then(querydoc => {
      querydoc.forEach(doc => {
        v_xpToReach = doc.data().xpToReach
      })
    })

  console.info(v_xpToReach)

  var timeDuringVotes = Date.now() - userInfo.data().lastVoteTime.seconds * 1000

  if (timeDuringVotes > 2500) {
    // Vote accepted
    var xpToApply = (userData.data().xp += 15)

    var levelToApply = userData.data().level

    if (xpToApply >= v_xpToReach) {
      levelToApply += 1
      xpToApply = xpToApply - v_xpToReach
    }
    await admin
      .firestore()
      .doc('users/' + userID + '/userData/d' + userID)
      .update({
        xp: xpToApply,
        level: levelToApply
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

exports.triggerUserPicture = functions.storage
  .object()
  .onFinalize(async object => {
    var userID = object.name.replace('avatars/', '')
    userID = userID.replace('_600x600', '')

    console.info(userID)
    admin
      .firestore()
      .doc(`users/${userID}`)
      .update({
        isPictureUpdated: true
      })
    console.log(userID)
  })

exports.createUserData = functions.https.onCall(async (req, context) => {
  console.info(req)
  await admin
    .firestore()
    .doc('users/' + req.data)
    .collection('userData')
    .doc('d' + req.data)
    .set({
      level: 1,
      coins: 0,
      xp: 0
    })

  return true
})
