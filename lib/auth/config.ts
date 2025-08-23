import { NextAuthOptions, AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'
import bcryptjs from 'bcryptjs'

const providers: any[] = [
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      console.log('🔐 AUTHORIZE CALLED with:', credentials?.email)
      
      if (!credentials?.email || !credentials?.password) {
        console.log('❌ Missing credentials')
        return null
      }

      const user = await prisma.user.findUnique({
        where: {
          email: credentials.email
        }
      })

      if (!user || !user.password) {
        console.log('❌ User not found or no password')
        return null
      }

      console.log('🔐 Checking password...')
      console.log('  User password hash:', user.password?.substring(0, 20) + '...')
      console.log('  Credentials password:', credentials.password)
      
      const isPasswordValid = await bcryptjs.compare(
        credentials.password,
        user.password
      )
      
      console.log('  Password valid:', isPasswordValid)

      if (!isPasswordValid) {
        console.log('❌ Invalid password')
        return null
      }
      
      console.log('✅ Auth successful for:', user.email)

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      })

      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        image: user.image || undefined
      }
    }
  })
]

// Add OAuth providers only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code"
      }
    }
  }))
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }))
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('🔴 NextAuth Error:', code, metadata)
    },
    warn(code) {
      console.warn('🟡 NextAuth Warning:', code)
    },
    debug(code, metadata) {
      console.log('🔵 NextAuth Debug:', code, metadata)
    }
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (!dbUser) {
            // Create new user
            const role = user.email === 'puladesign@gmail.com' ? 'ADMIN' : 'STUDENT'
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                role: role,
                emailVerified: new Date()
              }
            })
          } else if (user.email === 'puladesign@gmail.com' && dbUser.role !== 'ADMIN') {
            // Update existing user to admin
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { role: 'ADMIN' }
            })
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        // Initial sign in
        if (account.provider === 'credentials') {
          // For credentials, user object already has all fields
          token.id = user.id
          token.role = user.role
          token.email = user.email
          token.name = user.name
        } else {
          // For OAuth providers, fetch from database
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (dbUser) {
            token.id = dbUser.id
            token.role = dbUser.role
            token.email = dbUser.email
            token.name = dbUser.name
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
}