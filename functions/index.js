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
            catPicture: `https://firebasestorage.googleapis.com/v0/b/showyourcat-v2.appspot.com/o/catAvatars%2F${catID}_600x600?alt=media&token=${object.metadata.firebaseStorageDownloadTokens}`,
            catID: catID,
            avatarIsResized: true
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

exports.checkLimitUpload = functions.https.onCall(async (req, context) => {
  var weekUpload = null
  var startDate = new Date()
  var timeBetweenVotes = null

  var approvedVar = 0
  var returnMessage = ''

  const userID = context.auth.uid
  // Loading Game Data
  const gameData = await admin
    .firestore()
    .doc(`appConfiguration/gameData`)
    .get()

  const coinsPerUpload = gameData.data().coinsPerUpload

  await admin
    .firestore()
    .collection('cats')
    .where('userId', '==', context.auth.uid)
    .get()
    .then(result => {
      result.forEach(doc => {
        weekUpload = doc.data().weekUpload

        // No photo uploaded yet
        if (weekUpload === 0) {
          admin
            .firestore()
            .doc('cats/' + doc.data().catID)
            .update({
              dateStartingVote: startDate,
              weekUpload: 1
            })
          admin
            .firestore()
            .doc(`users/${userID}/userData/d${userID}`)
            .update({
              coins: admin.firestore.FieldValue.increment(coinsPerUpload)
            })
          approvedVar = 1
          returnMessage = `Approved! New vote count : ${doc.data().weekUpload +
            1}`
        } else {
          timeBetweenVotes =
            (Date.now() - doc.data().dateStartingVote.seconds * 1000) /
            6000 /
            60 /
            10

          if (timeBetweenVotes > 168) {
            // Success to create upload
            admin
              .firestore()
              .doc('cats/' + doc.data().catID)
              .update({
                dateStartingVote: startDate,
                weekUpload: 1
              })
            admin
              .firestore()
              .doc(`users/${userID}/userData/d${userID}`)
              .update({
                coins: admin.firestore.FieldValue.increment(coinsPerUpload)
              })
            approvedVar = 1
            returnMessage = `Approved! New upload count : 1`
          } else {
            if (doc.data().weekUpload < 5) {
              admin // updating the weekly upload
                .firestore()
                .doc('cats/' + doc.data().catID)
                .update({
                  weekUpload: admin.firestore.FieldValue.increment(1)
                })
              admin // giving the coin
                .firestore()
                .doc(`users/${userID}/userData/d${userID}`)
                .update({
                  coins: admin.firestore.FieldValue.increment(coinsPerUpload)
                })
              approvedVar = 1
              returnMessage = `Approved! New upload count : ${doc.data()
                .weekUpload + 1}`
            } else {
              approvedVar = 0
              returnMessage = 'Not Approved, too many upload this week'
            }
          }
        }
      })
      return true
    })

  const payload = {
    Approved: approvedVar,
    Name: req.data,
    weekUpload: weekUpload,
    StartDate: startDate.toString(),
    TimebetweenVotes: timeBetweenVotes,
    ReturnedMessage: returnMessage
  }

  return payload
})
