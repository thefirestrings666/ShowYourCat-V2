import firebase from 'firebase/app'
import router from '@/router'
import { isNil } from 'lodash'
import { createNewUserFromFirebaseAuthUser } from '@/misc/helpers'

import UsersDB from '@/firebase/users-db'

export default {
  /**
   * Callback fired when user login
   */
  login: async ({ commit, dispatch }, firebaseAuthUser) => {
    const userDb = new UsersDB()
    const userFromFirebase = await userDb.read(firebaseAuthUser.uid)

    const user = isNil(userFromFirebase)
      ? await createNewUserFromFirebaseAuthUser(firebaseAuthUser)
      : userFromFirebase

    if (userFromFirebase && !user.emailVerified) {
      await userDb.update({
        ...userFromFirebase,
        emailVerified: firebaseAuthUser.emailVerified
      })
    }

    commit('setUser', user)

    // Initialise user
    dispatch('userData/load_userData', user, { root: true })

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
    console.log(id)
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
    commit('products/setProducts', null, { root: true })

    const currentRouter = router.app.$route
    if (!(currentRouter.meta && currentRouter.meta.authNotRequired)) {
      router.push('/login')
    }
  }
}
