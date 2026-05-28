import { motion } from "framer-motion";

export default function InsertCoinScene() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        // Atualizado: Adicionada a imagem de fundo com propriedades de posicionamento e cobertura
        backgroundImage: "url('src/assets/background-pasta.png')", 
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        // Opcional: Mistura a imagem com um fundo preto para dar mais contraste ao texto
        backgroundColor: "rgba(0, 0, 0, 0.2)", 
        backgroundBlendMode: "overlay",
        
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
                    @font-face {
                        font-family: 'SFAlpha3Custom';
                        src: url('/fonts/street-fighter-alpha-3-xl.ttf') format('truetype');
                    }

                    @keyframes crtRefresh {
                        0% { opacity: 0.98; }
                        50% { opacity: 1; }
                        100% { opacity: 0.99; }
                    }

                    .crt-overlay {
                        position: absolute;
                        inset: 0;
                        pointer-events: none;
                        z-index: 50;

                        background: repeating-linear-gradient(
                            rgba(0,0,0,0.18) 0px,
                            rgba(0,0,0,0.18) 2px,
                            transparent 2px,
                            transparent 4px
                        );

                        box-shadow:
                            inset 0 0 120px rgba(0,0,0,0.8);

                        animation: crtRefresh 0.12s infinite;
                    }

                    .insert-coin-text {
                        font-family: 'SFAlpha3Custom', sans-serif;
                        font-size: 4rem;
                        letter-spacing: 2px;

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
                            drop-shadow(4px 4px 0px #000044)
                            drop-shadow(0 0 12px #3ea6ff);
                    }
                `,
        }}
      />

      {/* LOGO */}
      <motion.img
        src="src/assets/logo.png"
        alt="Logo"
        initial={{
          opacity: 0,
          scale: 0.8,
          y: -30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        style={{
          width: "900px",
          maxWidth: "90vw",
          objectFit: "contain",
          marginBottom: "80px",
          zIndex: 10,
          filter: `
                        drop-shadow(0 0 25px rgba(255,255,255,0.15))
                        drop-shadow(0 0 50px rgba(255,255,0,0.15))
                    `,
        }}
      />

      {/* INSERT COIN */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0.15, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
        className="insert-coin-text"
        style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        INSERT COIN
      </motion.div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, transparent 45%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
          zIndex: 30,
        }}
      />

      {/* CRT */}
      <div className="crt-overlay" />
    </div>
  );
}