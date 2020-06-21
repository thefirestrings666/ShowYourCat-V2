import firebase from 'firebase/app'
import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'

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
            commit('setUserPictureResized', true)
            firebase
              .storage()
              .ref(snapshot.data().photoURL)
              .getDownloadURL()
              .then(responseURL => {
                commit('setUserPictureAfterResized', responseURL)
              })
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

    commit('setUser', user) // Initialise user

    // User activation
    if (!user.emailVerified) {
      await firebase.auth().currentUser.reload()
      await commit('activateUser', firebaseAuthUser.emailVerified)
    }
  },

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
