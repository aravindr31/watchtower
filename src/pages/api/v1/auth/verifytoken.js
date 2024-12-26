import speakeasy from "speakeasy";
import { getAccountSecret } from "../../../../lib/authdata";

export const POST = async ({ request }) => {
  const secret = await getAccountSecret();
  const body = await request.json();
  const token = await body.token;
  console.log(token);
  const valid = await speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: token,
    window: 0,
  });
  console.log(valid);
  return new Response(JSON.stringify({ valid: valid }));
};
