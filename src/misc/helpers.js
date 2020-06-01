import UsersDB from '@/firebase/users-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]
  const { email } = providerData
  const { emailVerified } = firebaseAuthUser
  const userDb = new UsersDB()
  const user = {
    email,
    emailVerified,
    lastVoteTime: new Date()
  }

  return userDb.create(user, firebaseAuthUser.uid)
}
