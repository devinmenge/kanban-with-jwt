import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the shape of the JWT payload
interface JwtPayload {
  username: string;
}

// Extend the Request type to include a user property
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Explicitly type the function to return void
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided' }); // Remove "return"
    return; // Add an explicit return to end the function
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' }); // Remove "return"
      return; // Add an explicit return
    }

    req.user = decoded as JwtPayload;
    next();
  });
};