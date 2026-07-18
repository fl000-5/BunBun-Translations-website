const members = [
  { id: "flooo", displayName: "𝕱𝖑𝖔𝖔𝖔", username: "@fl000_5", roles: ["Właściciel", "Tłumacz"], status: "current", avatar: ["#e96d5b", "#4aa89b"] },
  { id: "mika", displayName: "Mika", username: "@mika.bun", roles: ["Współwłaściciel", "Tłumacz"], status: "current", avatar: ["#4aa89b", "#f3b84b"] },
  { id: "nami", displayName: "Nami", username: "@nami.clean", roles: ["Administrator"], status: "current", avatar: ["#394b59", "#e96d5b"] },
  { id: "ari", displayName: "Ari", username: "@ari.reads", roles: ["Tłumacz"], status: "current", avatar: ["#7a6fdb", "#4aa89b"] },
  { id: "yuki", displayName: "Yuki", username: "@yuki_mod", roles: ["Moderator"], status: "current", avatar: ["#f3b84b", "#e96d5b"] },
  { id: "rin", displayName: "Rin", username: "@rin.help", roles: ["Pomocnik tłumacza"], status: "current", avatar: ["#4aa89b", "#295f68"] },
  { id: "lena", displayName: "Lena", username: "@lena.types", roles: ["Tłumacz"], status: "current", avatar: ["#e96d5b", "#f3b84b"] },
  { id: "kai", displayName: "Kai", username: "@kai_kr", roles: ["Korektor"], status: "current", avatar: ["#395b64", "#8ad0c5"] },
  { id: "sora", displayName: "Sora", username: "@sora.old", roles: ["Tłumacz"], status: "old", avatar: ["#9b6b5a", "#f1b36a"] },
  { id: "hana", displayName: "Hana", username: "@hana.archive", roles: ["Typesetter"], status: "old", avatar: ["#546a7b", "#d88c9a"] },
  { id: "tofu", displayName: "Tofu", username: "@tofu.clean", roles: ["Cleaner"], status: "old", avatar: ["#627264", "#f2cc8f"] }
];

const rolePermissions = [
  { role: "Właściciel", rights: ["pełne zarządzanie stroną", "role i uprawnienia", "wszystkie tytuły i rozdziały", "wybór tłumacza rozdziału"] },
  { role: "Współwłaściciel", rights: ["zarządzanie tytułami", "dodawanie rozdziałów", "wybór tłumacza rozdziału", "edycja kadry"] },
  { role: "Administrator", rights: ["moderacja treści", "edycja metadanych tytułów", "publikacja zaplanowanych rozdziałów"] },
  { role: "Moderator", rights: ["moderacja komentarzy", "ukrywanie zgłoszonych treści", "podgląd panelu rozdziałów"] },
  { role: "Tłumacz", rights: ["dodawanie rozdziałów do przypisanych tytułów", "podgląd własnych serii", "oznaczenie pracy przy rozdziale"] },
  { role: "Pomocnik tłumacza", rights: ["praca przy szkicach", "pomoc techniczna przy plikach", "podgląd przypisanych zadań"] },
  { role: "Czytelnik", rights: ["biblioteka tytułów", "prywatne polubienia", "opis profilu"] }
];

