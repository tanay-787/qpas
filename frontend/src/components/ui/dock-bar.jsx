import { motion } from "framer-motion";
import { useRef } from "react";

export function DockBar({ children }) {
  const constraintsRef = useRef(null);

  return (
    <>
      {/* This will constrain the drag area */}
      <div ref={constraintsRef} className="fixed inset-0 z-[99] pointer-events-none" />

      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-background/80 border rounded-full px-4 py-2 shadow-lg flex items-center gap-2 z-[100] backdrop-blur-lg cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }} // for mobile compatibility
      >
        {/* Content Layer */}
        <div className="relative flex items-center gap-2 pointer-events-auto">
          {children}
        </div>
      </motion.div>
    </>
  );
}
