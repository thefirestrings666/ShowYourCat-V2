import firebase from 'firebase'
import UsersDB from '@/firebase/users-db'

export default {
  load_userData: async ({ commit }, user) => {
    const payload = {
      coins: user.user_coins,
      xp: user.user_xp,
      level: user.user_level
    }

    commit('load_userData', payload)
  },

  setPictureToUpload: async ({ commit }, picture) => {
    commit('setPictureToUpload', picture)
  },

  refreshXP: async ({ commit }) => {
    const UsersDb = await new UsersDB().read(firebase.auth().currentUser.uid)
    console.log(UsersDb.user_xp)
    commit('refreshXP')
  }
}
