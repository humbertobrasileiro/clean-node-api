import request from 'supertest'
import app from '../../../src/main/config/app'
import { MongoHelper } from '../../../src/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import env from '../../../src/main/config/env'

let surveyCollection: Collection

describe('Survey Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  describe('POST /surveys', () => {

    test('Should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'Answer 1'
            },
            {
              answer: "Answer 2"
            }
          ]
        })
        .expect(204)
    })

  })

})
