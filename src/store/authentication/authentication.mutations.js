export default {
  setUser: (state, value) => (state.user = value),
  activateUser: (state, value) => (state.user.emailVerified = value)
}
