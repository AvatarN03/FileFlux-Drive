import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export const signingToken = ({
  data,
  expireDays,
}: {
  data: object;
  expireDays?: StringValue | number;
}) => {
  const secret = process.env.JWT_SECRET_KEY!;
  
  const options: SignOptions = {
    expiresIn: expireDays ?? "12h",
  };

  return jwt.sign(data, secret, options);
};



export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as JwtPayload;

    return {
      valid: true,
      expired: false,
      value: decoded,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { valid: false, expired: true, value: null };
    }

    return { valid: false, expired: false, value: null };
  }
};