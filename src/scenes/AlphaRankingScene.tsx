import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/alpha-ranking.css";

type Player = {
    rank: string;
    name: string;
    score: string;
    avatar: string;
    splash: string;
};

const PLAYER_ASSETS: Record<
    string,
    { avatar: string; splash: string }
> = {
    yourlife: {
        avatar: "src/assets/mateus.png",
        splash: "src/assets/mateus-splash.png",
    },

    kesti7: {
        avatar: "src/assets/kesti.png",
        splash: "src/assets/kesti-splash.png",
    },

    mayoness: {
        avatar: "src/assets/mayoness.png",
        splash: "src/assets/mayoness-splash.png",
    },

    shyanjii: {
        avatar: "src/assets/shyanjii.png",
        splash: "src/assets/shyanjii-splash.png",
    },

    nesquiknn: {
        avatar: "src/assets/nesquiknn.png",
        splash: "src/assets/nesquiknn-splash.png",
    },

    nevs: {
        avatar: "src/assets/nevs.png",
        splash: "src/assets/nevs-splash.png",
    },

    im4rcuss: {
        avatar: "src/assets/im4rcuss.png",
        splash: "src/assets/im4rcuss-splash.png",
    },

    matarainha: {
        avatar: "src/assets/matarainha.png",
        splash: "src/assets/matarainha-splash.png",
    },

    gorod_: {
        avatar: "src/assets/gorod_.png",
        splash: "src/assets/gorod_-splash.png",
    },

    zefferos: {
        avatar: "src/assets/zefferos.png",
        splash: "src/assets/zefferos-splash.png",
    },

    lucluc16: {
        avatar: "src/assets/lucluc16.png",
        splash: "src/assets/lucluc16-splash.png",
    },

    shizuhe: {
        avatar: "src/assets/shizuhe.png",
        splash: "src/assets/shizuhe-splash.png",
    },

    guiilhy: {
        avatar: "src/assets/guiilhy.png",
        splash: "src/assets/guiilhy-splash.png",
    },

    jaocavera: {
        avatar: "src/assets/jaocavera.png",
        splash: "src/assets/jaocavera-splash.png",
    },

    kamo0_o: {
        avatar: "src/assets/kamo0_o.png",
        splash: "src/assets/kamo0_o-splash.png",
    },

    inz4ki: {
        avatar: "src/assets/kamo0_o.png",
        splash: "src/assets/kamo0_o-splash.png",
    },

    udanzo_: {
        avatar: "src/assets/shizuhe.png",
        splash: "src/assets/shizuhe-splash.png",
    },
};

const getOrdinal = (n: number) => {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
};

const CHANNEL_ID = "5f0e76938ea3a875e11ea3a1";
const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaXRhZGVsIiwiZXhwIjoxNzk1NDYyNTY2LCJqdGkiOiI1OWU4YTI1NC0yNTZjLTRlYjEtOGZkOS03NWYzNjIyNjMwZTQiLCJjaGFubmVsIjoiNWYwZTc2OTM4ZWEzYTg3NWUxMWVhM2ExIiwicm9sZSI6Im93bmVyIiwiYXV0aFRva2VuIjoiNUVqZlZkU2VGWUQtLW1mX0tnQUM2N1ctYmxGb2tRalJacGdRUmlyNTlpc3gxM1hBIiwidXNlciI6IjVmMGU3NjkzOGVhM2E4NzI5NjFlYTNhMCIsInVzZXJfaWQiOiIxOTAxNmUzNC02NWRjLTQ5NDYtYjlkNS1kYjdlZjJkMmIwZGQiLCJ1c2VyX3JvbGUiOiJjcmVhdG9yIiwicHJvdmlkZXIiOiJ0d2l0Y2giLCJwcm92aWRlcl9pZCI6IjM5ODE1MjUzIiwiY2hhbm5lbF9pZCI6IjY1YmY4MThjLTEzNTctNDQ4NS05Zjc2LTE4NTczYjMzM2I0YSIsImNyZWF0b3JfaWQiOiJmMzcyNWFlNy03MTk3LTRiOGMtOWRmMS1iOTY2YjY1NmY2NTIifQ.RglgAkAqpMpkJedMi5yU3XbanuaCYNsz5ltMC_r2xRg";

// Configurações de tamanho
const ROW_WIDTH = 1100;
const ROW_HEIGHT = 56;
const ANCHOR_Y = 80;

// Letras que vão se repetir verticalmente nas bordas do arcade
const SIDEBAR_LETTERS = ["R", "A", "N", "K", "I", "N", "G"];

