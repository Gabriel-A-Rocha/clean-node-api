import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve("hashedPassword"));
  },
}));

// helper factory methods

interface SutTypes {
  sut: BcryptAdapter;
  salt: number;
}

const makeSut = (): SutTypes => {
  const salt = 12;
  const sut = new BcryptAdapter(salt);
  return { sut, salt };
};

describe("BcryptAdapter", () => {
  test("should call bcrypt with correct values", async () => {
    const { sut, salt } = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  test("should return a hash on success", async () => {
    const { sut } = makeSut();
    const hash = await sut.encrypt("any_value");
    expect(hash).toEqual("hashedPassword");
  });

  test("should throw if bcrypt throws", async () => {
    const { sut } = makeSut();
    jest.spyOn(bcrypt, "hash").mockRejectedValueOnce(new Error());
    const promise = sut.encrypt("any_value");
    await expect(promise).rejects.toThrow();
  });
});
