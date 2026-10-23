
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    ".."
);

const OUTPUT_PATH = path.join(
    ROOT,
    "public",
    "data",
    "challonge-ranking.json"
);

const API_BASE = "https://api.challonge.com/v1";
const PER_PAGE = 100;

// Carrega .env.local sem depender de bibliotecas adicionais.
// Variáveis já definidas no ambiente têm prioridade.
async function loadLocalEnv() {
    const envPath = path.join(ROOT, ".env.local");

    try {
        const content = await fs.readFile(envPath, "utf8");

        for (const line of content.split(/\r?\n/)) {
            const match = line.match(
                /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/
            );

            if (!match) continue;

            const [, key, rawValue] = match;
            let value = rawValue;

            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            } else {
                value = value.replace(/\s+#.*$/, "");
            }

            if (process.env[key] === undefined) {
                process.env[key] = value;
            }
        }
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
}

function getCollection(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (payload?.data && typeof payload.data === "object") {
        return [payload.data];
    }

    throw new Error("A API retornou um formato inesperado.");
}

async function challongeGet(endpoint, params = {}) {
    const url = new URL(`${API_BASE}${endpoint}`);

    url.searchParams.set("api_key", process.env.CHALLONGE_API_KEY);

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
    }

    url.searchParams.set("format", "json");

    const response = await fetch(url, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const body = await response.text();

        throw new Error(
            `Challonge API v1: HTTP ${response.status} em ${endpoint}. ` +
            body.slice(0, 300)
        );
    }

    return response.json();
}

async function fetchAll(endpoint, params = {}) {
    const results = [];

    for (let page = 1; ; page++) {
        const payload = await challongeGet(endpoint, {
            ...params,
            page,
            per_page: PER_PAGE,
        });

        const items = getCollection(payload);
        results.push(...items);

        if (items.length < PER_PAGE) break;
    }

    return results;
}

function getAttributes(item) {
    return item?.attributes ?? item?.tournament ?? item?.participant ?? item;
}

function getTournamentId(tournament) {
    const attributes = getAttributes(tournament);
    return tournament?.id ?? attributes?.id;
}

function normalizeName(name) {
    return String(name ?? "")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("pt-BR");
}

async function main() {
    await loadLocalEnv();

    if (!process.env.CHALLONGE_API_KEY) {
        throw new Error(
            "CHALLONGE_API_KEY não foi definida. Configure-a em .env.local."
        );
    }

    console.log("Buscando torneios encerrados no Challonge...");

    const tournaments = await fetchAll("/tournaments.json", {
        state: "ended",
    });

    if (tournaments.length === 0) {
        console.warn(
            "Nenhum torneio encerrado encontrado. " +
            "O JSON atual será preservado."
        );
        return;
    }

    console.log(`Torneios encontrados: ${tournaments.length}`);

    const playersByName = new Map();
    let processedTournaments = 0;

    for (const tournament of tournaments) {
        const tournamentId = getTournamentId(tournament);
        const tournamentAttributes = getAttributes(tournament);
        const tournamentName =
            tournamentAttributes?.name ?? `Torneio ${tournamentId}`;

        if (!tournamentId) {
            console.warn("Torneio sem ID ignorado:", tournamentName);
            continue;
        }

        console.log(`Lendo participantes: ${tournamentName}`);

        const participants = await fetchAll(
            `/tournaments/${encodeURIComponent(tournamentId)}/participants.json`
        );

        for (const participant of participants) {
            const attributes = getAttributes(participant);
            const finalRank = Number(attributes?.final_rank);

            if (![1, 2, 3].includes(finalRank)) continue;

            const name = String(
                attributes?.name ?? attributes?.display_name ?? attributes?.username ?? ""
            ).trim();

            if (!name) continue;

            const key = normalizeName(name);
            if (!key) continue;

            if (!playersByName.has(key)) {
                playersByName.set(key, {
                    name,
                    titles: 0,
                    secondPlaces: 0,
                    thirdPlaces: 0,
                });
            }

            const player = playersByName.get(key);

            if (finalRank === 1) player.titles++;
            if (finalRank === 2) player.secondPlaces++;
            if (finalRank === 3) player.thirdPlaces++;
        }

        processedTournaments++;
    }

    if (processedTournaments === 0) {
        throw new Error(
            "Nenhum torneio pôde ser processado. O JSON existente foi preservado."
        );
    }

    const players = [...playersByName.values()].sort(
        (a, b) =>
            b.titles - a.titles ||
            b.secondPlaces - a.secondPlaces ||
            b.thirdPlaces - a.thirdPlaces ||
            a.name.localeCompare(b.name, "pt-BR")
    );

    const output = {
        generatedAt: new Date().toISOString(),
        totalTournaments: processedTournaments,
        totalPlayers: players.length,
        players,
    };

    await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

    await fs.writeFile(
        OUTPUT_PATH,
        `${JSON.stringify(output, null, 2)}\n`,
        "utf8"
    );

    console.log("\nRanking atualizado com sucesso!");
    console.log(`Torneios processados: ${processedTournaments}`);
    console.log(`Jogadores com pódios: ${players.length}`);
    console.log(`Arquivo: ${OUTPUT_PATH}`);
}

main().catch((error) => {
    console.error("\nFalha ao gerar o ranking:", error.message);
    process.exitCode = 1;
});
