import { ValidationComposite, RequiredFieldValidation } from '../../../../../../src/validation/validators'
import { makeAddSurveyValidation } from '../../../../../../src/main/factories/controllers/survey/add-survey/add-survey-validation-factory'
import { Validation } from '../../../../../../src/presentation/protocols/validation'

jest.mock('../../../../../../src/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
   
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers', 'date']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

})