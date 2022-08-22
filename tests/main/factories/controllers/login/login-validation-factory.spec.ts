import { ValidationComposite, RequiredFieldValidation, EmailValidation } from '../../../../../src/validation/validators'
import { makeLoginValidation } from '../../../../../src/main/factories/controllers/login/login-validation-factory'
import { Validation } from '../../../../../src/presentation/protocols/validation'
import { EmailValidator } from '../../../../../src/validation/protocols/email-validator'

jest.mock('../../../../../src/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

})