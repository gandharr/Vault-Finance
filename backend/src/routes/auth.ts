import { Router, Request, Response } from 'express'
import { db } from '../db.js'
import type { User, AuthDraft } from '../types.js'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string }

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' })
      return
    }

    const user = await db.getUser(email)

    if (!user || user.password !== password) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
})

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, fullName, password } = req.body as AuthDraft

    if (!email || !fullName || !password) {
      res.status(400).json({ error: 'Email, fullName and password required' })
      return
    }

    const existingUser = await db.getUser(email)

    if (existingUser) {
      res.status(409).json({ error: 'User already exists' })
      return
    }

    const user: User = {
      email,
      fullName,
      password,
      theme: 'light',
      role: 'admin',
    }

    const savedUser = await db.createUser(user)
    const { password: _, ...userWithoutPassword } = savedUser
    res.status(201).json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' })
  }
})

router.get('/current', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string

    if (!email) {
      res.status(400).json({ error: 'Email required' })
      return
    }

    const user = await db.getUser(email)

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get current user' })
  }
})

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body as { email: string; newPassword: string }

    if (!email || !newPassword) {
      res.status(400).json({ error: 'Email and newPassword required' })
      return
    }

    const updatedUser = await db.updateUser(email, { password: newPassword })

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' })
  }
})

export default router

