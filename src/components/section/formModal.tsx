import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'

interface Props {
    isOpen?: boolean
    onClose?: () => void
    children: React.ReactNode
    isDirectChildren: boolean
}

function FormModal(props: Props) {
    const { isOpen = false, onClose, children, isDirectChildren } = props

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="absolute inset-0 z-10 h-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                        onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md space-y-6"
                    >
                        {isDirectChildren ? children : <>

                            render inputs by config

                        </>}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default FormModal