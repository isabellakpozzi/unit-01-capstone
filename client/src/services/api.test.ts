import { describe, it, expect } from "vitest";
import { AxiosError } from "axios";
import { extractErrorMessage } from "./api";

function makeAxiosError(data: unknown): AxiosError {
  const error = new AxiosError("Request failed");
  error.response = {
    data,
    status: 400,
    statusText: "Bad Request",
    headers: {},
    // @ts-expect-error - config isn't needed for this test
    config: {},
  };
  return error;
}

describe("extractErrorMessage", () => {
  it("returns the message field when present", () => {
    const error = makeAxiosError({ message: "Cannot find recipe" });
    expect(extractErrorMessage(error)).toBe("Cannot find recipe");
  });

  it("returns the err field when message is absent", () => {
    const error = makeAxiosError({ err: "bad credentials" });
    expect(extractErrorMessage(error)).toBe("bad credentials");
  });

  it("prefers message over err when both are present", () => {
    const error = makeAxiosError({ message: "from message", err: "from err" });
    expect(extractErrorMessage(error)).toBe("from message");
  });

  it("gives a friendly message for a Mongo duplicate key error", () => {
    const error = makeAxiosError({ code: 11000, keyValue: { email: "a@b.com" } });
    expect(extractErrorMessage(error)).toBe("That email is already in use.");
  });

  it("extracts the first message from a Mongoose ValidationError shape", () => {
    const error = makeAxiosError({
      errors: {
        title: { message: "Title is required" },
      },
    });
    expect(extractErrorMessage(error)).toBe("Title is required");
  });

  it("falls back to a generic message when the shape is unrecognized", () => {
    const error = makeAxiosError({ somethingUnexpected: true });
    expect(extractErrorMessage(error)).toBe("Something went wrong. Please try again.");
  });

  it("handles a non-axios error", () => {
    expect(extractErrorMessage(new Error("network down"))).toBe("network down");
  });
});