import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExpressContextFunctionArgument } from 'apollo-server-express';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

// Add this new function for GraphQL context
export const authMiddleware = ({ req }: ExpressContextFunctionArgument) => {
  // Get the token from the headers
  let token = req.headers.authorization || '';

  // Format is "Bearer <token>", so remove "Bearer " to get just the token
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  // If no token, return an empty context object
  if (!token) {
    return {};
  }

  try {
    // Verify the token
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const user = jwt.verify(token, secretKey) as JwtPayload;
    
    // Add the user data to the context
    return { user };
  } catch {
    // If token verification fails, return an empty context object
    return {};
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};