import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (ciphertext: string): Promise<string> {
    const value: any = await jwt.verify(ciphertext, this.secret)
    return value
  }
}
