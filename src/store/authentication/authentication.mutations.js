export default {
  setUser: (state, value) => {
    state.user = value
  },

  activateUser: (state, value) => (state.user.emailVerified = value),
  setUserDetails: (state, value) => (state.user.displayName = value),
  setUserPictureLink: (state, value) => (state.user.photoURL = value),
  setUserPictureAfterResized: (state, value) => (state.user.photoURL = value),
  setUserPictureResized: (state, value) => (state.user.isPictureUpdated = value)
}
