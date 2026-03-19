import { motion } from "framer-motion"
import { CircleCheck } from "lucide-react"

export default function ProgressIndicator({ current, total }) {

  const progress = (current / total) * 100

  return (
    <div className="w-full mb-6">

      {/* progress bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120 }}
        />
      </div>

      {/* text */}
      <div className="flex justify-between text-sm text-slate-500 mt-2">
        <span>Question {current} / {total}</span>
        {current === total && (
          <span className="flex items-center gap-1 text-green-600">
            <CircleCheck size={16} /> Ready to Finish
          </span>
        )}
      </div>

    </div>
  )
}