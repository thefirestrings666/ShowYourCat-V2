import GenericDB from './generic-db'

export default class UserDataDB extends GenericDB {
  constructor(userId) {
    super(`users/${userId}/user_Data`)
  }

  // Here you can extend UserProductsDB with custom methods
}
