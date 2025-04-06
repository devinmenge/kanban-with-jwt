import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response): Promise<void> => {
  // Step 1: Get the username and password from the request body
  const { username, password } = req.body;

  // Step 2: Validate that username and password were provided
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  try {
    // Step 3: Find the user in the database
    const user = await User.findOne({ where: { username } });

    // Step 4: Check if the user exists
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Step 5: Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Step 6: Check if the password is correct
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid username or password' });
      return;
    }

    // Step 7: Generate a JWT
    const token = jwt.sign(
      { username: user.username }, // Payload: include the username in the JWT
      process.env.JWT_SECRET_KEY as string, // Secret key from .env
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Step 8: Send the JWT back to the client
    res.json({ token });
  } catch (error) {
    // Step 9: Handle any errors (e.g., database errors)
    res.status(500).json({ message: 'Server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;