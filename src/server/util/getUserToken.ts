import { IncomingMessage, ServerResponse } from "http";
import Cookies from "cookies";
import { nanoid } from "nanoid";

export const getUserToken = (req: IncomingMessage, res: ServerResponse) => {
  var cookies = new Cookies(req, res);
  let token = cookies.get("token");
  if (!token) {
    token = nanoid();
    cookies.set("token", token);
  }

  return token;
};
