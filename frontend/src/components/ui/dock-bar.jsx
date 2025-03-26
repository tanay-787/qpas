import { motion } from "framer-motion";

export function DockBar({ children }) {
  return (
    <div className="sticky bottom-20 w-fit z-[100]">
      <div className="flex justify-center">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative bg-background/80 border rounded-full px-4 py-2 shadow-lg flex items-center gap-2"
        >
          {/* Background Blur Layer */}
          <div className="absolute inset-0 backdrop-blur-lg rounded-full"></div>

          {/* Content Layer (Keeps text/components sharp) */}
          <div className="relative flex items-center gap-2">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
