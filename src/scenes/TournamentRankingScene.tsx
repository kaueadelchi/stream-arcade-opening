import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/tournament.css";
import comingSoonImage from "../assets/logo-tournament.png";
import mateus from "../assets/mateus.png";
import mateusSplash from "../assets/mateus-splash.png";
import kesti from "../assets/kesti.png";
import kestiSplash from "../assets/chunli-classic.gif";
import mayoness from "../assets/mayoness.png";
import mayonessSplash from "../assets/chunli-classic.gif";
import shyanjii from "../assets/shyanjii.png";
import shyanjiiSplash from "../assets/chunli-classic.gif";
import nesquiknn from "../assets/nesquiknn.png";
import nesquiknnSplash from "../assets/chunli-classic.gif";
import nevs from "../assets/nevs.png";
import nevsSplash from "../assets/chunli-classic.gif";
import im4rcuss from "../assets/im4rcuss.png";
import im4rcussSplash from "../assets/chunli-classic.gif";
import gorod from "../assets/gorod_.png";
import gorodSplash from "../assets/chunli-classic.gif";
import zefferos from "../assets/zefferos.png";
import zefferosSplash from "../assets/chunli-classic.gif";
import lucluc16 from "../assets/lucluc16.png";
import lucluc16Splash from "../assets/chunli-classic.gif";
import shizuhe from "../assets/shizuhe.png";
import shizuheSplash from "../assets/chunli-classic.gif";
import guiilhy from "../assets/guiilhy.png";
import guiilhySplash from "../assets/chunli-classic.gif";
import jaocavera from "../assets/jaocavera.png";
import jaocaveraSplash from "../assets/chunli-classic.gif";
import kamo0_o from "../assets/kamo0_o.png";
import kamo0_oSplash from "../assets/chunli-classic.gif";
import shmashiro from "../assets/shmashiro.png";
import shmashiroSplash from "../assets/chunli-classic.gif";
import hytsury from "../assets/hytsury.png";
import hytsurySplash from "../assets/chunli-classic.gif";
import kumarr__ from "../assets/kumarr.png";
import kumarr__Splash from "../assets/chunli-classic.gif";
import hisagi_z from "../assets/hisagi.png";
import hisagi_zSplash from "../assets/chunli-classic.gif";


type Player = {
    rank: string;
    name: string;
    titles: number;
    secondPlaces: number;
    thirdPlaces: number;
    avatar: string;
    splash: string;
};

const getPublicMedia = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
        ? import.meta.env.BASE_URL
        : `${import.meta.env.BASE_URL}/`;
    return `${baseUrl}${path}`;
};

const PLAYER_ASSETS: Record<string, { avatar: string; splash: string }> = {
    yourlife: {
        avatar: mateus,
        splash: mateusSplash,
    },
    kesti7: {
        avatar: kesti,
        splash: kestiSplash,
    },
    mayoness: {
        avatar: mayoness,
        splash: mayonessSplash,
    },
    shyanjii: {
        avatar: shyanjii,
        splash: shyanjiiSplash,
    },
    nesquiknn: {
        avatar: nesquiknn,
        splash: nesquiknnSplash,
    },
    nevs: {
        avatar: nevs,
        splash: nevsSplash,
    },
    im4rcuss: {
        avatar: im4rcuss,
        splash: im4rcussSplash,
    },
    matarainha: {
        avatar: kesti,
        splash: kestiSplash,
    },
    gorod_: {
        avatar: gorod,
        splash: gorodSplash,
    },
    zefferos: {
        avatar: zefferos,
        splash: zefferosSplash,
    },
    lucluc16: {
        avatar: lucluc16,
        splash: lucluc16Splash,
    },
    shizuhe: {
        avatar: shizuhe,
        splash: shizuheSplash,
    },
    guiilhy: {
        avatar: guiilhy,
        splash: guiilhySplash,
    },
    jaocavera: {
        avatar: jaocavera,
        splash: jaocaveraSplash,
    },
    kamo0_o: {
        avatar: kamo0_o,
        splash: kamo0_oSplash,
    },
    inz4ki: {
        avatar: kamo0_o,
        splash: kamo0_oSplash,
    },
    udanzo_: {
        avatar: shizuhe,
        splash: shizuheSplash,
    },
    shmashiro: {
        avatar: shmashiro,
        splash: shmashiroSplash,
    },
    hytsury: {
        avatar: hytsury,
        splash: hytsurySplash,
    },
    kumarr__: {
        avatar: kumarr__,
        splash: kumarr__Splash,
    },
    hisagi_z: {
        avatar: hisagi_z,
        splash: hisagi_zSplash,
    },
};

