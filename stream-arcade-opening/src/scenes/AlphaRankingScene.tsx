import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const players = [
    { rank: "15th", name: "RYU", score: "12000", avatar: "/assets/ryu.png" },
    { rank: "14th", name: "KEN", score: "13000", avatar: "/assets/ryu.png" },
    { rank: "13th", name: "CHN", score: "14000", avatar: "/assets/ryu.png" },
    { rank: "12th", name: "GUI", score: "15000", avatar: "/assets/ryu.png" },
    { rank: "11th", name: "ZGF", score: "16000", avatar: "/assets/ryu.png" },
    { rank: "10th", name: "DLS", score: "17000", avatar: "/assets/ryu.png" },
    { rank: "9th", name: "AKM", score: "18000", avatar: "/assets/ryu.png" },
    { rank: "8th", name: "SGT", score: "19000", avatar: "/assets/ryu.png" },
    { rank: "7th", name: "BLK", score: "20000", avatar: "/assets/ryu.png" },
    { rank: "6th", name: "CAM", score: "22000", avatar: "/assets/ryu.png" },
    { rank: "5th", name: "BSN", score: "25000", avatar: "/assets/ryu.png" },
    { rank: "4th", name: "SAK", score: "28000", avatar: "/assets/ryu.png" },
    { rank: "3rd", name: "CHL", score: "32000", avatar: "/assets/ryu.png" },
    { rank: "2nd", name: "SDM", score: "45000", avatar: "/assets/ryu.png" },
    { rank: "1st", name: "KAUE", score: "999999", avatar: "/assets/ryu.png" },
];

const ROW_HEIGHT = 80; // Ajustado para ser mais compacto e caber mais na tela
const ANCHOR_Y = 100; // Começa mais perto do topo

export default function Alpha3RankingScene() {
    const [visiblePlayers, setVisiblePlayers] = useState<typeof players>([]);

    useEffect(() => {
        if (visiblePlayers.length < players.length) {
            const timer = setTimeout(() => {
                setVisiblePlayers((prev) => [...prev, players[prev.length]]);
            }, 260);
            return () => clearTimeout(timer);
        }
    }, [visiblePlayers]);

    return (
        // O container ocupa 100% da altura e largura da tela
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            background: "#000", // Fundo preto padrão de arcade
            overflow: "hidden"
        }}>

            {visiblePlayers.map((player, index) => {
                const count = visiblePlayers.length;
                const targetY = ANCHOR_Y + (count - 1 - index) * ROW_HEIGHT;
                const isWinner = player.rank === "1st";

                return (
                    <motion.div
                        className={`sf-row ${isWinner ? "sf-row-winner" : ""}`}
                        initial={{ x: "100vw", y: ANCHOR_Y, filter: "brightness(3)" }}
                        animate={{
                            x: 0,
                            y: targetY,
                            filter: "brightness(1)" // O brilho intenso volta ao normal
                        }}
                        transition={{
                            x: { type: "spring", stiffness: 150, damping: 20 },
                            filter: { duration: 0.5 }
                        }}
                    >
                        <img
                            src={player.avatar}
                            alt={player.name}
                            style={{
                                width: "55px",
                                height: "55px",
                                marginRight: "15px",
                                border: "3px solid #fff",
                                objectFit: "cover"
                            }}
                        />
                        <div style={{ width: "90px" }}>{player.rank}</div>
                        <div style={{ flexGrow: 1, letterSpacing: "2px" }}>{player.name}</div>
                        <div style={{ fontSize: "1.8rem" }}>{player.score}</div>
                    </motion.div>
                );
            })}
        </div>
    );
}