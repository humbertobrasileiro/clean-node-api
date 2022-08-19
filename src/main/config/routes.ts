import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  const fullPath = __dirname + '/../routes'
  app.use('/api', router)
  readdirSync(fullPath).map(async file => {
    if (!file.includes('.test.')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
