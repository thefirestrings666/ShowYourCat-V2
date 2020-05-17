import { isNil } from 'lodash'
import CatPicturesDB from '@/firebase/catPictures-data-db'
import Firebase from 'firebase'

export default {
  /**
   * Closes "add to home screen" modal for apple
   */
  closeAddToHomeScreenModalForApple: async ({ commit }) => {
    localStorage.setItem('addToHomeIosPromptLastDate', Date.now())
    commit('setShowAddToHomeScreenModalForApple', false)
  },

  /**
   * Trigger service worker skipWating so the new service worker can take over.
   * This will also trigger a window refresh (see /src/misc/register-service-worker.js)
   */
  serviceWorkerSkipWaiting({ state, commit }) {
    if (isNil(state.SWRegistrationForNewContent)) return

    commit('setRefreshingApp', true)
    state.SWRegistrationForNewContent.waiting.postMessage('skipWaiting')
  },

  addPictureDB: async (context, payload) => {
    const userFromFirebase = await Firebase.auth().currentUser
    const CatPicturesDb = new CatPicturesDB()

    await CatPicturesDb.create({
      userID: userFromFirebase.uid,
      pictureID: `${payload.PictureId}_600x600`,

      title: payload.title,
      votes: 0,
      approved: false
    })
  },

  loadRandomCat: async pictureURL => {
    const CatPicturesDb = new CatPicturesDB()

    const allPictures = await CatPicturesDb.readAll()

    const random = Math.floor(Math.random() * Math.floor(allPictures.length))

    const storage = Firebase.storage()

    await storage
      .ref(`catPicture/${allPictures[random].pictureID}`)
      .getDownloadURL()
      .then(output => {
        pictureURL = output
      })

    return pictureURL
  }
}
