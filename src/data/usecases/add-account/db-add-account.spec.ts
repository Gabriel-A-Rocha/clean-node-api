import {
  Encrypter,
  AddAccountModel,
  AddAccountRepository,
  AccountModel,
} from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

// factory helper methods
const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve("hashed_password"));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) =>
        resolve({
          id: "valid_id",
          name: "valid_name",
          email: "valid_email@email.com",
          password: "hashed_password",
        })
      );
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe("DbAddAccount UseCase", () => {
  test("should call Encrypter with the correct password", async () => {
    const { sut, encrypterStub } = makeSut();

    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");

    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    };

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });

  test("should pass error to SignUpController if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();

    jest.spyOn(encrypterStub, "encrypt").mockRejectedValue(new Error());

    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test("should call AddAccountRepository with account data and hashed password", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");

    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    };

    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email@email.com",
      password: "hashed_password",
    });
  });

  test("should pass error to SignUpController if AddAccountRepository throws", async () => {
    const { sut, addAccountRepositoryStub } = makeSut();

    jest.spyOn(addAccountRepositoryStub, "add").mockRejectedValue(new Error());

    const accountData = {
      name: "valid_name",
      email: "valid_email@email.com",
      password: "valid_password",
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
});
