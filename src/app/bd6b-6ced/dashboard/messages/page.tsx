'use client';

import { motion, Variants } from 'framer-motion';
import { Mail } from 'lucide-react';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
};

export default function MessagesPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 pb-12"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-4xl font-extrabold text-white font-bricolage tracking-tight leading-none">
          Inbox
        </h1>
        <p className="text-gray-400 text-base font-medium">
          Manage conversations, client messages, and direct mail inquiries.
        </p>
      </motion.div>
      <motion.div variants={itemVariants} className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[30vh] gap-4">
        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
          <Mail className="w-8 h-8" />
        </div>
        <p className="text-gray-400 text-lg font-medium">Messages inbox coming soon...</p>
      </motion.div>
    </motion.div>
  );
}
