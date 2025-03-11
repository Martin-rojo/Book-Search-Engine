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

// Keep the existing middleware for RESTful routes (if needed)
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

// Add new context function for Apollo Server
export const authMiddleware = ({ req }: ExpressContextFunctionArgument) => {
  // Get the auth header value
  const authHeader = req.headers.authorization;
  
  // If no token, return empty context
  if (!authHeader) {
    return {};
  }
  
  // Extract the token (format: "Bearer <token>")
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return {};
  }
  
  try {
    // Verify token
    const secretKey = process.env.JWT_SECRET_KEY || '';
    const user = jwt.verify(token, secretKey) as JwtPayload;
    
    // Add user data to context
    return { user };
  } catch {
    // Invalid token
    return {};
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};