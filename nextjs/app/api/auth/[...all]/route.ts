import auth from "@/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { POST: betterAuthPOST, GET: betterAuthGET } = toNextJsHandler(auth);

export async function POST(req: Request) {
  return betterAuthPOST(req);
}

export async function GET(req: Request) {
  return betterAuthGET(req);
}
