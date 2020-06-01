import GenericDB from './generic-db'

export default class UsersDataDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/userData`)
  }

  // Here you can extend UserDB with custom methods
}
