import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { LoadAccountByEmailRepository } from '@/data/usecases/add-account/db-add-account-protocols'
import { AddAccount } from '@/domain/usecases/add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt: number = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const loadAccountByEmailRepository: LoadAccountByEmailRepository = null
  return new DbAddAccount(bcryptAdapter, accountMongoRepository, loadAccountByEmailRepository)
}