const getOrdinal = (n: number) => {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
};

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
    const [hasLoadedRanking, setHasLoadedRanking] = useState(false);
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
        let cancelled = false;

        const fetchLeaderboard = async () => {
            const url = getPublicMedia("data/challonge-ranking.json");

            console.log("[Challonge] Buscando:", url);

            try {
                const response = await fetch(url, {
                    cache: "no-store",
                });

                console.log("[Challonge] HTTP:", response.status);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} ao buscar JSON`);
                }

                const data = await response.json();

                console.log("[Challonge] JSON recebido:", data);
                console.log("[Challonge] Jogadores:", data?.players?.length);

                if (!Array.isArray(data?.players)) {
                    throw new Error(
                        "O JSON não contém um array válido em 'players'."
                    );
                }

                const blockedUsers = [
                    "kiuller_",
                    "sery_bot",
                    "badguykauezao",
                    "goodguyadel",
                ];

                const ranking = data.players
                    .filter((player: any) => {
                        const name = String(player.name ?? "")
                            .trim()
                            .toLowerCase();

                        return (
                            name.length > 0 &&
                            !blockedUsers.includes(name)
                        );
                    })
                    .sort(
                        (a: any, b: any) =>
                            Number(b.titles ?? 0) - Number(a.titles ?? 0) ||
                            Number(b.secondPlaces ?? 0) -
                            Number(a.secondPlaces ?? 0) ||
                            Number(b.thirdPlaces ?? 0) -
                            Number(a.thirdPlaces ?? 0)
                    )
                    .slice(0, 15);

                const formatted: Player[] = ranking.map(
                    (player: any, index: number) => {
                        const username = String(player.name)
                            .trim()
                            .toLowerCase();

                        const assets = PLAYER_ASSETS[username] ?? {
                            avatar: mateus,
                            splash: mateusSplash,
                        };

                        return {
                            rank: `${index + 1}${getOrdinal(index + 1)}`,
                            name: String(player.name),
                            titles: Number(player.titles ?? 0),
                            secondPlaces: Number(player.secondPlaces ?? 0),
                            thirdPlaces: Number(player.thirdPlaces ?? 0),
                            avatar: assets.avatar,
                            splash: assets.splash,
                        };
                    }
                );

                console.log("[Challonge] Ranking formatado:", formatted);

                if (!cancelled) {
                    setPlayers(formatted);
                    setHasLoadedRanking(true);

                    // Reinicia a animação quando o ranking muda
                    setVisiblePlayers([]);
                    setShowWinnerScreen(false);
                }
            } catch (error) {
                console.error(
                    "[Challonge] Falha ao carregar ranking:",
                    error
                );

                if (!cancelled) {
                    setPlayers([]);
                    setHasLoadedRanking(true);
                    setVisiblePlayers([]);
                    setShowWinnerScreen(false);
                }
            }
        };

        fetchLeaderboard();

        const interval = window.setInterval(fetchLeaderboard, 60_000);

        return () => {
            cancelled = true;
            window.clearInterval(interval);
        };
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
            background: "#160604",
            backgroundImage: "radial-gradient(circle at center, #6E1D08 0%, #351006 45%, #160604 75%, #080302 100%)",
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

                    .tournament-font {
                    font-family: 'SFAlpha3Custom', 'Impact', sans-serif;
                    user-select: none;
                    }

                    .motion-row-style-container {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    }

                    .tournament-rank {
                    font-size: 1.4rem !important;
                    width: 110px;
                    min-width: 110px;
                    display: flex;
                    justify-content: flex-start;
                    padding-left: 5px;
                    margin-right: 10px;

                    background: linear-gradient(
                        to bottom,
                        #fff4d6 0%,
                        #ffbd59 35%,
                        #f87816 70%,
                        #8f2608 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    filter:
                        drop-shadow(1px 0px 0px #000)
                        drop-shadow(-1px 0px 0px #000)
                        drop-shadow(0px 1px 0px #000)
                        drop-shadow(0px -1px 0px #000)
                        drop-shadow(3px 3px 0px #451204);
                    }

                    .tournament-text {
                    font-size: 2.3rem;
                    letter-spacing: -1px;
                    display: inline-block;

                    background: linear-gradient(
                        to bottom,
                        #fff0c2 0%,
                        #ffbd59 30%,
                        #ff821c 65%,
                        #a9320b 100%
                    );

                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;

                    filter:
                        drop-shadow(1px 0px 0px #000)
                        drop-shadow(-1px 0px 0px #000)
                        drop-shadow(0px 1px 0px #000)
                        drop-shadow(0px -1px 0px #000)
                        drop-shadow(4px 4px 0px #451204);
                    }

                    .tournament-subname {
                    font-family: 'SFAlpha3Custom', sans-serif;
                    color: #ffad42;
                    font-size: 0.9rem;
                    filter: drop-shadow(1px 1px 0px #000);
                    }

                    .tournament-sidebar {
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
                    box-shadow: inset 0px 0px 30px rgba(0, 0, 0, 0.85);
                    }

                    .tournament-sidebar-left {
                    left: 0;
                    background: linear-gradient(
                        90deg,
                        #351006 0%,
                        #a9320b 45%,
                        #f87816 100%
                    );
                    border-right: 4px solid #160604;
                    }

                    .tournament-sidebar-right {
                    right: 0;
                    background: linear-gradient(
                        270deg,
                        #351006 0%,
                        #a9320b 45%,
                        #f87816 100%
                    );
                    border-left: 4px solid #160604;
                    }

                    .tournament-sidebar-char {
                    font-family: 'SFAlpha3Custom', sans-serif;
                    color: #1a0803;
                    font-size: 9.5rem;
                    line-height: 0.9;
                    filter:
                        drop-shadow(6px 6px 0px #ffad42)
                        drop-shadow(0px 0px 10px #f87816);
                    }

                    @keyframes marqueeLeftToRight {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                    }

                    .tournament-marquee-wrapper {
                    position: absolute;
                    bottom: 25px;
                    left: 0;
                    width: 100vw;
                    overflow: hidden;
                    z-index: 5;
                    }

                    .tournament-marquee-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeLeftToRight 12s linear infinite;
                    }

                    .tournament-marquee-block {
                    display: flex;
                    white-space: nowrap;
                    padding-right: 20px;
                    }

                    .tournament-marquee-item {
                    padding: 0 20px;
                    }

                    @keyframes marqueeRightToLeft {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                    }

                    .tournament-marquee-top-wrapper {
                    position: absolute;
                    top: 0px;
                    left: 0;
                    width: 100vw;
                    overflow: hidden;
                    z-index: 5;
                    }

                    .tournament-marquee-top-track {
                    display: flex;
                    width: max-content;
                    animation: marqueeRightToLeft 12s linear infinite;
                    }

                    @keyframes crtRefresh {
                    0% { opacity: 0.98; }
                    50% { opacity: 1; }
                    100% { opacity: 0.99; }
                    }

                    .tournament-crt-overlay {
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
                `
            }} />


            {players.length > 0 && (
                <>
                    <div className="tournament-sidebar tournament-sidebar-left">
                        {SIDEBAR_LETTERS.map((char, idx) => (
                            <span key={`left-${idx}`} className="tournament-sidebar-char">
                                {char}
                            </span>
                        ))}
                    </div>

                    <div className="tournament-sidebar tournament-sidebar-right">
                        {SIDEBAR_LETTERS.map((char, idx) => (
                            <span key={`right-${idx}`} className="tournament-sidebar-char">
                                {char}
                            </span>
                        ))}
                    </div>
                </>
            )}


            {hasLoadedRanking && players.length === 0 && (
                <motion.div
                    className="tournament-coming-soon"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <img
                        src={comingSoonImage}
                        alt="Coming Soon"
                        className="tournament-coming-soon-image"
                    />

                    <h1 className="tournament-coming-soon-title">
                        COMING SOON
                    </h1>

                    <p className="tournament-coming-soon-subtitle">
                        TOURNAMENT RANKING
                    </p>
                </motion.div>
            )}


            {/* TELA DE VITÓRIA (1st Colocado) */}
            <AnimatePresence>
                {showWinnerScreen && winnerData && (
                    <>
                        <motion.div
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 5, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="tournament-marquee-top-wrapper"
                        >
                            <div className="tournament-font tournament-marquee-top-track" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "5.8rem" }}>
                                <div className="tournament-marquee-block">
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span>
                                </div>
                                <div className="tournament-marquee-block">
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament3-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span> •
                                    <span className="tournament-marquee-item">TOURNAMENT RANKING</span>
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
                            className="tournament-marquee-wrapper"
                        >
                            <div className="tournament-font tournament-marquee-track" style={{ color: "rgba(0, 0, 0, 0.5)", fontSize: "5.8rem" }}>
                                <div className="tournament-marquee-block">
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span>
                                </div>
                                <div className="tournament-marquee-block">
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span> •
                                    <span className="tournament-marquee-item">Adel's Fight Club</span>
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
                        className="tournament-font motion-row-style-container tournament-row"
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
                        <div className="tournament-rank">
                            {player.rank}
                        </div>

                        <div className="tournament-text tournament-player-name">
                            {player.name}
                        </div>


                        <div className="tournament-player-score">
                            <div className="tournament-score-item">
                                <span className="tournament-score-count">
                                    {player.titles}
                                </span>
                                <svg className="tournament-medal" viewBox="0 0 32 38" aria-label="Ouro">
                                    <path d="M7 1 L13 1 L16 13 L11 16 Z" fill="#9D4B0D" stroke="#160604" strokeWidth="1.5" />
                                    <path d="M19 1 L25 1 L21 16 L16 13 Z" fill="#FFAD42" stroke="#160604" strokeWidth="1.5" />
                                    <circle cx="16" cy="23" r="10" fill="#A9320B" stroke="#160604" strokeWidth="2" />
                                    <circle cx="16" cy="23" r="7.5" fill="#FFBD59" stroke="#FFE0A0" strokeWidth="1" />
                                    <path d="M16 17 L18 21 L22 21.5 L19 24.5 L20 29 L16 26.5 L12 29 L13 24.5 L10 21.5 L14 21 Z" fill="#FFF0C2" stroke="#8F2608" strokeWidth=".6" />
                                </svg>
                            </div>

                            <div className="tournament-score-item">
                                <span className="tournament-score-count">
                                    {player.secondPlaces}
                                </span>
                                <svg className="tournament-medal" viewBox="0 0 32 38" aria-label="Prata">
                                    <path d="M7 1 L13 1 L16 13 L11 16 Z" fill="#777777" stroke="#160604" strokeWidth="1.5" />
                                    <path d="M19 1 L25 1 L21 16 L16 13 Z" fill="#D6D6D6" stroke="#160604" strokeWidth="1.5" />
                                    <circle cx="16" cy="23" r="10" fill="#777777" stroke="#160604" strokeWidth="2" />
                                    <circle cx="16" cy="23" r="7.5" fill="#E5E5E5" stroke="#FFFFFF" strokeWidth="1" />
                                    <path d="M16 17 L18 21 L22 21.5 L19 24.5 L20 29 L16 26.5 L12 29 L13 24.5 L10 21.5 L14 21 Z" fill="#FFFFFF" stroke="#777777" strokeWidth=".6" />
                                </svg>
                            </div>

                            <div className="tournament-score-item">
                                <span className="tournament-score-count">
                                    {player.thirdPlaces}
                                </span>
                                <svg className="tournament-medal" viewBox="0 0 32 38" aria-label="Bronze">
                                    <path d="M7 1 L13 1 L16 13 L11 16 Z" fill="#713514" stroke="#160604" strokeWidth="1.5" />
                                    <path d="M19 1 L25 1 L21 16 L16 13 Z" fill="#C77B43" stroke="#160604" strokeWidth="1.5" />
                                    <circle cx="16" cy="23" r="10" fill="#713514" stroke="#160604" strokeWidth="2" />
                                    <circle cx="16" cy="23" r="7.5" fill="#CD8750" stroke="#F0B17C" strokeWidth="1" />
                                    <path d="M16 17 L18 21 L22 21.5 L19 24.5 L20 29 L16 26.5 L12 29 L13 24.5 L10 21.5 L14 21 Z" fill="#FFE0C2" stroke="#713514" strokeWidth=".6" />
                                </svg>
                            </div>
                        </div>


                        <div className="tournament-avatar-frame">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="tournament-avatar-image"
                            />
                            <div className="tournament-font tournament-subname tournament-avatar-name">
                                {player.name}
                            </div>
                        </div>
                    </motion.div>
                );
            })}

            <div className="tournament-crt-overlay" />

            <audio ref={audioRef} src={getPublicMedia("audio/ranking-theme.mp3")} />
        </div>
    );
}