import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  async load: (accessToken: string, role?: string) => Promise<AccountModel> {
    
  }
}
