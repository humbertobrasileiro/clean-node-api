import { 
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation 
} from '../../../../../src/validation/validators'
import { makeSignUpValidation } from '../../../../../src/main/factories/controllers/signup/signup-validation-factory'
import { Validation } from '../../../../../src/presentation/protocols/validation'
import { EmailValidator } from '../../../../../src/validation/protocols/email-validator'

jest.mock('../../../../../src/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub
}

describe('SignUpValidation Factory', () => {
  
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })

})