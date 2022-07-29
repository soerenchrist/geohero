// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import Cookies from "cookies";

export const createContext = (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts!.req;
  const res = opts!.res;

  const cookie = new Cookies(req, res);
  const userToken = cookie.get("token");

  return {
    req,
    res,
    userToken,
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
