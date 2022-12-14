import app from '../config/app'
import env from '../config/env'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('Login Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {

    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Carlos Humberto Brasileiro Toscano',
          email: 'humbertobtoscano@gmail.com',
          password: '12345678',
          passwordConfirmation: '12345678'
        })
        .expect(200)
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Carlos Humberto Brasileiro Toscano',
          email: 'humbertobtoscano@gmail.com',
          password: '12345678',
          passwordConfirmation: '12345678'
        })
        .expect(403)
    })

  })

  describe('POST /login', () => {

    test('Should return 200 on login', async () => {
      const password = await hash('12345678', 12)
      await accountCollection.insertOne({
        name: 'Carlos Humberto Brasileiro Toscano',
        email: 'humbertobtoscano@gmail.com',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          name: 'Carlos Humberto Brasileiro Toscano',
          email: 'humbertobtoscano@gmail.com',
          password: '12345678'
        })
        .expect(200)
    }) 

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          name: 'Carlos Humberto Brasileiro Toscano',
          email: 'humbertobtoscano@gmail.com',
          password: '12345678'
        })
        .expect(401)
    })

  })

})
