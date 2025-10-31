'use client'

import dynamic from "next/dynamic"

const AuthModal = dynamic(() => import("./AuthModal"), {
  loading: () => <div className="modal-loading">Loading...</div>,
  ssr: false // Skip SSR for modals since they're only shown on user interaction
})

export default function ClientAuthModal() {
  return <AuthModal />
}