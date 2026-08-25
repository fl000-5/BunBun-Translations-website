require("dotenv").config();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const express = require("express");
const session = require("express-session");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
const port = Number(process.env.PORT || 3000);
const root = __dirname;
const dataDir = path.join(root, "data");
const chaptersFile = path.join(dataDir, "chapters.json");
const apiVersion = "v10";

const config = {
  botToken: process.env.DISCORD_BOT_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  redirectUri: process.env.DISCORD_REDIRECT_URI || `http://localhost:${port}/api/auth/discord/callback`,
  guildId: process.env.DISCORD_GUILD_ID,
  countChannelId: process.env.DISCORD_COUNT_CHANNEL_ID,
  translatorRoleId: process.env.DISCORD_TRANSLATOR_ROLE_ID,
  sessionSecret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
  publicSiteUrl: process.env.PUBLIC_SITE_URL || ""
};

let discordClient = null;
let discordReady = Promise.resolve(false);

if (config.botToken) {
  discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
  });

  discordReady = discordClient.login(config.botToken)
    .then(() => {
      console.log(`Discord bot zalogowany jako ${discordClient.user.tag}`);
      return true;
    })
    .catch((error) => {
      console.error("Nie udało się zalogować bota Discord:", error.message);
      return false;
    });
} else {
  console.warn("Brak DISCORD_BOT_TOKEN. Strona działa, ale endpointy Discorda zwrócą błąd konfiguracji.");
}

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use((req, res, next) => {
  if (config.publicSiteUrl) {
    const origin = req.headers.origin;
    if (origin === new URL(config.publicSiteUrl).origin) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    }
  }

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: "2mb" }));
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: config.publicSiteUrl ? "none" : "lax",
    secure: Boolean(config.publicSiteUrl)
  }
}));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, discordConfigured: Boolean(config.botToken && config.guildId) });
});

app.get("/api/auth/discord/start", (req, res) => {
  if (!config.clientId || !config.redirectUri) {
    res.status(500).send("Brakuje DISCORD_CLIENT_ID albo DISCORD_REDIRECT_URI w .env");
    return;
  }

  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state;
  req.session.returnTo = safeReturnTo(req.query.returnTo);

  const url = new URL("https://discord.com/oauth2/authorize");
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify");
  url.searchParams.set("state", state);
  res.redirect(url.toString());
});

app.get("/api/auth/discord/callback", async (req, res, next) => {
  try {
    if (!req.query.code || req.query.state !== req.session.oauthState) {
      res.status(400).send("Nieprawidłowy powrót z Discord OAuth.");
      return;
    }
    if (!config.clientId || !config.clientSecret) {
      res.status(500).send("Brakuje DISCORD_CLIENT_ID albo DISCORD_CLIENT_SECRET w .env");
      return;
    }

    const tokenResponse = await fetch(`https://discord.com/api/${apiVersion}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "authorization_code",
        code: String(req.query.code),
        redirect_uri: config.redirectUri
      })
    });

    if (!tokenResponse.ok) {
      res.status(502).send("Discord nie zwrócił tokenu OAuth.");
      return;
    }

    const token = await tokenResponse.json();
    const userResponse = await fetch(`https://discord.com/api/${apiVersion}/users/@me`, {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });

    if (!userResponse.ok) {
      res.status(502).send("Nie udało się pobrać profilu Discord.");
      return;
    }

    const discordUser = await userResponse.json();
    req.session.user = await normalizeDiscordUser(discordUser);
    const returnTo = req.session.returnTo || "/";
    delete req.session.oauthState;
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: "not_logged_in" });
    return;
  }

  if (discordClient && req.session.user.id) {
    req.session.user = await fetchDiscordUser(req.session.user.id).catch(() => req.session.user);
  }
  res.json(req.session.user);
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/chapters", (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ chapters: readPublishedChapters() });
});

app.post("/api/chapters/publish", (req, res) => {
  const syncKey = String(process.env.BUNBUN_CONTENT_SYNC_KEY || "").trim();
  if (syncKey && req.get("x-bunbun-sync-key") !== syncKey) {
    res.status(401).json({ error: "invalid_sync_key" });
    return;
  }

  const body = req.body || {};
  const chapter = body.chapter;
  const titleId = String(body.titleId || body.titleSlug || body.title?.id || "").trim();
  const titleName = String(body.titleName || body.title?.name || body.title?.title || "").trim();
  if (!titleId || !chapter?.id) {
    res.status(400).json({ error: "titleId_and_chapter_id_required" });
    return;
  }

  const chapters = readPublishedChapters();
  const index = chapters.findIndex((item) => item.chapter?.id === chapter.id);
  const entry = {
    titleId,
    ...(titleName ? { titleName } : {}),
    chapter: {
      ...chapter,
      id: String(chapter.id),
      date: chapter.date || new Date().toISOString(),
      likes: Number(chapter.likes) || 0
    }
  };
  if (index >= 0) chapters[index] = entry;
  else chapters.push(entry);
  writePublishedChapters(chapters);
  res.json({ ok: true });
});

