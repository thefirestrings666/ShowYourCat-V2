import UsersDB from '@/firebase/users-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]
  const { displayName, photoURL, email, isActivated = false } = providerData
  const userDb = new UsersDB()
  const user = {
    displayName,
    photoURL,
    email,
    isActivated
  }

  return userDb.create(user, firebaseAuthUser.uid)
}