export default function Alpha3RankingScene() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);
    const [showWinnerScreen, setShowWinnerScreen] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.volume = 0.4;
        audio.loop = true;

        const startAudio = async () => {
            try {
                await audio.play();
                console.log("music started");
            } catch (e) {
                console.error("failed to play audio", e);
            }
        };

        // pequeno delay ajuda no OBS Chromium
        const timer = setTimeout(() => {
            startAudio();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch(
                    `https://api.streamelements.com/kappa/v2/points/${CHANNEL_ID}/top?limit=20`,
                    {
                        headers: {
                            Authorization: `Bearer ${JWT}`,
                        },
                    }
                );

                const data = await res.json();
                const list = Array.isArray(data?.users) ? data.users : [];

                const blockedUsers = ["kiuller_", "sery_bot"];

                const filteredList = list.filter(
                    (u: any) =>
                        !blockedUsers.includes((u.username || "").toLowerCase())
                );

                const finalList = filteredList.slice(0, 15);

                const formatted: Player[] = finalList.map((u: any, index: number) => {
                    const username = (u.username || "").toLowerCase();

                    const assets = PLAYER_ASSETS[username] || {
                        avatar: "src/assets/ryu.png",
                        splash: "src/assets/ryu_big.png",
                    };

                    return {
                        rank: `${index + 1}${getOrdinal(index + 1)}`,
                        name: u.username ?? "UNKNOWN",
                        score: String(u.points ?? 0),
                        avatar: assets.avatar,
                        splash: assets.splash,
                    };
                });

                setPlayers(formatted);
            } catch (err) {
                console.error("StreamElements error:", err);
                setPlayers([]);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 15000);

        return () => clearInterval(interval);
    }, []);

    // Controle de entrada: do 15th para o 1st (de baixo para cima)
    useEffect(() => {
        if (!players.length) return;

        if (visiblePlayers.length < players.length) {
            const timer = setTimeout(() => {
                setVisiblePlayers((prev) => {
                    const nextIndex = players.length - 1 - prev.length;
                    const next = players[nextIndex];
                    if (!next) return prev;
                    return [...prev, next];
                });
            }, 260);

            return () => clearTimeout(timer);
        }

        const transitionTimer = setTimeout(() => {
            setShowWinnerScreen(true);
        }, 2000);

        return () => clearTimeout(transitionTimer);
    }, [players, visiblePlayers]);

    const winnerData = players[0];

    return (
        <div style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            background: "#000",
            backgroundImage: "radial-gradient(circle, #1d2d8f 0%, #050510 100%)",
            overflow: "hidden"
        }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @font-face {
                    font-family: 'SFAlpha3Custom';
                    src: url('/fonts/street-fighter-alpha-3-xl.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
                
                .alpha3-font {
                    font-family: 'SFAlpha3Custom', 'Impact', sans-serif;
                    user-select: none;
                }
                
                .motion-row-style-container {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                }

                .alpha3-rank {
                    font-size: 1.4rem !important;
                    width: 110px;
                    min-width: 110px;
                    display: flex;
                    justify-content: flex-start;
                    padding-left: 5px;
                    margin-right: 10px;

                    background: linear-gradient(
                        to bottom,
                        #ffffff 0%,
                        #72d8ff 35%,
                        #3ea6ff 70%,
                        #001a7a 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    filter:
                        drop-shadow(1px 0px 0px #000)
                        drop-shadow(-1px 0px 0px #000)
                        drop-shadow(0px 1px 0px #000)
                        drop-shadow(0px -1px 0px #000)
                        drop-shadow(3px 3px 0px #000044);
                }

                .alpha3-text {
                    font-size: 2.3rem;
                    letter-spacing: -1px;
                    display: inline-block;

                    background: linear-gradient(
                        to bottom,
                        #d9f7ff 0%,
                        #72d8ff 35%,
                        #3ea6ff 65%,
                        #001a7a 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    filter:
                        drop-shadow(1px 0px 0px #000)
                        drop-shadow(-1px 0px 0px #000)
                        drop-shadow(0px 1px 0px #000)
                        drop-shadow(0px -1px 0px #000)
                        drop-shadow(4px 4px 0px #000044);
                }
                
                .alpha3-subname {
                    font-family: 'SFAlpha3Custom', sans-serif;
                    color: #6aff00;
                    font-size: 0.9rem;
                    filter: drop-shadow(1px 1px 0px #000);
                }

                .alpha3-sidebar {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    width: 180px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 4px;
                    align-items: center;
                    z-index: 20;
                    box-shadow: inset 0px 0px 30px rgba(0,0,0,0.85);
                }

                .alpha3-sidebar-left {
                    left: 0;
                    background: linear-gradient(90deg, #12005a 0%, #2d3cff 45%, #5c8dff 100%);
                    border-right: 4px solid #000;
                }

                .alpha3-sidebar-right {
                    right: 0;
                    background: linear-gradient(90deg, #12005a 0%, #2d3cff 45%, #5c8dff 100%);
                    border-left: 4px solid #000;
                }

                .alpha3-sidebar-char {
                    font-family: 'SFAlpha3Custom', sans-serif;
                    color: #000000;
                    font-size: 9.5rem;
                    line-height: 0.9;
                    filter:
                        drop-shadow(6px 6px 0px #6ab7ff)
                        drop-shadow(0px 0px 10px #3ea6ff); 
                }

                @keyframes marqueeLeftToRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }

                .alpha3-marquee-wrapper {
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                    width: 100vw;
                    overflow: hidden;
                    zIndex: 5;
                }

                .alpha3-marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeLeftToRight 12s linear infinite; 
                }

                .alpha3-marquee-block {
                    display: flex;
                    white-space: nowrap;
                    padding-right: 20px; 
                }

                .alpha3-marquee-item {
                    padding: 0 20px; 
                }

                @keyframes marqueeRightToLeft {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }

                .alpha3-marquee-top-wrapper {
                    position: absolute;
                    top: 0px;
                    left: 0;
                    width: 100vw;
                    overflow: hidden;
                    z-index: 5;
                }

                .alpha3-marquee-top-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeRightToLeft 12s linear infinite; 
                }

                @keyframes crtRefresh {
                    0% { opacity: 0.98; }
                    50% { opacity: 1; }
                    100% { opacity: 0.99; }
                }

                .alpha3-crt-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 9999;
                    background: repeating-linear-gradient(
                        rgba(0, 0, 0, 0.25) 0px,
                        rgba(0, 0, 0, 0.25) 2px,
                        transparent 2px,
                        transparent 4px
                    );
                    box-shadow: inset 0 0 120px rgba(0, 0, 0, 0.65);
                    animation: crtRefresh 0.15s infinite;
                }
            `}} />

            {/* BARRAS LATERAIS (Fixas, fora do movimento da câmera) */}
            <div className="alpha3-sidebar alpha3-sidebar-left">
                {SIDEBAR_LETTERS.map((char, idx) => (
                    <span key={`left-${idx}`} className="alpha3-sidebar-char">{char}</span>
                ))}
            </div>

            <div className="alpha3-sidebar alpha3-sidebar-right">
                {SIDEBAR_LETTERS.map((char, idx) => (
                    <span key={`right-${idx}`} className="alpha3-sidebar-char">{char}</span>
                ))}
            </div>

            {/* TELA DE VITÓRIA (1st Colocado) */}
            <AnimatePresence>
                {showWinnerScreen && winnerData && (
                    <>
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 5, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="alpha3-marquee-top-wrapper"
                        >
                            <div className="alpha3-font alpha3-marquee-top-track" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "5.8rem" }}>
                                <div className="alpha3-marquee-block">
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span>
                                </div>
                                <div className="alpha3-marquee-block">
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span> •
                                    <span className="alpha3-marquee-item">SCORE RANKING</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: "-50%" }}
                            animate={{ opacity: 1, scale: 1, x: "-50%" }}
                            style={{
                                position: "absolute",
                                left: "45%",
                                bottom: "12%",
                                height: "75vh",
                                pointerEvents: "none"
                            }}
                        >
                            <img
                                src={winnerData.splash}
                                alt={winnerData.name}
                                style={{ height: "100%", objectFit: "contain", filter: "drop-shadow(5px 5px 0px #000)" }}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 20, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="alpha3-marquee-wrapper"
                        >
                            <div className="alpha3-font alpha3-marquee-track" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "5.8rem" }}>
                                <div className="alpha3-marquee-block">
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span>
                                </div>
                                <div className="alpha3-marquee-block">
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span> •
                                    <span className="alpha3-marquee-item">GoodGuyAdel</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* CONTAINER DA CÂMERA VIRTUAL DINÂMICA */}
            {visiblePlayers.map((player, index) => {
                const count = visiblePlayers.length;
                const isWinner = player.rank === "1st";

                if (showWinnerScreen && !isWinner) return null;

                const targetY = showWinnerScreen && isWinner
                    ? 720
                    : ANCHOR_Y + (count - 1 - index) * (ROW_HEIGHT + 14);

                return (
                    <motion.div
                        key={player.rank}
                        className="alpha3-font motion-row-style-container alpha3-row"
                        layout
                        style={{
                            position: "absolute",
                            width: `${ROW_WIDTH}px`,
                            height: `${ROW_HEIGHT}px`,
                            left: "50%",
                            x: "-50%",
                        }}
                        initial={{ x: "100vw", y: ANCHOR_Y, filter: "brightness(3)" }}
                        animate={{ x: "-50%", y: targetY, filter: "brightness(1)" }}
                        transition={{
                            x: { type: "spring", stiffness: 140, damping: 18 },
                            y: { type: "spring", stiffness: 100, damping: 20 },
                            filter: { duration: 0.4 }
                        }}
                    >
                        <div className="alpha3-rank">
                            {player.rank}
                        </div>

                        <div className="alpha3-text alpha3-player-name">
                            {player.name}
                        </div>

                        <div className="alpha3-text alpha3-player-score">
                            {player.score}
                        </div>

                        <div className="alpha3-avatar-frame">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="alpha3-avatar-image"
                            />
                            <div className="alpha3-font alpha3-subname alpha3-avatar-name">
                                {player.name}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            <div className="alpha3-crt-overlay" />

            <audio ref={audioRef}>
                <source src="/audio/ranking-theme.mp3" type="audio/mpeg" />
            </audio>
        </div>
    );
}