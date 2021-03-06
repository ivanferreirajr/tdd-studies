const LoginRouter = require('./login-router');
const MissingParamsError = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorized-error');

const makeSut = () => {
    class AuthUseCaseSpy {
        auth(email, password) {
            this.email = email;
            this.password = password;
        }
    }
    const authUseCase = new AuthUseCaseSpy();
    const sut = new LoginRouter(authUseCase);

    return {
        sut,
        authUseCase
    }
}

describe('Login Router', () => {
    test('Should return 400 if no email is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: { 
                password: 'password'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamsError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: { 
                email: 'email@mail.com'
            }
        };
        const httpResponse = sut.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamsError('password'));
    })

    test('Should return 500 if no httpRequest is provided', () => {
        const { sut } = makeSut();
        const httpResponse = sut.route();
        expect(httpResponse.statusCode).toBe(500);
    })

    test('Should return 500 if no body is provided', () => {
        const { sut } = makeSut();
        const httpResponse = sut.route({});
        expect(httpResponse.statusCode).toBe(500);
    })

    test('Should call AuthUseCaseSpy with correct params', () => {
        const { sut,authUseCase } = makeSut();
        const httpRequest = {
            body: {
                email: 'test@example.com',
                password: 'test'
            }
        }
        sut.route(httpRequest);
        expect(authUseCase.email).toBe(httpRequest.body.email);
        expect(authUseCase.password).toBe(httpRequest.body.password);
    })

    test('Should return 401 with invalid credentials are provided', () => {
        const { sut,authUseCase } = makeSut();
        const httpRequest = {
            body: {
                email: 'invalid_test@example.com',
                password: 'invalid_test'
            }
        }
        const httpResponse = sut.route(httpRequest);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    })
});
