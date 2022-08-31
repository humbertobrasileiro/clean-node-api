"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_helper_1 = require("../helpers/http/http-helper");
const errors_1 = require("../errors");
const auth_middleware_1 = require("./auth-middleware");
const makeFakeAccount = () => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'hashed_password'
});
const makeFakeRequest = () => ({
    headers: {
        'x-access-token': 'any_token'
    }
});
const makeLoadAccountByToken = () => {
    class LoadAccountByTokenStub {
        async load(accessToken, role) {
            return await new Promise(resolve => resolve(makeFakeAccount()));
        }
    }
    return new LoadAccountByTokenStub();
};
const makeSut = (role) => {
    const loadAccountByTokenStub = makeLoadAccountByToken();
    const sut = new auth_middleware_1.AuthMiddleware(loadAccountByTokenStub, role);
    return {
        sut,
        loadAccountByTokenStub
    };
};
describe('Auth Middleware', () => {
    test('Should return 403 if no x-access-token exists in headers', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});
        expect(httpResponse).toEqual((0, http_helper_1.forbidden)(new errors_1.AccessDeniedError()));
    });
    test('Should call loadAccountByToken with correct accessToken', async () => {
        const role = 'any_role';
        const { sut, loadAccountByTokenStub } = makeSut(role);
        const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
        await sut.handle(makeFakeRequest());
        expect(loadSpy).toHaveBeenCalledWith('any_token', role);
    });
    test('Should return 403 if loadAccountByToken returns null', async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)));
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helper_1.forbidden)(new errors_1.AccessDeniedError()));
    });
    test('Should return 200 if loadAccountByToken returns an account', async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helper_1.ok)({ accountId: 'valid_id' }));
    });
    test('Should return 500 if loadAccountByToken throws', async () => {
        const { sut, loadAccountByTokenStub } = makeSut();
        jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual((0, http_helper_1.serverError)(new Error()));
    });
});
//# sourceMappingURL=auth-middleware.spec.js.map