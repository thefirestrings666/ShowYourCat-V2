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

    // const user = isNil(userFromFirebase)
    //   ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
    //   : userFromFirebase
    let user = ''
    if (isNil(userFromFirebase)) {
      user = await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
      user.coins = 0
      user.level = 1
      user.xp = 0
      user.xpToReach = 100
    } else {
      user = userFromFirebase

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

    if (userFromFirebase && !user.emailVerified) {
      await userDb.update({
        ...userFromFirebase,
        emailVerified: firebaseAuthUser.emailVerified
      })
    }
    user.emailVerified = firebaseAuthUser.emailVerified

    // Loading xp to reach

    const id = 'KpRejLP6zDeckYkmJYp4'
    await firebase //  catching the level to reach
      .firestore()
      .collection(`appConfiguration/${id}/levelsGrid/`)
      .where('lvl', '==', user.level)
      .get()
      .then(response => {
        response.forEach(doc => {
          user.xpToReach = doc.data().xpToReach
        })
      })

    // Initialise user
    // dispatch('userData/setNextLevel', user, { root: true })
    dispatch('userData/load_userData', user, { root: true })

    commit('setUser', user)

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

  updateUserPictureLink: async ({ commit }, id) => {
    const userDb = new UsersDB()
    const userFromFirebase = await userDb.read(id)
    await userDb.update({
      ...userFromFirebase,
      photoURL: firebase.auth().currentUser.photoURL
    })
    commit('setUserPictureLink', firebase.auth().currentUser.photoURL)
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
