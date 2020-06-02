export default {
  load_userData: (state, payload) => (state.user_data = payload),
  setPictureToUpload: (state, payload) => (state.pictureToUpload = payload),
  refreshXP: (state, data) => (state.user_data.xp = data)
}
