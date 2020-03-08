import firebase from 'firebase/app'
import router from '@/router'
import { isNil } from 'lodash'
import {
  createNewUserFromFirebaseAuthUser
  // createNewUserDataFromUser
} from '@/misc/helpers'

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

    if (userFromFirebase) {
      await userDb.update({
        ...userFromFirebase,
        emailVerified: firebaseAuthUser.emailVerified
      })
    }

    commit('setUser', user)

    await firebase.auth().currentUser.reload()

    await commit('activateUser', firebaseAuthUser.emailVerified)

    dispatch('products/getUserProducts', null, { root: true })
  },

  activateUser: async ({ commit, state }) => {
    console.log(state.user)
    commit('activateUser', true)
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
