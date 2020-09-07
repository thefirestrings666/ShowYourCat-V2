export default {
  load_userData: (state, payload) => (state.user_data = payload),
  setPictureToUpload: (state, payload) => (state.pictureToUpload = payload),
  refreshXP: (state, data) => (state.user_data.xp = data),
  updateXpToReach: (state, data) => (state.user_data.xpToReach = data),

  updateXp: (state, data) => (state.user_data.xp = data),
  updateLevel: (state, data) => (state.user_data.level = data),
  updateCoins: (state, data) => (state.user_data.coins = data),
  updateUserData: (state, data) => {
    state.user_data.xp = data.xp
    state.user_data.level = data.level
    state.user_data.coins = data.coins
  }
}
