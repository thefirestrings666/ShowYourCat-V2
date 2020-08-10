const functions = require('firebase-functions')
const admin = require('firebase-admin')
const { object } = require('firebase-functions/lib/providers/storage')
const { replace, result } = require('lodash')
const FieldValue = require('firebase-admin').firestore.FieldValue

admin.initializeApp()

exports.addXP = functions.https.onCall(async (req, context) => {
  const userID = context.auth.uid

  var returnPayload = {
    totalXP: 0,
    newXP: 0
  }
  const userInfo = await admin
    .firestore()
    .doc('users/' + userID)
    .get()

  const userData = await admin
    .firestore()
    .doc('users/' + userID + '/userData/d' + userID)
    .get()

  var v_xpToReach = 0
  var v_coins = 0

  await admin
    .firestore()
    .collection(`appConfiguration/levelsGrid/levelsGrid/`)
    .where('lvl', '==', userData.data().level)
    .get()
    .then(querydoc => {
      querydoc.forEach(doc => {
        v_xpToReach = doc.data().xpToReach
      })
      return v_xpToReach
    })

  const gameData = await admin
    .firestore()
    .doc(`appConfiguration/gameData`)
    .get()

  console.log(gameData.data())

  var timeDuringVotes = Date.now() - userInfo.data().lastVoteTime.seconds * 1000

  if (timeDuringVotes > 2500) {
    // Vote accepted
    var xpToApply = (userData.data().xp += gameData.data().xpPerVote)
    returnPayload.totalXP = xpToApply
    returnPayload.newXP = xpToApply

    var levelToApply = userData.data().level
    var coinsToApply = userData.data().coins

    if (xpToApply >= v_xpToReach) {
      levelToApply += 1
      coinsToApply += gameData.data().coinsPerLevel
      xpToApply = xpToApply - v_xpToReach
      returnPayload.newXP = xpToApply
    }
    await admin
      .firestore()
      .doc('users/' + userID + '/userData/d' + userID)
      .update({
        xp: xpToApply,
        level: levelToApply,
        coins: coinsToApply
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

  return returnPayload
})

exports.triggerUserPicture = functions.storage
  .object()
  .onFinalize(async object => {
    if (object.name.substring(0, 7) === 'avatars') {
      var userID = object.name.replace('avatars/', '')
      userID = userID.replace('_600x600', '')

      admin
        .firestore()
        .doc(`users/${userID}`)
        .update({
          isPictureUpdated: true
        })
    }
  })

exports.triggerCatAvatar = functions.storage
  .object()
  .onFinalize(async object => {
    if (object.name.substring(0, 10) === 'catAvatars') {
      if (
        object.name.substring(object.name.length - 7, object.name.length) ===
        '600x600'
      ) {
        var catID = object.name.replace('catAvatars/', '')
        catID = catID.replace('_600x600', '')

        admin
          .firestore()
          .doc(`cats/${catID}`)
          .update({
            catPicture: `https://firebasestorage.googleapis.com/v0/b/showyourcat-v2.appspot.com/o/catAvatars%2F${catID}_600x600?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`
          })
      }

      // admin
      //   .firestore()
      //   .doc(`users/${userID}`)
      //   .update({
      //     isPictureUpdated: true
      //   })
    }
  })

exports.triggerCatResized = functions.storage
  .object()
  .onFinalize(async object => {
    if (object.name.substring(0, 10) === 'catPicture') {
      if (
        object.name.substring(object.name.length - 7, object.name.length) ===
        '600x600'
      ) {
        var catID = object.name.replace('catPicture/', '')

        admin
          .firestore()
          .collection('CatPictures')
          .where('pictureID', '==', catID)
          .get()
          .then(result => {
            result.forEach(doc => {
              admin
                .firestore()
                .doc(`CatPictures/${doc.data().catID}`)
                .update({
                  resized: true
                })
            })

            return result
          })
          .catch(error => {
            console.log(error)
          })
      }

      // admin
      //   .firestore()
      //   .doc(`users/${userID}`)
      //   .update({
      //     isPictureUpdated: true
      //   })
    }
  })

exports.createUserData = functions.https.onCall(async (req, context) => {
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

exports.checkLimitVote = functions.https.onCall(async (req, context) => {
  var returnVal = null
  console.log(context)
  await admin
    .firestore()
    .collection('cats')
    .where('userId', '==', context.uid)
    .where('name', '==', req.data)
    .get()
    .then(result => {
      result.forEach(doc => {
        returnVal = doc.data().weekVote
        console.log(returnVal)
      })
      return true
    })
    .catch(error => {
      console.log(error)
    })
})
