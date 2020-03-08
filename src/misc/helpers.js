import UsersDB from '@/firebase/users-db'
import UserDataDB from '@/firebase/user-data-db'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]
  const { displayName, photoURL, email } = providerData
  const { emailVerified } = firebaseAuthUser
  const userDb = new UsersDB()
  const user = {
    displayName,
    photoURL,
    email,
    emailVerified
  }

  return userDb.create(user, firebaseAuthUser.uid)
}

export const createNewUserDataFromUser = async userID => {
  const UserDataDb = new UserDataDB()

  const userData = {
    coins: 0,
    level: 1,
    xp: 0
  }

  return UserDataDb.create(userData, userID.uid)
}
