'use client'

import { create } from 'zustand'

interface AuthModalState {
  isOpen: boolean
  mode: 'login' | 'signup'
  openModal: (mode: 'login' | 'signup') => void
  closeModal: () => void
}

export const useAuthModal = create<AuthModalState>((set) => ({
  isOpen: false,
  mode: 'login',
  openModal: (mode: 'login' | 'signup') => set({ isOpen: true, mode }),
  closeModal: () => set({ isOpen: false })
}))