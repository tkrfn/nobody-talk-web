// src/components/FAB.tsx
'use client'
import React, { useState } from 'react'
import { IoAdd } from 'react-icons/io5'
import Modal from './Modal'
import ThreadForm from './ThreadForm'

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <>
      <button
        onClick={open}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg hover:bg-pink-600"
      >
        <IoAdd size={28} />
      </button>

      {isOpen && (
        <Modal onClose={close}>
          <ThreadForm onSuccess={close} />
        </Modal>
      )}
    </>
  )
}