let translations = [
  {
    id: "ash-princess",
    title: "Księżniczka z Popiołu",
    type: "Manhwa",
    status: "Aktywna",
    adult: false,
    genres: ["Fantasy", "Romans", "Dramat"],
    translators: ["flooo", "mika"],
    cover: "linear-gradient(145deg, #e96d5b, #2f5961)",
    description: "Dworska intryga, druga szansa i bohaterka, która nie zamierza już prosić o pozwolenie.",
    chapters: [
      { number: "12", date: "2026-07-14", translatorId: "flooo" },
      { number: "13", date: "2026-07-15", translatorId: "mika" },
      { number: "14", date: "2026-07-17", translatorId: "flooo" }
    ]
  },
  {
    id: "silk-shadows",
    title: "Cienie na Jedwabiu",
    type: "Manhwa",
    status: "Aktywna",
    adult: true,
    genres: ["Akcja", "Tajemnica", "18+"],
    translators: ["ari"],
    cover: "linear-gradient(145deg, #20292d, #e96d5b)",
    description: "Zlecenie miało być proste, ale ślad prowadzi do rodziny, której nikt nie powinien pamiętać.",
    chapters: [
      { number: "7", date: "2026-07-08", translatorId: "ari" },
      { number: "8", date: "2026-07-12", translatorId: "ari" },
      { number: "9", date: "2026-07-16", translatorId: "ari" }
    ]
  },
  {
    id: "dragon-bookseller",
    title: "Smoczy Księgarz",
    type: "Manhwa",
    status: "Planowana",
    adult: false,
    genres: ["Komedia", "Fantasy", "Slice of Life"],
    translators: ["lena"],
    cover: "linear-gradient(145deg, #4aa89b, #f3b84b)",
    description: "Księgarnia, w której rabaty negocjuje się z małym smokiem pilnującym działu romansów.",
    chapters: [
      { number: "Prolog", date: "2026-07-09", translatorId: "lena" },
      { number: "1", date: "2026-07-13", translatorId: "lena" }
    ]
  },
  {
    id: "mist-crown",
    title: "Korona z Mgły",
    type: "Manhwa",
    status: "Zawieszona",
    adult: false,
    genres: ["Przygodowe", "Polityka", "Fantasy"],
    translators: ["flooo"],
    cover: "linear-gradient(145deg, #6e8791, #f3b84b)",
    description: "Następca tronu znika co noc, a poranna mgła przynosi listy pisane jego własną ręką.",
    chapters: [
      { number: "20", date: "2026-06-28", translatorId: "flooo" },
      { number: "21", date: "2026-07-03", translatorId: "flooo" },
      { number: "22", date: "2026-07-10", translatorId: "flooo" }
    ]
  },
  {
    id: "courtyard-chronicles",
    title: "Kroniki Podwórka",
    type: "Manhwa",
    status: "Aktywna",
    adult: false,
    genres: ["Komedia", "Szkolne", "Okruchy życia"],
    translators: ["mika", "rin"],
    cover: "linear-gradient(145deg, #f3b84b, #4aa89b)",
    description: "Szkolny klub, który przez przypadek zostaje centrum wszystkich miejskich plotek.",
    chapters: [
      { number: "4", date: "2026-07-05", translatorId: "mika" },
      { number: "5A", date: "2026-07-11", translatorId: "mika" },
      { number: "5B", date: "2026-07-15", translatorId: "rin" }
    ]
  },
  {
    id: "last-teahouse",
    title: "Ostatnia Herbaciarnia",
    type: "Manhwa",
    status: "Zakończona",
    adult: false,
    genres: ["Dramat", "Nadnaturalne", "Obyczajowe"],
    translators: ["ari", "lena"],
    cover: "linear-gradient(145deg, #875f4b, #8ad0c5)",
    description: "Każda herbata pokazuje wspomnienie, za które trzeba zapłacić prawdą.",
    chapters: [
      { number: "30", date: "2026-06-30", translatorId: "lena" },
      { number: "31", date: "2026-07-07", translatorId: "ari" },
      { number: "32", date: "2026-07-14", translatorId: "ari" }
    ]
  },
  {
    id: "sweet-contract",
    title: "Słodki Kontrakt",
    type: "Manhwa",
    status: "Porzucona",
    adult: true,
    genres: ["Romans", "Dramat", "18+"],
    translators: ["flooo"],
    cover: "linear-gradient(145deg, #e96d5b, #7a6fdb)",
    description: "Kontraktowy związek zaczyna się od udawania, a kończy na rachunku, którego nikt nie przewidział.",
    chapters: [
      { number: "10", date: "2026-05-18", translatorId: "flooo" },
      { number: "11", date: "2026-06-01", translatorId: "flooo" },
      { number: "12", date: "2026-06-17", translatorId: "flooo" }
    ]
  },
  {
    id: "spring-after-midnight",
    title: "Wiosna po Północy",
    type: "Manhwa",
    status: "Aktywna",
    adult: false,
    genres: ["Romans", "Nadnaturalne", "Dramat"],
    translators: ["mika"],
    cover: "linear-gradient(145deg, #2f5961, #e9a29a)",
    description: "Po północy miasto budzi się drugi raz, a tylko jedna osoba pamięta oba życia.",
    chapters: [
      { number: "2", date: "2026-07-06", translatorId: "mika" },
      { number: "3", date: "2026-07-12", translatorId: "mika" },
      { number: "4", date: "2026-07-17", translatorId: "mika" }
    ]
  }
];

