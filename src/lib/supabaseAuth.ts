import { supabase } from './supabaseClient'
import { AuthError } from '@supabase/supabase-js'

// Guest login credentials (hardcoded as per requirements)
const GUEST_CREDENTIALS = {
  email: 'guest@gmail.com',
  password: 'guest123'
}

export const signInWithPassword = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    
    if (error) {
      throw error;
    }
    
    return { data, error }
  } catch (error) {
    console.error('Sign in error:', error)
    return { 
      data: null, 
      error: error as AuthError 
    }
  }
}

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    return { data, error }
  } catch (error) {
    console.error('Sign up error:', error)
    return { 
      data: null, 
      error: error as AuthError 
    }
  }
}

export const signInAsGuest = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: GUEST_CREDENTIALS.email,
      password: GUEST_CREDENTIALS.password,
    })
    
    return { data, error }
  } catch (error) {
    console.error('Guest sign in error:', error)
    return { 
      data: null, 
      error: error as AuthError 
    }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error: error as AuthError }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error: error as AuthError }
  }
}

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (error) {
    console.error('Get session error:', error)
    return { session: null, error: error as AuthError }
  }
}