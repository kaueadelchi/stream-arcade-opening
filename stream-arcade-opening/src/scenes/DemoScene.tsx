import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOCAL_VIDEOS = [
    "/video/index (1).mp4",
    "/video/index (2).mp4",
    "/video/index (3).mp4",
    "/video/index (4).mp4",
    "/video/index (5).mp4",
    "/video/index.mp4",
];

export default function ArcadeDemoScene() {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const initialVideo = useMemo(() => {
        return LOCAL_VIDEOS[
            Math.floor(Math.random() * LOCAL_VIDEOS.length)
        ];
    }, []);

    const [currentVideo, setCurrentVideo] = useState(initialVideo);

    const forcePlay = async () => {
        const video = videoRef.current;

        if (!video) return;

        try {
            // começa mutado pro autoplay funcionar
            video.muted = true;
            video.defaultMuted = true;
            video.volume = 0;

            await video.play();

            // depois ativa o som
            setTimeout(() => {
                video.muted = false;
                video.volume = 0.6;
            }, 300);

        } catch (err) {
            console.log("Autoplay bloqueado:", err);
        }
    };

    useEffect(() => {
        forcePlay();

        const handleVisibility = () => {
            forcePlay();
        };

        window.addEventListener("focus", handleVisibility);
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.removeEventListener("focus", handleVisibility);
            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );
        };
    }, [currentVideo]);

    const handleEnded = () => {
        let nextVideo = currentVideo;

        while (
            nextVideo === currentVideo &&
            LOCAL_VIDEOS.length > 1
        ) {
            nextVideo =
                LOCAL_VIDEOS[
                Math.floor(Math.random() * LOCAL_VIDEOS.length)
                ];
        }

        setCurrentVideo(nextVideo);
    };

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
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @font-face {
                        font-family: 'SFAlpha3Custom';
                        src: url('/fonts/street-fighter-alpha-3-xl.ttf') format('truetype');
                    }

                    .alpha3-font {
                        font-family: 'SFAlpha3Custom', sans-serif;
                        user-select: none;
                    }

                    .alpha3-demo-text {
                        background: linear-gradient(
                            to bottom,
                            #ffffff 0%,
                            #9fe8ff 20%,
                            #5fc8ff 45%,
                            #2b7dff 70%,
                            #001ca8 100%
                        );

                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        filter:
                            drop-shadow(1px 0px 0px #000)
                            drop-shadow(-1px 0px 0px #000)
                            drop-shadow(0px 1px 0px #000)
                            drop-shadow(0px -1px 0px #000)
                            drop-shadow(4px 4px 0px #000044)
                            drop-shadow(0px 0px 10px #3ea6ff);
                    }

                    .alpha3-insert-coin {
                        background: linear-gradient(
                            to bottom,
                            #ffffff 0%,
                            #b8f2ff 18%,
                            #72d8ff 40%,
                            #3ea6ff 65%,
                            #1b4dff 82%,
                            #001ca8 100%
                        );

                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        filter:
                            drop-shadow(1px 0px 0px #000)
                            drop-shadow(-1px 0px 0px #000)
                            drop-shadow(0px 1px 0px #000)
                            drop-shadow(0px -1px 0px #000)
                            drop-shadow(5px 5px 0px #000033)
                            drop-shadow(0px 0px 12px #4fc3ff);
                    }
                `,
                }}
            />

            <AnimatePresence mode="wait">
                <motion.video
                    key={currentVideo}
                    ref={videoRef}
                    src={currentVideo}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                        videoRef.current?.play().catch(console.error);
                    }}
                    onCanPlay={() => {
                        videoRef.current?.play().catch(console.error);
                    }}
                    onEnded={handleEnded}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        inset: 0,
                        background: "#000",
                        zIndex: 1,
                    }}
                />
            </AnimatePresence>


            {/* CRT Overlay */}
            <div
                className="crt-overlay"
                style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 9999,
                    background: `
            repeating-linear-gradient(
                rgba(0,0,0,0.18) 0px,
                rgba(0,0,0,0.18) 2px,
                transparent 2px,
                transparent 4px
            )
        `,
                    boxShadow: "inset 0 0 120px rgba(0,0,0,0.75)",
                    mixBlendMode: "multiply",
                    opacity: 1,
                }}
            />

            {/* DEMO */}
            <motion.div
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="alpha3-font alpha3-demo-text"
                style={{
                    position: "absolute",
                    top: "26px",
                    left: "36px",
                    zIndex: 100,
                    fontSize: "3rem",
                    letterSpacing: "2px",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                DEMO
            </motion.div>

            {/* INSERT COIN */}
            <motion.div
                animate={{
                    opacity: [1, 0, 1],
                }}
                transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="alpha3-font alpha3-insert-coin"
                style={{
                    position: "absolute",
                    bottom: "60px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 100,
                    fontSize: "3.2rem",
                    letterSpacing: "3px",
                    pointerEvents: "none",
                    userSelect: "none",
                }}
            >
                INSERT COIN
            </motion.div>

        </div>
    );
}