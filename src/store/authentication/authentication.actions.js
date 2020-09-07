import firebase from 'firebase/app'
import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'
import CatPicturesDB from '@/firebase/catPictures-data-db'

import UsersDB from '@/firebase/users-db'

// import UserDataDB from '@/firebase/users-db-data'

export default {
  /**
   * Callback fired when user login
   */
  login: async ({ commit, dispatch }, firebaseAuthUser) => {
    const userDb = new UsersDB()
    const userFromFirebase = await userDb.read(firebaseAuthUser.uid)

    let user = ''
    if (isNil(userFromFirebase)) {
      // If no user existing
      user = await createNewUserFromFirebaseAuthUser(firebaseAuthUser) // Creation of the user in DB
      user.coins = 0
      user.level = 1
      user.xp = 0
      user.xpToReach = 100
      user.isPictureUpdated = false
      user.photoURL = 'avatars/nopicture.png'
      user.cat = {}
    } else {
      user = userFromFirebase // user from DB
      const userData = await firebase
        .firestore()
        .doc(
          `users/${firebase.auth().currentUser.uid}/userData/d${
            firebase.auth().currentUser.uid
          }`
        )
        .get()
      user.coins = userData.data().coins
      user.level = userData.data().level
      user.xp = userData.data().xp
      user.cat = null
    }

    // Listener for resized picture

    if (user && !user.isPictureUpdated) {
      // basic test
      firebase
        .firestore()
        .doc(`users/${firebase.auth().currentUser.uid}`)
        .onSnapshot(snapshot => {
          // snapshot of DB
          if (snapshot.data().isPictureUpdated === true) {
            try {
              commit('setUserPictureResized', true)
              firebase
                .storage()
                .ref(snapshot.data().photoURL)
                .getDownloadURL()
                .then(responseURL => {
                  commit('setUserPictureAfterResized', responseURL)
                })
            } catch {
              console.info('Picture not catched')
            }
          }
        })
    } else {
      await firebase
        .storage()
        .ref('avatars/nopicture.png')
        .getDownloadURL()
        .then(url => {
          user.photoURL = url
        })
    }

    // check if user is verified

    if (userFromFirebase && !user.emailVerified) {
      await userDb.update({
        ...userFromFirebase,
        emailVerified: firebaseAuthUser.emailVerified
      })
    }
    user.emailVerified = firebaseAuthUser.emailVerified

    // Loading xp to reach

    await firebase //  catching the level to reach
      .firestore()
      .collection(`appConfiguration/levelsGrid/levelsGrid/`)
      .where('lvl', '==', user.level)
      .get()
      .then(response => {
        response.forEach(doc => {
          user.xpToReach = doc.data().xpToReach // saving xpToReach
        })
      })

    dispatch('userData/load_userData', user, { root: true })

    // Checking if a cat exist
    commit('setUser', user) // Initialise user

    dispatch('listenerUserData')

    await firebase
      .firestore()
      .collection('cats/')
      .where('userId', '==', firebase.auth().currentUser.uid)
      .get()
      .then(response => {
        if (!response.empty) {
          response.forEach(doc => {
            dispatch('UpdateCat', doc.data()) // Checking if cat exist, and update store
          })
        }
      })

    // User activation
    if (!user.emailVerified) {
      await firebase.auth().currentUser.reload()
      await commit('activateUser', firebaseAuthUser.emailVerified)
    }
  },

  // update user details
  updateUserDetails: async ({ commit }, id) => {
    const userDb = new UsersDB()
    const userFromFirebase = await userDb.read(id)
    await userDb.update({
      ...userFromFirebase,
      displayName: firebase.auth().currentUser.displayName
    })

    commit('setUserDetails', firebase.auth().currentUser.displayName)
  },

  getUserPicture: async pictureLink => {
    firebase
      .storage()
      .ref(pictureLink)
      .getDownloadURL()
      .then(url => {
        return url
      })
  },

  /** Update user cat  */

  UpdateCat: async ({ dispatch, commit }, receivedData) => {
    if (receivedData) {
      commit('updateUserCat', receivedData)
      dispatch('listenerCatUpdate')
    }

    // firebase
    //   .firestore()
    //   .collection('cats/')
    //   .where('userId', '==', firebase.auth().currentUser.uid)
    //   .get()
    //   .then(result => {
    //     if (!result.empty) {
    //       result.forEach(element => {
    //         const payload = element.data()
    //         commit('updateUserCat', payload)
    //         // dispatch('listenerCatUpdate') // Listener for updated cat avatar
    //       })
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  },

  // update cat Avatar
  updateCatAvatar: ({ commit }, data) => {
    commit('updateCatAvatar', data)
  },

  // add the cat picture into the db
  addPictureDB: async ({ commit }, payloadV) => {
    const CatPicturesDb = new CatPicturesDB()

    await CatPicturesDb.create({
      userID: firebase.auth().currentUser.uid,
      pictureID: `${payloadV.PictureId}_600x600`,
      title: payloadV.title,
      votes: 0,
      approved: false,
      resized: false
    }).then(result => {
      firebase
        .firestore()
        .doc(`CatPictures/${result.id}`)
        .update({
          catID: result.id
        })
      commit('updateUserCatID', result.id)
    })
  },

  // listener cat avatar

  listenerCatUpdate: async ({ state, commit }) => {
    firebase
      .firestore()
      .doc(`cats/${state.user.cat.catID}`)
      .onSnapshot(snap => {
        commit('updateCatData', snap.data())
      })
  },

  // listener cat avatar

  listenerUserData: async ({ state, commit, dispatch }) => {
    firebase
      .firestore()
      .doc(`users/${state.user.id}/userData/d${state.user.id}`)
      .onSnapshot(snap => {
        commit('userData/updateUserData', snap.data(), { root: true })
        dispatch('userData/setNextLevel', true, { root: true })
      })
  },

  /**
   * Callback fired when user logout
   */
  logout: ({ commit }) => {
    commit('setUser', null)

    const currentRouter = router.app.$route
    if (!(currentRouter.meta && currentRouter.meta.authNotRequired)) {
      router.push('/home')
    }
  }
}
