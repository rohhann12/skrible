import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import crypto from "crypto";

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const SALT_ROUNDS = 10

export async function register(email: string, password: string): Promise<string> {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new Error('Email already registered')
  }
  const id=crypto.randomUUID()
  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { id: id, email, password: hashed },
  })

  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })
}

export async function login(email: string, password: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid credentials')
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error('Invalid credentials')
  }

  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyToken(token: string): { id: string; email: string } {
  return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
}