const state = {
  loggedIn: false,
  currentUserId: "flooo",
  library: [],
  likedChapters: [],
  randomId: null,
  selectedFiles: []
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const translatorMembers = () => members.filter((member) => member.roles.includes("Tłumacz") || member.roles.includes("Pomocnik tłumacza"));
const staffMembers = () => members.filter((member) => member.status === "current");
const currentUser = () => members.find((member) => member.id === state.currentUserId);
const canManageAll = () => currentUser().roles.some((role) => ["Właściciel", "Współwłaściciel", "Administrator"].includes(role));
const formatNumber = (value) => new Intl.NumberFormat("pl-PL").format(value);
const initialsFor = (member) => Array.from(member.displayName.replace(/@/g, "").trim()).filter((char) => char.trim()).slice(0, 2).join("").toUpperCase() || "BB";

function avatarData(member, size = 160) {
  const initials = initialsFor(member);
  const [from, to] = member.avatar;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="${size}" height="${size}" rx="16" fill="url(#g)"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="800" fill="white">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function chapterLabel(chapter) {
  const translator = members.find((member) => member.id === chapter.translatorId);
  return `Rozdział ${chapter.number}${translator ? ` • ${translator.displayName}` : ""}`;
}

function setView(viewId) {
  qsa("[data-view]").forEach((view) => view.classList.toggle("is-visible", view.dataset.view === viewId));
  qsa("[data-view-link]").forEach((link) => link.classList.toggle("is-active", link.dataset.viewLink === viewId));
  const view = qs(`[data-view="${viewId}"]`);
  if (view) view.focus({ preventScroll: true });
  if (location.hash !== `#${viewId}`) history.replaceState(null, "", `#${viewId}`);
}

function renderStats(stats = { members: 812, translators: translatorMembers().filter((member) => member.roles.includes("Tłumacz")).length }) {
  qs("#stat-discord").textContent = formatNumber(stats.members);
  qs("#stat-translators").textContent = formatNumber(stats.translators);
  qs("#stat-series").textContent = formatNumber(translations.length);
  qs("#stat-chapters").textContent = formatNumber(translations.reduce((total, item) => total + item.chapters.length, 0));
}

async function refreshDiscordCounters() {
  const fallback = { members: 812, translators: translatorMembers().filter((member) => member.roles.includes("Tłumacz")).length };
  if (!location.protocol.startsWith("http")) {
    renderStats(fallback);
    return;
  }
  try {
    const response = await fetch("/api/discord/stats", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Discord stats unavailable");
    const stats = await response.json();
    renderStats({ members: stats.members ?? fallback.members, translators: stats.translators ?? fallback.translators });
  } catch {
    renderStats(fallback);
  }
}

function sortedChapters(item) {
  return [...item.chapters].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function applyCover(element, item) {
  if (item.coverUrl) {
    element.style.backgroundImage = `linear-gradient(rgba(29,42,47,0.12), rgba(29,42,47,0.08)), url("${item.coverUrl}")`;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    return;
  }
  element.style.background = item.cover;
}

function renderRecent() {
  const grid = qs("#recent-grid");
  grid.innerHTML = "";
  translations.slice(0, 8).forEach((item) => {
    const card = document.createElement("article");
    card.className = "recent-card";
    const cover = document.createElement("div");
    cover.className = "cover-art";
    applyCover(cover, item);
    const body = document.createElement("div");
    body.className = "recent-body";
    body.innerHTML = `<h3>${item.title}</h3><div class="tag-row"><span class="tag status">${item.status}</span>${item.adult ? `<span class="tag adult">18+</span>` : ""}</div>`;
    const list = document.createElement("ul");
    list.className = "chapter-list";
    sortedChapters(item).slice(0, 3).forEach((chapter) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = chapterLabel(chapter);
      li.append(button);
      list.append(li);
    });
    body.append(list);
    card.append(cover, body);
    grid.append(card);
  });
}

function renderRandomTitle() {
  if (!state.randomId || !translations.some((item) => item.id === state.randomId)) {
    state.randomId = translations[Math.floor(Math.random() * translations.length)].id;
  }
  const item = translations.find((translation) => translation.id === state.randomId);
  const host = qs("#random-title");
  host.innerHTML = "";
  const cover = document.createElement("div");
  cover.className = "random-cover";
  applyCover(cover, item);
  const title = document.createElement("h2");
  title.textContent = item.title;
  const text = document.createElement("p");
  text.className = "muted";
  text.textContent = item.description;
  const tags = document.createElement("div");
  tags.className = "tag-row";
  tags.innerHTML = `<span class="tag status">${item.status}</span>${item.genres.slice(0, 3).map((genre) => `<span class="tag">${genre}</span>`).join("")}`;
  host.append(cover, title, text, tags);
}

function renderGenres() {
  const select = qs("#filter-genre");
  const previous = select.value;
  const genres = [...new Set(translations.flatMap((item) => item.genres))].sort((a, b) => a.localeCompare(b, "pl"));
  select.innerHTML = `<option value="all">Wszystkie</option>${genres.map((genre) => `<option>${genre}</option>`).join("")}`;
  select.value = genres.includes(previous) ? previous : "all";
}

function renderTranslations() {
  const type = qs("#filter-type").value;
  const status = qs("#filter-status").value;
  const genre = qs("#filter-genre").value;
  const adult = qs("#filter-adult").value;
  const grid = qs("#translation-grid");
  const visible = translations.filter((item) => {
    if (type !== "all" && item.type !== type) return false;
    if (status !== "all" && item.status !== status) return false;
    if (genre !== "all" && !item.genres.includes(genre)) return false;
    if (adult === "yes" && !item.adult) return false;
    if (adult === "no" && item.adult) return false;
    return true;
  });
  grid.innerHTML = "";
  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = "translation-card";
    card.id = `translation-${item.id}`;
    const cover = document.createElement("div");
    cover.className = "cover-art";
    applyCover(cover, item);
    const body = document.createElement("div");
    body.className = "translation-body";
    const translatorNames = item.translators.map((id) => members.find((member) => member.id === id)?.displayName).filter(Boolean).join(", ");
    body.innerHTML = `<h3>${item.title}</h3><div class="tag-row"><span class="tag status">${item.status}</span><span class="tag">${item.type}</span>${item.adult ? `<span class="tag adult">18+</span>` : ""}</div><p>${item.description}</p><div class="tag-row">${item.genres.map((itemGenre) => `<span class="tag">${itemGenre}</span>`).join("")}</div><p><strong>${item.chapters.length}</strong> rozdziałów</p><p>Tłumacz: ${translatorNames || "brak"}</p>`;
    card.append(cover, body);
    grid.append(card);
  });
  if (!visible.length) {
    grid.innerHTML = `<p class="muted">Brak tytułów dla wybranych filtrów.</p>`;
  }
}

function renderTeam() {
  const render = (status, targetId) => {
    const target = qs(`#${targetId}`);
    target.innerHTML = "";
    members.filter((member) => member.status === status).forEach((member) => {
      const card = document.createElement("article");
      card.className = "team-card";
      const avatar = document.createElement("div");
      avatar.className = "avatar";
      avatar.style.background = `linear-gradient(145deg, ${member.avatar[0]}, ${member.avatar[1]})`;
      avatar.textContent = initialsFor(member);
      card.innerHTML = `<div><strong>${member.displayName}</strong><span>${member.username}</span></div><p class="muted">${member.roles.join(" • ")}</p>`;
      card.prepend(avatar);
      target.append(card);
    });
  };
  render("current", "current-team");
  render("old", "old-team");
}

function renderProfile() {
  const user = currentUser();
  qs("#profile-avatar").src = avatarData(user);
  qs("#profile-avatar").alt = `Awatar ${user.displayName}`;
  qs("#profile-display-name").textContent = user.displayName;
  qs("#profile-username").textContent = user.username;
  qs("#profile-roles").innerHTML = user.roles.map((role) => `<span class="tag status">${role}</span>`).join("");
  qs("#permissions-grid").innerHTML = rolePermissions.map((entry) => `<article class="permission-card"><h3>${entry.role}</h3><ul>${entry.rights.map((right) => `<li>${right}</li>`).join("")}</ul></article>`).join("");
  renderLibraryControls();
  renderTranslatorTitles();
}

function renderLibraryControls() {
  qs("#library-select").innerHTML = translations.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  const chapters = translations.flatMap((item) => item.chapters.map((chapter) => ({ id: `${item.id}:${chapter.number}`, label: `${item.title} - rozdział ${chapter.number}` })));
  qs("#like-select").innerHTML = chapters.map((chapter) => `<option value="${chapter.id}">${chapter.label}</option>`).join("");
  qs("#library-list").innerHTML = state.library.length ? state.library.map((id) => `<li>${translations.find((item) => item.id === id)?.title ?? id}</li>`).join("") : `<li>Brak zapisanych tytułów.</li>`;
  qs("#liked-list").innerHTML = state.likedChapters.length ? state.likedChapters.map((id) => `<li>${chapterTextFromId(id)}</li>`).join("") : `<li>Brak polubionych rozdziałów.</li>`;
}

function chapterTextFromId(id) {
  const [titleId, chapterNumber] = id.split(":");
  const item = translations.find((translation) => translation.id === titleId);
  return item ? `${item.title} - rozdział ${chapterNumber}` : id;
}

function renderTranslatorTitles() {
  const user = currentUser();
  const assigned = translations.filter((item) => item.translators.includes(user.id));
  const host = qs("#translator-titles");
  if (!assigned.length) {
    host.innerHTML = `<p class="muted">Ten profil nie ma przypisanych tłumaczeń.</p>`;
    return;
  }
  host.innerHTML = `<div class="translation-grid compact-grid">${assigned.map((item) => `<article class="permission-card"><h3>${item.title}</h3><p class="muted">${item.status} • ${item.chapters.length} rozdz.</p></article>`).join("")}</div>`;
}

function populateFormControls() {
  const translatorBox = qs("#translator-checkboxes");
  translatorBox.innerHTML = translatorMembers().map((member) => `<label class="inline-check"><input type="checkbox" value="${member.id}" /><span>${member.displayName}</span></label>`).join("");
  addCreatorRow("authors-list");
  addCreatorRow("artists-list");
  addEditorRow();
  updateChapterTitleOptions();
  updateChapterTranslatorOptions();
}

function addCreatorRow(targetId) {
  const template = qs("#creator-row-template");
  const row = template.content.firstElementChild.cloneNode(true);
  const name = qs("[data-creator-name]", row);
  const x = qs("[data-creator-x]", row);
  const unknown = qs("[data-creator-unknown]", row);
  const noProfile = qs("[data-creator-no-profile]", row);
  unknown.addEventListener("change", () => {
    name.disabled = unknown.checked;
    if (unknown.checked) name.value = "";
  });
  noProfile.addEventListener("change", () => {
    x.disabled = noProfile.checked;
    if (noProfile.checked) x.value = "";
  });
  qs(`#${targetId}`).append(row);
}

function addEditorRow() {
  const template = qs("#editor-row-template");
  const row = template.content.firstElementChild.cloneNode(true);
  const select = qs("[data-editor-member]", row);
  select.innerHTML = staffMembers().map((member) => `<option value="${member.id}">${member.displayName}</option>`).join("");
  qs("#editor-list").append(row);
}

function updateChapterTitleOptions() {
  const select = qs("#chapter-title-select");
  const user = currentUser();
  const allowed = canManageAll() ? translations : translations.filter((item) => item.translators.includes(user.id));
  select.innerHTML = allowed.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  updateChapterSuggestion();
}

function updateChapterTranslatorOptions() {
  const select = qs("#chapter-translator-select");
  const selectedTitle = translations.find((item) => item.id === qs("#chapter-title-select").value) ?? translations[0];
  const allowed = canManageAll() ? translatorMembers() : translatorMembers().filter((member) => selectedTitle?.translators.includes(member.id));
  select.innerHTML = allowed.map((member) => `<option value="${member.id}">${member.displayName}</option>`).join("");
}

function nextChapterNumber(item) {
  const last = sortedChapters(item)[0]?.number ?? "0";
  const match = String(last).match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return "1";
  const number = Number(match[1].replace(",", "."));
  return Number.isFinite(number) ? String(number + 1) : "1";
}

function updateChapterSuggestion() {
  const item = translations.find((translation) => translation.id === qs("#chapter-title-select").value);
  if (!item) return;
  const next = nextChapterNumber(item);
  qs("#chapter-number").placeholder = next;
  qs("#chapter-suggestions").innerHTML = [next, `${next}A`, "Extra", "Prolog"].map((value) => `<option value="${value}"></option>`).join("");
}

function validateCreators(rootId) {
  const rows = qsa(".creator-row", qs(`#${rootId}`));
  return rows.some((row) => {
    const unknown = qs("[data-creator-unknown]", row).checked;
    const noProfile = qs("[data-creator-no-profile]", row).checked;
    const name = qs("[data-creator-name]", row).value.trim();
    const x = qs("[data-creator-x]", row).value.trim();
    return unknown || (name && (noProfile || x));
  });
}

function handleTitleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = qs("#title-form-message");
  const selectedTranslators = qsa("#translator-checkboxes input:checked").map((input) => input.value);
  if (!form.reportValidity() || !validateCreators("authors-list") || !validateCreators("artists-list") || selectedTranslators.length === 0) {
    message.textContent = "Uzupełnij wymagane pola, autorów/artystów i minimum jednego tłumacza.";
    message.classList.remove("is-ok");
    return;
  }
  const formData = new FormData(form);
  const coverFile = formData.get("cover");
  const title = String(formData.get("title")).trim();
  const item = {
    id: slugify(title),
    title,
    type: String(formData.get("type")),
    status: String(formData.get("status")),
    adult: formData.get("adult") === "on",
    genres: String(formData.get("genres")).split(",").map((genre) => genre.trim()).filter(Boolean),
    translators: selectedTranslators,
    cover: "linear-gradient(145deg, #4aa89b, #e96d5b)",
    coverUrl: coverFile instanceof File ? URL.createObjectURL(coverFile) : null,
    description: String(formData.get("description")).trim(),
    chapters: []
  };
  translations.unshift(item);
  form.reset();
  qsa("#authors-list, #artists-list, #editor-list").forEach((node) => { node.innerHTML = ""; });
  addCreatorRow("authors-list");
  addCreatorRow("artists-list");
  addEditorRow();
  renderAllData();
  message.textContent = `Dodano tytuł: ${title}.`;
  message.classList.add("is-ok");
}

