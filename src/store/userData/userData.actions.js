import firebase from 'firebase'
// import UsersDB from '@/firebase/users-db'
// import LevelsGridDB from '@/firebase/appConfiguration-levelsGrid-db'

export default {
  load_userData: async ({ commit }, user) => {
    const payload = {
      coins: user.coins,
      xp: user.xp,
      level: user.level,
      xpToReach: user.xpToReach
    }

    commit('load_userData', payload)
  },

  setPictureToUpload: async ({ commit }, picture) => {
    commit('setPictureToUpload', picture)
  },

  refreshXP: async ({ commit }, xp) => {
    if (xp.data !== 'Too fast') {
      commit('refreshXP', xp)
    }
  },

  setNextLevel: async ({ commit }) => {
    const id = 'levelsGrid'
    // const idGrid = 'lvlGridId'
    const firebaseUser = firebase.auth().currentUser.uid

    const userDb = await firebase // Looking for the user
      .firestore()
      .doc(`/users/${firebaseUser}/userData/d${firebaseUser}`)
      .get()

    const userLevel = userDb.data().level

    await firebase //  catching the level to reach
      .firestore()
      .collection(`appConfiguration/${id}/levelsGrid/`)
      .where('lvl', '==', userLevel)
      .get()
      .then(response => {
        response.forEach(doc => {
          commit('updateXpToReach', doc.data().xpToReach)
        })
      })
  },

  levelUp: async ({ dispatch, commit, state }, payload) => {
    const gameData = await firebase
      .firestore()
      .doc('/appConfiguration/gameData')
      .get()

    let newLevel = state.user_data.level
    newLevel += 1
    let newCoins = state.user_data.coins
    newCoins += gameData.data().coinsPerLevelUp

    dispatch('setNextLevel')
    commit('updateXp', payload.newXp)
    commit('updateLevel', newLevel)
    commit('updateCoins', newCoins)
  }
}
