'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { User, UserType } from '@/types'

interface AuthContextType {
  currentUser: FirebaseUser | null
  userData: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, nome: string, telefone: string, cidade: string, tipo: UserType) => Promise<string>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false)
      return
    }
    const authRef = auth
    const dbRef = db
    const unsubscribe = onAuthStateChanged(authRef, async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Garante que o token está ativo antes de ler Firestore (evita "Missing or insufficient permissions" no Listen/getDoc).
        await user.getIdToken(true)
        // Buscar dados do usuário no Firestore (dbRef já validado no início do effect)
        const userDoc = await getDoc(doc(dbRef, 'users', user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData({
            uid: user.uid,
            nome: data.nome,
            tipo: data.tipo === 'prestador' ? 'prestador' : 'cliente',
            telefone: data.telefone,
            cidade: data.cidade,
            criadoEm: data.criadoEm?.toDate() || new Date(),
            subscriptionStatus: data.subscriptionStatus,
            stripeCustomerId: data.stripeCustomerId,
            stripeSubscriptionId: data.stripeSubscriptionId,
          })
        } else {
          setUserData(null)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth não disponível')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (
    email: string,
    password: string,
    nome: string,
    telefone: string,
    cidade: string,
    tipo: UserType
  ): Promise<string> => {
    if (!auth) throw new Error('Firebase não disponível')
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    await user.getIdToken(true)
    await updateProfile(user, { displayName: nome })

    // Documento em Firestore é criado no servidor via POST /api/user/create-document (evita "Missing or insufficient permissions" em produção).
    // O SignUpForm chama essa API após o signUp e depois refreshUserData().
    return user.uid
  }

  const signInWithGoogle = async () => {
    if (!auth || !db) throw new Error('Firebase não disponível')
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // Verificar se o usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    
    if (!userDoc.exists()) {
      // Criar documento no Firestore para novo usuário
      const userData: Omit<User, 'criadoEm'> & { criadoEm: any } = {
        uid: user.uid,
        nome: user.displayName || 'Usuário',
        tipo: 'cliente', // Padrão: cliente
        telefone: user.phoneNumber || '',
        cidade: '',
        criadoEm: serverTimestamp(),
      }

      await setDoc(doc(db, 'users', user.uid), userData)
    }
  }

  const logout = async () => {
    if (auth) await signOut(auth)
    setUserData(null)
  }

  const refreshUserData = async () => {
    if (!currentUser || !db) return
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
    if (userDoc.exists()) {
      const data = userDoc.data()
      setUserData({
        uid: currentUser.uid,
        nome: data.nome,
        tipo: data.tipo === 'prestador' ? 'prestador' : 'cliente',
        telefone: data.telefone,
        cidade: data.cidade,
        criadoEm: data.criadoEm?.toDate() || new Date(),
        subscriptionStatus: data.subscriptionStatus,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
      })
    }
  }

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    refreshUserData,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