function slugify(text) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `tytul-${Date.now()}`;
}

function handleFiles(event) {
  state.selectedFiles = Array.from(event.target.files).sort((a, b) => a.name.localeCompare(b.name, "pl", { numeric: true }));
  renderFileOrder();
}

function renderFileOrder() {
  const list = qs("#file-order");
  list.innerHTML = "";
  state.selectedFiles.forEach((file, index) => {
    const item = document.createElement("li");
    item.draggable = true;
    item.dataset.index = String(index);
    item.textContent = file.name;
    item.addEventListener("dragstart", () => item.classList.add("dragging"));
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    item.addEventListener("dragover", (event) => event.preventDefault());
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      const from = Number(qs(".file-order .dragging")?.dataset.index);
      const to = Number(item.dataset.index);
      if (Number.isNaN(from) || Number.isNaN(to) || from === to) return;
      const [moved] = state.selectedFiles.splice(from, 1);
      state.selectedFiles.splice(to, 0, moved);
      renderFileOrder();
    });
    list.append(item);
  });
}

function handleChapterSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const message = qs("#chapter-form-message");
  if (!form.reportValidity() || state.selectedFiles.length === 0) return;
  const formData = new FormData(form);
  const item = translations.find((translation) => translation.id === formData.get("translation"));
  if (!item) return;
  const chapter = {
    number: String(formData.get("chapterNumber")).trim(),
    season: String(formData.get("season") ?? "").trim(),
    date: formData.get("publishAt") ? String(formData.get("publishAt")).slice(0, 10) : new Date().toISOString().slice(0, 10),
    translatorId: String(formData.get("chapterTranslator")),
    files: state.selectedFiles.map((file) => file.name)
  };
  item.chapters.push(chapter);
  form.reset();
  state.selectedFiles = [];
  renderFileOrder();
  renderAllData();
  message.textContent = `Dodano rozdział ${chapter.number} do tytułu ${item.title}.`;
  message.classList.add("is-ok");
}

