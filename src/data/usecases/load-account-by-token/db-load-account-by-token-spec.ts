import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '@/domain/models/account'

let token: string = 'any_token'
let role: string = 'any_role'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
})

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {

  test('Should call Decrypter with correct token', async () => {
    const { sut, decrypterStub } = makeSut()
    const tokenSpy = jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(token)))
    await sut.load(token, role)
    expect(tokenSpy).toBe(token)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const account = await sut.load(token, role)
    expect(account.id).toBe('valid_id')
    expect(account.name).toBe('valid_name')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load(token, role)
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const account = await sut.load(token, role)
    expect(account).toEqual(['any_token', 'any_role'])
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(null)
    const account = await sut.load(token, role)
    await expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockImplementationOnce(null)
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

})