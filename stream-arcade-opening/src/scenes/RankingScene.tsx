import { motion } from "framer-motion";

const players = [
  {
    rank: "01",
    name: "KAUE",
    score: "9999999",
  },
  {
    rank: "02",
    name: "LUCAS",
    score: "7420000",
  },
  {
    rank: "03",
    name: "ANA",
    score: "5500000",
  },
  {
    rank: "04",
    name: "PEDRO",
    score: "4012000",
  },
];

export default function RankingScene() {
  return (
    <div className="ranking-scene">

      {/* Background FX */}
      <div className="background-grid" />
      <div className="scanlines" />
      <div className="noise" />
      <div className="vignette" />

      {/* Title */}
      <motion.div
        initial={{
          opacity: 0,
          y: -200,
          scale: 2,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
        }}
        className="ranking-title"
      >
        TOP FIGHTERS
      </motion.div>

      {/* Cards */}
      <div className="ranking-container">
        {players.map((player, index) => (
          <motion.div
            key={player.rank}
            initial={{
              opacity: 0,
              x: -1200,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 120,
              damping: 16,
            }}
            className={`ranking-card ${
              index === 0 ? "leader" : ""
            }`}
          >

            {/* Shine */}
            <div className="card-shine" />

            {/* Rank */}
            <div className="ranking-rank">
              {player.rank}
            </div>

            {/* Info */}
            <div className="ranking-info">

              <div className="ranking-name">
                {player.name}
              </div>

              <div className="ranking-score">
                {player.score}
              </div>

            </div>

          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="ranking-footer"
      >
        INSERT COIN
      </motion.div>

    </div>
  );
}