function renderSearchResults(query) {
  const host = qs("#search-results");
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    host.hidden = true;
    host.innerHTML = "";
    return;
  }
  const matches = translations.flatMap((item) => item.chapters.map((chapter) => ({ item, chapter }))).filter(({ item, chapter }) => `${item.title} ${chapter.number}`.toLowerCase().includes(normalized)).slice(0, 8);
  host.hidden = false;
  host.innerHTML = matches.length ? "" : `<p class="muted">Brak wyników.</p>`;
  matches.forEach(({ item, chapter }) => {
    const button = document.createElement("button");
    button.className = "search-result";
    button.type = "button";
    button.innerHTML = `<span>${item.title}</span><strong>Rozdział ${chapter.number}</strong>`;
    button.addEventListener("click", () => {
      host.hidden = true;
      qs("#chapter-search").value = "";
      setView("translations");
      setTimeout(() => qs(`#translation-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    });
    host.append(button);
  });
}

function renderAllData() {
  renderStats();
  renderRecent();
  renderGenres();
  renderTranslations();
  renderRandomTitle();
  renderProfile();
  updateChapterTitleOptions();
  updateChapterTranslatorOptions();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-view-link]");
    if (link) {
      event.preventDefault();
      setView(link.dataset.viewLink);
    }
    const scrollButton = event.target.closest("[data-scroll-target]");
    if (scrollButton) qs(`#${scrollButton.dataset.scrollTarget}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  qs("#login-button").addEventListener("click", () => {
    state.loggedIn = true;
    qs("#login-button span").textContent = "Profil";
    renderProfile();
    setView("profile");
  });
  qs("#reroll-random").addEventListener("click", () => {
    const ids = translations.map((item) => item.id).filter((id) => id !== state.randomId);
    state.randomId = ids[Math.floor(Math.random() * ids.length)] ?? translations[0].id;
    renderRandomTitle();
  });
  qs("#random-action").addEventListener("click", () => {
    setView("translations");
    setTimeout(() => qs(`#translation-${state.randomId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  });
  qsa("#translation-filters select").forEach((select) => select.addEventListener("change", renderTranslations));
  qsa("[data-carousel-prev]").forEach((button) => button.addEventListener("click", () => qs(`#${button.dataset.carouselPrev}`).scrollBy({ left: -300, behavior: "smooth" })));
  qsa("[data-carousel-next]").forEach((button) => button.addEventListener("click", () => qs(`#${button.dataset.carouselNext}`).scrollBy({ left: 300, behavior: "smooth" })));
  qs("#chapter-search").addEventListener("input", (event) => renderSearchResults(event.target.value));
  qs("#add-library").addEventListener("click", () => {
    const id = qs("#library-select").value;
    if (id && !state.library.includes(id)) state.library.push(id);
    renderLibraryControls();
  });
  qs("#add-like").addEventListener("click", () => {
    const id = qs("#like-select").value;
    if (id && !state.likedChapters.includes(id)) state.likedChapters.push(id);
    renderLibraryControls();
  });
  qsa("[data-add-creator]").forEach((button) => button.addEventListener("click", () => addCreatorRow(button.dataset.addCreator)));
  qs("#add-editor").addEventListener("click", addEditorRow);
  qs("#title-form").addEventListener("submit", handleTitleSubmit);
  qs("#chapter-form").addEventListener("submit", handleChapterSubmit);
  qs("#chapter-files").addEventListener("change", handleFiles);
  qs("#chapter-title-select").addEventListener("change", () => {
    updateChapterSuggestion();
    updateChapterTranslatorOptions();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-box") && !event.target.closest("#search-results")) qs("#search-results").hidden = true;
  });
}

function init() {
  bindEvents();
  populateFormControls();
  renderTeam();
  renderAllData();
  refreshDiscordCounters();
  setInterval(refreshDiscordCounters, 30000);
  const hash = location.hash.replace("#", "");
  if (["home", "translations", "profile", "admin"].includes(hash)) setView(hash);
}

init();


