import UsersDB from '@/firebase/users-db'
import Firebase from 'firebase'

/**
 * Create new user from firebase auth user infos
 */
// eslint-disable-next-line
export const createNewUserFromFirebaseAuthUser = async firebaseAuthUser => {
  const providerData = firebaseAuthUser.providerData[0]

  const { email } = providerData
  // const { emailVerified } = firebaseAuthUser.emailVerified
  const userDb = new UsersDB()
  const user = {
    email,
    emailVerified: firebaseAuthUser.emailVerified,
    lastVoteTime: new Date()
  }
  userDb.create(user, firebaseAuthUser.uid).then(response => {
    Firebase.functions().httpsCallable('createUserData')({ data: response.id })
  })

  return userDb
}
