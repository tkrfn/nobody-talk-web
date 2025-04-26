// src/components/Modal.tsx
'use client'
import React from 'react'

type ModalProps = {
  children: React.ReactNode
  onClose: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