app.get("/api/discord/stats", async (req, res, next) => {
  try {
    const guild = await getGuild();
    const channelId = String(req.query.channelId || config.countChannelId || "").trim();
    const roleId = String(req.query.translatorRoleId || config.translatorRoleId || "").trim();

    const channelMembers = channelId ? await readMemberCountFromChannel(channelId) : null;
    const members = channelMembers ?? guild.memberCount ?? null;
    const translators = roleId ? await countRoleMembers(guild, roleId) : null;

    res.json({ members, translators });
  } catch (error) {
    next(error);
  }
});

app.get("/api/discord/users/:id", async (req, res, next) => {
  try {
    const user = await fetchDiscordUser(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(root));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: error.message || "server_error" });
});

app.listen(port, () => {
  console.log(`BunBun działa na http://localhost:${port}`);
});

function readPublishedChapters() {
  try {
    if (!fs.existsSync(chaptersFile)) return [];
    const parsed = JSON.parse(fs.readFileSync(chaptersFile, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePublishedChapters(chapters) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(chaptersFile, JSON.stringify(chapters, null, 2), "utf8");
}

async function getGuild() {
  if (!discordClient || !config.guildId) throw new Error("Brakuje DISCORD_BOT_TOKEN albo DISCORD_GUILD_ID w .env");
  const ready = await discordReady;
  if (!ready) throw new Error("Bot Discord nie jest zalogowany");
  return discordClient.guilds.fetch(config.guildId);
}

async function readMemberCountFromChannel(channelId) {
  const channel = await discordClient.channels.fetch(channelId).catch(() => null);
  if (!channel || !channel.name) return null;
  const match = channel.name.match(/\d[\d\s.,]*/);
  if (!match) return null;
  const value = Number(match[0].replace(/[^0-9]/g, ""));
  return Number.isFinite(value) ? value : null;
}

async function countRoleMembers(guild, roleId) {
  const role = await guild.roles.fetch(roleId).catch(() => null);
  if (!role) return null;
  try {
    await guild.members.fetch();
  } catch (_error) {
    // Wymaga włączenia Server Members Intent w Discord Developer Portal.
  }
  return role.members.size;
}

async function fetchDiscordUser(userId) {
  if (!discordClient) throw new Error("Bot Discord nie jest skonfigurowany");
  await discordReady;
  const discordUser = await discordClient.users.fetch(userId);
  return normalizeDiscordUser(discordUser);
}

async function normalizeDiscordUser(discordUser) {
  const id = discordUser.id;
  let member = null;
  if (config.guildId && discordClient) {
    const guild = await discordClient.guilds.fetch(config.guildId).catch(() => null);
    member = guild ? await guild.members.fetch(id).catch(() => null) : null;
  }

  const roleNames = member ? member.roles.cache
    .filter((role) => role.name !== "@everyone")
    .map((role) => role.name) : [];
  if (!roleNames.includes("Czytelnik")) roleNames.push("Czytelnik");

  const username = discordUser.username || discordUser.globalName || discordUser.displayName || id;
  const displayName = member?.displayName || discordUser.globalName || discordUser.displayName || username;

  return {
    id,
    displayName,
    username,
    roles: roleNames,
    avatar: imageUrl("avatars", id, discordUser.avatar, 256) || defaultAvatar(displayName),
    banner: imageUrl("banners", id, discordUser.banner, 1024) || defaultBanner(displayName)
  };
}

function imageUrl(type, id, hash, size) {
  if (!hash) return null;
  const ext = hash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/${type}/${id}/${hash}.${ext}?size=${size}`;
}

function defaultAvatar(name) {
  const letter = encodeURIComponent(String(name || "B").trim().slice(0, 1) || "B");
  return `https://placehold.co/256x256/ffd3ec/b84888?text=${letter}`;
}

function defaultBanner(name) {
  const label = encodeURIComponent(String(name || "BunBun").slice(0, 18));
  return `https://placehold.co/1200x420/ffd3ec/b84888?text=${label}`;
}

function safeReturnTo(value) {
  const fallback = config.publicSiteUrl || "/";
  if (!value || typeof value !== "string") return fallback;
  try {
    const base = config.publicSiteUrl || `http://localhost:${port}`;
    const url = new URL(value, base);
    if (config.publicSiteUrl && url.origin === new URL(config.publicSiteUrl).origin) {
      return url.toString();
    }
    if (!config.publicSiteUrl && url.origin === new URL(base).origin) {
      return `${url.pathname}${url.search}${url.hash}` || "/";
    }
    return fallback;
  } catch (_error) {
    return fallback;
  }
}
