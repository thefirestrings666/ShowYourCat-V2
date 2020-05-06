import { isNil } from 'lodash'

export default {
  isUserLoggedIn: state => !isNil(state.user),
  getUserId: state => state.user
}
