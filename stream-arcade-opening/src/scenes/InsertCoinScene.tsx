import { motion } from "framer-motion";

export default function InsertCoinScene() {
  return (
    <div className="scene">

      {/* CRT Overlay */}
      <div className="scanlines" />

      {/* Glow */}
      <div className="vignette" />

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.2, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
        className="insert-coin"
      >
        INSERT COIN
      </motion.div>

    </div>
  );
}