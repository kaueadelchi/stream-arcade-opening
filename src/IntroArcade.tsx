import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ArcadeDemoScene from "./scenes/DemoScene";
import Alpha3RankingScene from "./scenes/AlphaRankingScene";
import TitleScreenScene from "./scenes/InsertCoinScene";
import TournamentRankingScene from "./scenes/TournamentRankingScene";

type SceneType = "demo" | "ranking" | "title" | "title2" | "demo2" | "tournament";

export default function ArcadeController() {
    const [scene, setScene] = useState<SceneType>("title");
    const [nextRanking, setNextRanking] = useState<"ranking" | "tournament">("ranking");

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        switch (scene) {
            case "title":
                timer = setTimeout(() => {
                    setScene("demo");
                }, 10000);
                break;

            case "demo":
                timer = setTimeout(() => {
                    setScene(nextRanking);
                }, 20000);
                break;

            case "ranking":
            case "tournament":
                timer = setTimeout(() => {
                    setNextRanking(
                        scene === "ranking" ? "tournament" : "ranking"
                    );
                    setScene("title");
                }, 20000);
                break;
        }

        return () => clearTimeout(timer);
    }, [scene, nextRanking]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                position: "relative",
                background: "#000",
            }}
        >
            <AnimatePresence mode="wait">

                {scene === "title" && (
                    <motion.div
                        key="title"
                        initial={{
                            opacity: 0,
                            scale: 1.05,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            filter: "blur(12px)",
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <TitleScreenScene />
                    </motion.div>
                )}

                {scene === "demo" && (
                    <motion.div
                        key="demo"
                        initial={{
                            opacity: 0,
                            scale: 1.05,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            filter: "blur(12px)",
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <ArcadeDemoScene />
                    </motion.div>
                )}

                {scene === "ranking" && (
                    <motion.div
                        key="ranking"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(12px)",
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{
                            opacity: 0,
                            scale: 1.1,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <Alpha3RankingScene />
                    </motion.div>
                )}

                {scene === "tournament" && (
                    <motion.div
                        key="tournament"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(12px)",
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{
                            opacity: 0,
                            scale: 1.1,
                        }}
                        transition={{
                            duration: 0.8,
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                        }}
                    >
                        <TournamentRankingScene />
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}