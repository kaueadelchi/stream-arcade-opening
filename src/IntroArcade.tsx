import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import ArcadeDemoScene from "./scenes/DemoScene";
import Alpha3RankingScene from "./scenes/AlphaRankingScene";
import TitleScreenScene from "./scenes/InsertCoinScene"

type SceneType = "demo" | "ranking" | "title";

export default function ArcadeController() {
    const [scene, setScene] = useState<SceneType>("title");

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (scene === "title") {
            timer = setTimeout(() => {
                setScene("demo");
            }, 10000); // 30s demo
        }

        if (scene === "demo") {
            timer = setTimeout(() => {
                setScene("ranking");
            }, 20000); // 30s demo
        }

        if (scene === "ranking") {
            timer = setTimeout(() => {
                setScene("title");
            }, 20000); // 45s ranking
        }

        return () => clearTimeout(timer);
    }, [scene]);

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

            </AnimatePresence>
        </div>
    );
}