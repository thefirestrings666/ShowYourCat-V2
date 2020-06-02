// import firebase from 'firebase'
// import UsersDB from '@/firebase/users-db'

export default {
  load_userData: async ({ commit }, user) => {
    const payload = {
      coins: user.coins,
      xp: user.user_xp,
      level: user.level
    }

    commit('load_userData', payload)
  },

  setPictureToUpload: async ({ commit }, picture) => {
    commit('setPictureToUpload', picture)
  },

  refreshXP: async ({ commit }, xp) => {
    if (xp.data !== 'Too fast') {
      commit('refreshXP', xp.data)
    }
  }
}
