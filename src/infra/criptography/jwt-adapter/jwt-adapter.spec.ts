import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

type SutTypes = {
  sut: JwtAdapter
}

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))

const makeSut = (secret: string): SutTypes => {
  const sut = new JwtAdapter(secret)
  return { sut }
}

describe('Jwt Adapter', () => {

  describe('sign()', () => {

    test('Should call sign with correct values', async () => {
      const { sut } = makeSut('secret')
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
  
    test('Should return a token on sign success', async () => {
      const { sut } = makeSut('secret')
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
  
    test('Should throw if sign throws', async () => {
      const { sut } = makeSut('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()      
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })

  })

  describe('verify()', () => {

    test('Should call verify with correct values', async () => {
      const { sut } = makeSut('secret')
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  
    test('Should return a value on verify success', async () => {
      const { sut } = makeSut('secret')
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })
  
    test('Should throw if sign throws', async () => {
      const { sut } = makeSut('secret')
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()      
      })
      const promise = sut.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })

  })

})