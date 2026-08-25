(function () {
  "use strict";

  const STORAGE_KEY = "bunbun-static-state-v3";
  const DISCORD_AUTH_START = "/api/auth/discord/start";
  const DISCORD_ME = "/api/auth/me";
  const DISCORD_LOGOUT = "/api/auth/logout";
  const DISCORD_STATS = "/api/discord/stats";
  const DISCORD_USER = "/api/discord/users/";
  const CHAPTER_FEED = "/api/chapters";
  const CHAPTER_PUBLISH = "/api/chapters/publish";
  const API_BASE = String(window.BUNBUN_API_BASE || "").replace(/\/$/, "");
  const SAMPLE_COVER = "assets/unsleep-cover.jpg";
  const SAMPLE_PAGE_1 = "assets/unsleep-1.jpg";
  const SAMPLE_PAGE_2 = "assets/unsleep-2.jpg";

  const roles = [
    { name: "Właściciel", permissions: "Wszystko: dane, role, tytuły, rozdziały, edycja i usuwanie serii." },
    { name: "Współwłaściciel", permissions: "Pełna administracja bez zmiany właściciela strony." },
    { name: "Administrator", permissions: "Dodawanie i edycja tytułów, rozdziałów, danych oraz kadry." },
    { name: "Moderator", permissions: "Porządkowanie treści i pomoc przy użytkownikach." },
    { name: "Tłumacz", permissions: "Dodawanie rozdziałów tylko do przypisanych tytułów." },
    { name: "Pomocnik tłumacza", permissions: "Podgląd przypisanych prac i pomoc przy rozdziałach." },
    { name: "Czytelnik", permissions: "Czytanie rozdziałów, biblioteka profilu i prywatne oznaczanie przeczytanych." }
  ];

  const mockDiscordUsers = {
    "100000000000000001": {
      id: "100000000000000001",
      displayName: "Flooo",
      username: "fl000_5",
      roles: ["Właściciel", "Tłumacz", "Czytelnik"],
      avatar: avatarSvg("F", "#15111c", "#ac62ff"),
      banner: bannerSvg("#ffd0e9", "#f391ca", "BB")
    },
    "100000000000000002": {
      id: "100000000000000002",
      displayName: "Katsumi",
      username: "katsumi",
      roles: ["Współwłaściciel", "Tłumacz", "Czytelnik"],
      avatar: avatarSvg("K", "#fbdfef", "#9d3c72"),
      banner: bannerSvg("#ffe0f1", "#e45b9e", "K")
    },
    "100000000000000003": {
      id: "100000000000000003",
      displayName: "eri",
      username: "eri",
      roles: ["Tłumacz", "Czytelnik"],
      avatar: avatarSvg("E", "#d7fbff", "#1f7291"),
      banner: bannerSvg("#f8d8ec", "#f6a7d0", "E")
    },
    "100000000000000004": {
      id: "100000000000000004",
      displayName: "Mika",
      username: "mika",
      roles: ["Cleaner", "Czytelnik"],
      avatar: avatarSvg("M", "#fff1c7", "#b87122"),
      banner: bannerSvg("#fff0c8", "#ffb6d9", "M")
    },
    "100000000000000005": {
      id: "100000000000000005",
      displayName: "Luna",
      username: "luna",
      roles: ["Administrator", "Czytelnik"],
      avatar: avatarSvg("L", "#efe7ff", "#6c55bd"),
      banner: bannerSvg("#eee8ff", "#ffa6d8", "L")
    }
  };

  const seedState = {
    currentUser: null,
    activeTeamTab: "current",
    teamCarouselIndex: 0,
    teamCarouselMoving: false,
    titleQuery: "",
    randomTitleId: null,
    uploadedPages: [],
    profileDescription: "Tu możesz zapisać swój opis profilu.",
    discordSettings: {
      clientId: "",
      redirectUri: "https://twojadomena.pl/api/auth/discord/callback",
      countChannelId: "",
      translatorRoleId: ""
    },
    users: clone(mockDiscordUsers),
    team: [
      { id: "team-1", discordId: "100000000000000003", roles: ["Cleaner", "Typesetter"], status: "current" },
      { id: "team-2", discordId: "100000000000000001", roles: ["Założyciel", "Tłumacz"], status: "current" },
      { id: "team-3", discordId: "100000000000000002", roles: ["Współzałożyciel", "Tłumacz"], status: "current" },
      { id: "team-4", discordId: "100000000000000005", roles: ["Administracja"], status: "current" },
      { id: "team-5", discordId: "100000000000000004", roles: ["Dawna kadra"], status: "past" }
    ],
    library: [],
    readChapters: [],
    likedChapters: [],
    translations: [
      makeTranslation({
        id: "unsleep",
        title: "Unsleep",
        type: "Manhwa",
        status: "Aktywna",
        genres: ["Romans", "Dramat", "BL"],
        cover: SAMPLE_COVER,
        banner: SAMPLE_COVER,
        description: "Pionowa okładka testowa pokazuje, jak strona mieści dodawane grafiki w liście, losowym tytule i przy rozdziałach.",
        authors: ["Unknown"],
        artists: ["Unknown"],
        translators: ["100000000000000001", "100000000000000002"],
        editors: [{ role: "Cleaner", name: "eri" }, { role: "Typesetter", name: "eri" }],
        likes: [18, 24, 31]
      }),
      makeTranslation({
        id: "princess-ash",
        title: "Księżniczka z Popiołu",
        genres: ["Fantasy", "Romans"],
        cover: coverSvg("Księżniczka", "#ffd1e8", "#9d3c72"),
        banner: bannerSvg("#ffd1e8", "#f3a7cc", "Księżniczka z Popiołu"),
        translators: ["100000000000000003"],
        likes: [11, 16, 19]
      }),
      makeTranslation({
        id: "rose-office",
        title: "Różowe Biuro",
        genres: ["Komedia", "Okruchy życia"],
        cover: coverSvg("Różowe Biuro", "#f5dfff", "#62368f"),
        banner: bannerSvg("#f5dfff", "#ffa6d8", "Różowe Biuro"),
        translators: ["100000000000000001"],
        likes: [7, 12, 13]
      }),
      makeTranslation({
        id: "moon-contract",
        title: "Kontrakt Księżyca",
        genres: ["Fantasy", "Akcja"],
        cover: coverSvg("Kontrakt", "#dfe9ff", "#4c579b"),
        banner: bannerSvg("#dfe9ff", "#ffb8d9", "Kontrakt Księżyca"),
        translators: ["100000000000000002"],
        likes: [29, 32, 36]
      }),
      makeTranslation({
        id: "silent-garden",
        title: "Cichy Ogród",
        genres: ["Dramat", "Psychologiczny"],
        cover: coverSvg("Cichy Ogród", "#dff7dc", "#386b47"),
        banner: bannerSvg("#dff7dc", "#ffc9e6", "Cichy Ogród"),
        translators: ["100000000000000003"],
        likes: [8, 9, 12]
      }),
      makeTranslation({
        id: "sugar-night",
        title: "Cukrowa Noc",
        genres: ["Romans", "Komedia"],
        cover: coverSvg("Cukrowa Noc", "#ffe7b8", "#a85f1f"),
        banner: bannerSvg("#ffe7b8", "#ff9fce", "Cukrowa Noc"),
        translators: ["100000000000000001"],
        likes: [14, 14, 17]
      }),
      makeTranslation({
        id: "paper-crown",
        title: "Papierowa Korona",
        genres: ["Dramat", "Historyczne"],
        cover: coverSvg("Korona", "#f8e7d6", "#935b3e"),
        banner: bannerSvg("#f8e7d6", "#ffa6d8", "Papierowa Korona"),
        translators: ["100000000000000002"],
        likes: [3, 6, 10]
      }),
      makeTranslation({
        id: "after-class",
        title: "Po Lekcjach",
        genres: ["Szkolne", "Romans"],
        cover: coverSvg("Po Lekcjach", "#e0f4ff", "#39627a"),
        banner: bannerSvg("#e0f4ff", "#ffc8e7", "Po Lekcjach"),
        translators: ["100000000000000003"],
        likes: [21, 23, 25]
      })
    ]
  };

  const state = restoreState();

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    bindNavigation();
    bindLogin();
    bindFilters();
    bindTeam();
    bindForms();
    hydrateConfigForm();
    initDiscordSession();
    renderAll();
    syncPublishedChapters();
    window.setInterval(syncPublishedChapters, 15000);
    route();
    window.addEventListener("hashchange", route);
  }

  function bindNavigation() {
    document.addEventListener("click", (event) => {
      const viewButton = event.target.closest("[data-view]");
      if (viewButton) {
        event.preventDefault();
        navigate(viewButton.dataset.view);
        return;
      }

      const adminButton = event.target.closest("[data-admin-action]");
      if (adminButton) {
        event.preventDefault();
        navigate(adminButton.dataset.adminAction);
        closeUserDropdown();
      }
    });

    const searchForm = document.querySelector("#searchForm");
    const searchInput = document.querySelector("#titleSearch");
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      state.titleQuery = searchInput.value.trim();
      navigate("translations");
      renderTranslations();
    });
    searchInput.addEventListener("input", () => {
      state.titleQuery = searchInput.value.trim();
      if (activeViewName() === "translations") {
        renderTranslations();
      }
    });
  }

  function bindLogin() {
    document.querySelector("#loginButton").addEventListener("click", () => {
      if (hasBackend()) {
        window.location.href = apiUrl(`${DISCORD_AUTH_START}?returnTo=${encodeURIComponent(location.href)}`);
        return;
      }
      loginAs("100000000000000001");
    });

    document.querySelector("#userTrigger").addEventListener("click", () => {
      const dropdown = document.querySelector("#userDropdown");
      dropdown.classList.toggle("is-open");
      document.querySelector("#userTrigger").setAttribute("aria-expanded", String(dropdown.classList.contains("is-open")));
    });

    document.querySelector("#logoutButton").addEventListener("click", async () => {
      if (hasBackend()) {
        await fetch(apiUrl(DISCORD_LOGOUT), { method: "POST", credentials: "include" }).catch(() => {});
      }
      state.currentUser = null;
      persistState();
      closeUserDropdown();
      renderSession();
      renderProfile();
      navigate("home");
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("#userMenu")) {
        closeUserDropdown();
      }
    });
  }

  function bindFilters() {
    document.querySelector("#filterToggle").addEventListener("click", () => {
      document.querySelector("#filtersPanel").classList.toggle("is-open");
    });

    ["typeFilter", "statusFilter", "genreFilter", "adultFilter"].forEach((id) => {
      document.querySelector(`#${id}`).addEventListener("change", renderTranslations);
    });
  }

  function bindTeam() {
    document.querySelectorAll("[data-team-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTeamTab = button.dataset.teamTab;
        state.teamCarouselIndex = 0;
        renderTeam();
      });
    });

    document.querySelector("[data-team-prev]").addEventListener("click", () => {
      moveTeamCarousel(-1);
    });
    document.querySelector("[data-team-next]").addEventListener("click", () => {
      moveTeamCarousel(1);
    });

    const adminList = document.querySelector("#teamAdminList");
    adminList.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-team]");
      if (editButton) {
        const member = state.team.find((item) => item.id === editButton.dataset.editTeam);
        if (!member) return;
        document.querySelector("#teamMemberId").value = member.id;
        document.querySelector("#teamDiscordId").value = member.discordId;
        document.querySelector("#teamRoles").value = member.roles.join(", ");
        document.querySelector("#teamStatus").value = member.status;
        document.querySelector("#teamDiscordId").focus();
        return;
      }

      const deleteButton = event.target.closest("[data-delete-team]");
      if (deleteButton) {
        const member = state.team.find((item) => item.id === deleteButton.dataset.deleteTeam);
        if (!member) return;
        if (!window.confirm(`Usunąć ${displayUserName(member.discordId)} z kadry?`)) return;
        state.team = state.team.filter((item) => item.id !== member.id);
        state.teamCarouselIndex = 0;
        persistState();
        renderTeam();
        populatePeopleSelects();
      }
    });

    adminList.addEventListener("dragstart", (event) => {
      const item = event.target.closest("[data-team-drag]");
      if (!item) return;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.dataset.teamDrag);
      item.classList.add("is-dragging");
    });

    adminList.addEventListener("dragend", (event) => {
      const item = event.target.closest("[data-team-drag]");
      if (item) item.classList.remove("is-dragging");
      adminList.querySelectorAll(".is-drag-over").forEach((node) => node.classList.remove("is-drag-over"));
    });

    adminList.addEventListener("dragover", (event) => {
      const item = event.target.closest("[data-team-drag]");
      if (!item) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      adminList.querySelectorAll(".is-drag-over").forEach((node) => node.classList.remove("is-drag-over"));
      item.classList.add("is-drag-over");
    });

    adminList.addEventListener("dragleave", (event) => {
      const item = event.target.closest("[data-team-drag]");
      if (item && !item.contains(event.relatedTarget)) item.classList.remove("is-drag-over");
    });

    adminList.addEventListener("drop", (event) => {
      const target = event.target.closest("[data-team-drag]");
      if (!target) return;
      event.preventDefault();
      const draggedId = event.dataTransfer.getData("text/plain");
      const targetId = target.dataset.teamDrag;
      if (!draggedId || draggedId === targetId) return;

      const fromIndex = state.team.findIndex((item) => item.id === draggedId);
      const toIndex = state.team.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return;

      const [moved] = state.team.splice(fromIndex, 1);
      state.team.splice(toIndex, 0, moved);
      state.teamCarouselIndex = 0;
      persistState();
      renderTeam();
    });

    document.querySelector("#teamForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const memberId = document.querySelector("#teamMemberId").value;
      const discordId = document.querySelector("#teamDiscordId").value.trim();
      const discordUser = await getDiscordUser(discordId);
      state.users[discordId] = ensureReaderRole(discordUser);
      const payload = {
        id: memberId || `team-${Date.now()}`,
        discordId,
        roles: splitList(document.querySelector("#teamRoles").value),
        status: document.querySelector("#teamStatus").value
      };

      const existingIndex = state.team.findIndex((member) => member.id === payload.id);
      if (existingIndex >= 0) {
        state.team[existingIndex] = payload;
      } else {
        state.team.push(payload);
      }

      event.target.reset();
      document.querySelector("#teamMemberId").value = "";
      persistState();
      renderTeam();
      populatePeopleSelects();
    });
  }

  function bindForms() {
    document.querySelector("#addTitleForm").addEventListener("submit", handleAddTitle);
    document.querySelector("#addChapterForm").addEventListener("submit", handleAddChapter);
    document.querySelector("#dataForm").addEventListener("submit", handleSaveData);
    document.querySelector("#editSeriesForm").addEventListener("submit", handleEditSeries);
    document.querySelector("#deleteSeriesButton").addEventListener("click", handleDeleteSeries);
    document.querySelector("#editSeriesSelect").addEventListener("change", populateEditSeriesForm);
    document.querySelector("#chapterTitleSelect").addEventListener("change", updateChapterHints);
    document.querySelector("#chapterFiles").addEventListener("change", handleChapterFiles);
  }

  async function initDiscordSession() {
    if (!hasBackend()) {
      renderSession();
      return;
    }

    try {
      const response = await fetch(apiUrl(DISCORD_ME), { credentials: "include" });
      if (!response.ok) throw new Error("Not logged in");
      const user = ensureReaderRole(await response.json());
      state.users[user.id] = user;
      state.currentUser = user.id;
      persistState();
    } catch {
      state.currentUser = null;
    }
    renderSession();
  }

  function renderAll() {
    renderSession();
    renderLatest();
    renderRandomTitle();
    renderCounters();
    renderTeam();
    renderGenreOptions();
    renderTranslations();
    populatePeopleSelects();
    populateChapterTitleSelect();
    populateEditSeriesSelect();
    renderProfile();
    renderData();
  }

  function route() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, "")) || "home";
    const parts = hash.split("/").filter(Boolean);
    const view = parts[0] || "home";

    if (view === "title" && parts[1]) {
      renderTitle(parts[1]);
      showView("title");
      return;
    }

    if (view === "reader" && parts[1] && parts[2]) {
      renderReader(parts[1], parts[2]);
      showView("reader");
      return;
    }

    showView(view);
  }

  function navigate(view) {
    location.hash = `#${view}`;
  }

  function showView(view) {
    const ids = {
      home: "homeView",
      translations: "translationsView",
      title: "titleView",
      reader: "readerView",
      profile: "profileView",
      "add-title": "addTitleView",
      "add-chapter": "addChapterView",
      data: "dataView",
      "edit-series": "editSeriesView"
    };

    const fallback = ids[view] ? view : "home";
    document.querySelectorAll(".view").forEach((section) => section.classList.remove("is-active"));
    document.querySelector(`#${ids[fallback]}`).classList.add("is-active");
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === fallback);
    });

    if (fallback === "translations") renderTranslations();
    if (fallback === "profile") renderProfile();
    if (fallback === "data") renderData();
    if (fallback === "add-chapter") {
      populateChapterTitleSelect();
      updateChapterHints();
    }
    if (fallback === "edit-series") {
      populateEditSeriesSelect();
      populateEditSeriesForm();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function activeViewName() {
    const active = document.querySelector(".view.is-active");
    return active ? active.dataset.viewName : "home";
  }

  function renderSession() {
    const user = currentUser();
    document.querySelector("#loginButton").classList.toggle("is-hidden", Boolean(user));
    document.querySelector("#userMenu").classList.toggle("is-hidden", !user);

    if (user) {
      document.querySelector("#userMenuAvatar").src = user.avatar;
      document.querySelector("#userMenuName").textContent = user.displayName;
    }

    const canTitle = canManageTitles();
    const canChapter = canManageChapters();
    const canData = canManageData();
    setAdminButtonVisibility("add-title", canTitle);
    setAdminButtonVisibility("add-chapter", canChapter);
    setAdminButtonVisibility("data", canData);
    setAdminButtonVisibility("edit-series", canTitle);
    document.querySelector("#teamManager").classList.toggle("is-hidden", !canData);
  }

  function setAdminButtonVisibility(action, visible) {
    document.querySelectorAll(`[data-admin-action="${action}"]`).forEach((button) => {
      button.classList.toggle("is-hidden", !visible);
    });
  }

  function closeUserDropdown() {
    document.querySelector("#userDropdown").classList.remove("is-open");
    document.querySelector("#userTrigger").setAttribute("aria-expanded", "false");
  }

  function loginAs(userId) {
    state.users[userId] = ensureReaderRole(state.users[userId] || mockDiscordUsers[userId]);
    state.currentUser = userId;
    persistState();
    renderAll();
  }

  async function syncPublishedChapters() {
    if (!hasBackend()) return;
    try {
      const response = await fetch(apiUrl(CHAPTER_FEED), { credentials: "include", cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.chapters)) return;

      let changed = false;
      data.chapters.forEach((remoteChapter) => {
        const requestedTitleId = remoteChapter.titleId || remoteChapter.title?.id || remoteChapter.title?.slug;
        const title = findTitle(requestedTitleId) || state.translations.find((item) =>
          remoteChapter.titleName && item.title.toLowerCase() === String(remoteChapter.titleName).toLowerCase()
        );
        if (!title || !remoteChapter.chapter?.id) return;
        const incoming = normalizeChapter(remoteChapter.chapter, title);
        const existingIndex = title.chapters.findIndex((chapter) => chapter.id === incoming.id);
        if (existingIndex < 0) {
          title.chapters.push(incoming);
          changed = true;
        } else if (JSON.stringify(title.chapters[existingIndex]) !== JSON.stringify(incoming)) {
          title.chapters[existingIndex] = incoming;
          changed = true;
        }
      });

      // Keep every title's chapter list unique and ordered newest-first.
      state.translations.forEach((title) => {
        const unique = new Map();
        title.chapters.forEach((chapter) => unique.set(chapter.id, normalizeChapter(chapter, title)));
        const normalized = Array.from(unique.values()).sort((a, b) => chapterTime(b) - chapterTime(a));
        if (JSON.stringify(normalized) !== JSON.stringify(title.chapters)) {
          title.chapters = normalized;
          changed = true;
        }
      });

      if (changed) {
        persistState();
        renderLatest();
        renderCounters();
        if (activeViewName() === "translations") renderTranslations();
      }
    } catch {
      // Synchronizacja jest opcjonalna; strona nadal działa z lokalnym stanem.
    }
  }

  function chapterTime(chapter) {
    const time = new Date(chapter?.date || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  function normalizeChapter(chapter, title) {
    return {
      id: String(chapter.id),
      number: String(chapter.number || "Rozdział"),
      title: String(chapter.title || "Nowy rozdział"),
      season: String(chapter.season || ""),
      date: chapter.date || new Date().toISOString(),
      likes: Number(chapter.likes) || 0,
      cover: chapter.cover || title.cover,
      translators: Array.isArray(chapter.translators) ? chapter.translators : title.translators,
      pages: Array.isArray(chapter.pages) && chapter.pages.length ? chapter.pages : [chapter.cover || title.cover]
    };
  }

  async function publishChapterToServer(titleId, chapter) {
    if (!hasBackend()) return;
    try {
      const response = await fetch(apiUrl(CHAPTER_PUBLISH), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ titleId, titleName: (findTitle(titleId) || {}).title || "", chapter: normalizeChapter(chapter, findTitle(titleId) || { cover: "", translators: [] }) })
      });
      if (!response.ok) throw new Error(`chapter_publish_${response.status}`);
    } catch {
      // Lokalny zapis pozostaje źródłem awaryjnym.
    }
  }

  function renderLatest() {
    const grid = document.querySelector("#latestGrid");
    const latestTitles = state.translations
      .map((title) => ({
        title,
        latestDate: title.chapters.length
          ? Math.max(...title.chapters.map((chapter) => new Date(chapter.date).getTime() || 0))
          : 0
      }))
      .sort((a, b) => b.latestDate - a.latestDate)
      .slice(0, 8);

    grid.innerHTML = latestTitles.map(({ title }) => {
      const lastChapters = title.chapters
        .slice()
        .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))
        .slice(0, 3)
        .map((chapter) => `<p>${escapeHtml(chapter.number)} · ${escapeHtml(formatDate(chapter.date))}</p>`)
        .join("");

      return `
        <article class="latest-card">
          <button type="button" data-open-title="${escapeAttr(title.id)}" aria-label="Otwórz ${escapeAttr(title.title)}">
            <img src="${escapeAttr(title.cover)}" alt="">
            <div class="latest-card-body">
              <h3>${escapeHtml(title.title)}</h3>
              ${lastChapters || `<p>Brak opublikowanych rozdziałów</p>`}
            </div>
          </button>
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-open-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.openTitle));
    });
  }

  function renderRandomTitle() {
    const title = findTitle(state.randomTitleId) || pickRandomTitle();
    state.randomTitleId = title.id;
    document.querySelector("#randomTitle").innerHTML = `
      <div class="random-title-heading">
        <span>Losowy tytuł</span>
      </div>
      <img src="${escapeAttr(title.cover)}" alt="">
      <div class="random-title-body">
        <h3>${escapeHtml(title.title)}</h3>
        <p>${escapeHtml(title.description)}</p>
        <div class="random-actions">
          <button class="primary-button" type="button" data-random-title="${escapeAttr(title.id)}">Przejdź do tytułu</button>
          <button class="ghost-button random-refresh" type="button" data-reroll-title>Losuj ponownie</button>
        </div>
      </div>
    `;
    document.querySelector("[data-random-title]").addEventListener("click", () => openTitle(title.id));
    document.querySelector("[data-reroll-title]").addEventListener("click", () => {
      state.randomTitleId = pickRandomTitle(title.id).id;
      persistState();
      renderRandomTitle();
    });
  }

  function pickRandomTitle(excludeId = null) {
    const pool = state.translations.filter((title) => title.id !== excludeId);
    const source = pool.length ? pool : state.translations;
    return source[Math.floor(Math.random() * source.length)];
  }

  async function renderCounters() {
    const chapters = state.translations.reduce((sum, title) => sum + title.chapters.length, 0);
    const translators = new Set();
    state.translations.forEach((title) => title.translators.forEach((id) => translators.add(id)));
    document.querySelector("#translatorCount").textContent = translators.size;
    document.querySelector("#seriesCount").textContent = state.translations.length;
    document.querySelector("#chapterCount").textContent = chapters;

    const fallbackMembers = 148 + state.team.length;
    document.querySelector("#discordMembers").textContent = fallbackMembers;

    if (!hasBackend()) return;

    try {
      const params = new URLSearchParams({
        channelId: state.discordSettings.countChannelId || "",
        translatorRoleId: state.discordSettings.translatorRoleId || ""
      });
      const response = await fetch(apiUrl(`${DISCORD_STATS}?${params}`), { credentials: "include" });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.members === "number") document.querySelector("#discordMembers").textContent = data.members;
      if (typeof data.translators === "number") document.querySelector("#translatorCount").textContent = data.translators;
    } catch {
      document.querySelector("#discordMembers").textContent = fallbackMembers;
    }
  }

  function renderTeam() {
    document.querySelectorAll("[data-team-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.teamTab === state.activeTeamTab);
    });

    const track = document.querySelector("#teamTrack");
    const members = state.team.filter((member) => member.status === state.activeTeamTab);
    if (state.teamCarouselIndex < 0 || state.teamCarouselIndex >= members.length) state.teamCarouselIndex = 0;

    const renderCard = (member, hidden = false) => {
      const user = state.users[member.discordId] || placeholderUser(member.discordId);
      return `
        <article class="team-card" ${hidden ? 'aria-hidden="true"' : ''}>
          <img class="team-avatar" src="${escapeAttr(user.avatar)}" alt="">
          <div>
            <h3>${escapeHtml(user.displayName)}</h3>
            <p>${escapeHtml(member.roles.join(", "))}</p>
          </div>
        </article>
      `;
    };

    // Three copies create a real circular sequence: ... Mika → Flooo → Katsumi ...
    // The middle copy is the visible starting point; when either edge is reached
    // the scroll position is silently recentered to the identical copy.
    track.innerHTML = members.length
      ? [0, 1, 2].flatMap(() => members.map((member, index) => renderCard(member, true))).join("")
      : `<div class="team-empty">Brak osób w tej kadrze.</div>`;

    requestAnimationFrame(() => {
      if (!members.length) return;
      const firstCard = track.querySelector(".team-card");
      const gap = 24;
      const step = firstCard.offsetWidth + gap;
      const absoluteIndex = members.length + state.teamCarouselIndex;
      const targetCard = track.querySelectorAll(".team-card")[absoluteIndex];
      if (targetCard) {
        const targetLeft = targetCard.offsetLeft - track.clientWidth / 2 + targetCard.offsetWidth / 2;
        track.scrollLeft = Math.max(0, targetLeft);
      }
    });

    const adminList = document.querySelector("#teamAdminList");
    adminList.innerHTML = state.team.map((member) => {
      const user = state.users[member.discordId] || placeholderUser(member.discordId);
      return `
        <article class="team-admin-item" draggable="true" data-team-drag="${escapeAttr(member.id)}">
          <span class="team-drag-handle" title="Przeciągnij, aby zmienić kolejność" aria-hidden="true">⋮⋮</span>
          <img src="${escapeAttr(user.avatar)}" alt="">
          <div>
            <strong>${escapeHtml(user.displayName)}</strong>
            <small>ID: ${escapeHtml(member.discordId)}</small>
          </div>
          <div class="mini-actions">
            <button class="team-admin-action" type="button" data-edit-team="${escapeAttr(member.id)}">Edytuj</button>
            <button class="team-admin-action is-danger" type="button" data-delete-team="${escapeAttr(member.id)}">Usuń</button>
          </div>
        </article>
      `;
    }).join("");

    renderSession();
  }

  function getTeamCarouselMetrics() {
    const track = document.querySelector("#teamTrack");
    if (!track) return null;
    const firstCard = track.querySelector(".team-card");
    if (!firstCard) return null;
    const gap = 24;
    const step = firstCard.offsetWidth + gap;
    const members = state.team.filter((member) => member.status === state.activeTeamTab);
    return { track, step, membersCount: members.length };
  }

  function moveTeamCarousel(direction) {
    const metrics = getTeamCarouselMetrics();
    if (!metrics || metrics.membersCount <= 1 || state.teamCarouselMoving) return;

    const { track, step, membersCount } = metrics;
    const current = state.teamCarouselIndex || 0;
    const currentAbsolute = membersCount + current;
    const targetAbsolute = currentAbsolute + direction;
    const cards = track.querySelectorAll(".team-card");
    const targetCard = cards[targetAbsolute];
    if (!targetCard) return;

    state.teamCarouselMoving = true;
    state.teamCarouselIndex = (current + direction + membersCount) % membersCount;

    // Move exactly one card. When crossing the end/start, use the adjacent
    // clone, so Mika -> Flooo is still a normal one-card animation.
    const targetLeft = targetCard.offsetLeft - track.clientWidth / 2 + targetCard.offsetWidth / 2;
    track.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });

    window.setTimeout(() => {
      // Re-center on the identical visual card only after the animation has
      // finished. Because the clone is identical, the user sees no jump.
      if (direction > 0 && targetAbsolute >= membersCount * 2) {
        const resetCard = cards[membersCount + state.teamCarouselIndex];
        if (resetCard) {
          track.scrollTo({
            left: resetCard.offsetLeft - track.clientWidth / 2 + resetCard.offsetWidth / 2,
            behavior: "auto"
          });
        }
      } else if (direction < 0 && targetAbsolute < membersCount) {
        const resetCard = cards[membersCount + state.teamCarouselIndex];
        if (resetCard) {
          track.scrollTo({
            left: resetCard.offsetLeft - track.clientWidth / 2 + resetCard.offsetWidth / 2,
            behavior: "auto"
          });
        }
      }
      state.teamCarouselMoving = false;
    }, 500);
  }

  function renderGenreOptions() {
    const genres = Array.from(new Set(state.translations.flatMap((title) => title.genres))).sort((a, b) => a.localeCompare(b, "pl"));
    document.querySelector("#genreFilter").innerHTML = `<option value="all">Wszystkie</option>${genres.map((genre) => {
      return `<option value="${escapeAttr(genre)}">${escapeHtml(genre)}</option>`;
    }).join("")}`;
  }

  function renderTranslations() {
    const grid = document.querySelector("#translationGrid");
    const type = document.querySelector("#typeFilter").value;
    const status = document.querySelector("#statusFilter").value;
    const genre = document.querySelector("#genreFilter").value || "all";
    const adult = document.querySelector("#adultFilter").checked;
    const query = state.titleQuery.toLowerCase();

    const filtered = state.translations.filter((title) => {
      if (query && !title.title.toLowerCase().includes(query)) return false;
      if (type !== "all" && title.type !== type) return false;
      if (status !== "all" && title.status !== status) return false;
      if (genre !== "all" && !title.genres.includes(genre)) return false;
      if (!adult && title.adult) return false;
      return true;
    });

    grid.innerHTML = filtered.map((title) => `
      <article class="translation-card">
        <button type="button" data-open-title="${escapeAttr(title.id)}">
          <img class="translation-cover" src="${escapeAttr(title.cover)}" alt="">
          <h2>${escapeHtml(title.title)}</h2>
        </button>
      </article>
    `).join("");

    grid.querySelectorAll("[data-open-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.openTitle));
    });
  }

  function openTitle(titleId) {
    location.hash = `#title/${encodeURIComponent(titleId)}`;
  }

  function renderTitle(titleId) {
    const title = findTitle(titleId);
    const container = document.querySelector("#titleDetail");
    if (!title) {
      container.innerHTML = `<div class="title-info-block"><h1>Nie znaleziono tytułu</h1></div>`;
      return;
    }

    const inLibrary = state.library.includes(title.id);
    const staff = [
      ["Autor", title.authors.join(", ")],
      ["Artysta", title.artists.join(", ")],
      ["Tłumacz", title.translators.map(displayUserName).join(", ")],
      ["Edycja", title.editors.map((editor) => `${editor.role}: ${editor.name}`).join(", ") || "Brak"]
    ];

    container.innerHTML = `
      <article class="title-detail">
        <section class="title-hero">
          <img class="title-banner" src="${escapeAttr(title.banner)}" alt="">
          <div class="title-main">
            <img class="title-cover" src="${escapeAttr(title.cover)}" alt="">
            <div class="title-copy">
              <h1>${escapeHtml(title.title)}</h1>
              <p>${escapeHtml(title.description)}</p>
              <div class="tag-row">
                ${title.genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("")}
                <span class="tag">${escapeHtml(title.type)}</span>
                <span class="tag">${escapeHtml(title.status)}</span>
              </div>
              <div class="title-actions">
                <button class="primary-button" type="button" data-library="${escapeAttr(title.id)}">
                  ${inLibrary ? "W bibliotece" : "Dodaj do biblioteki"}
                </button>
                ${canManageTitles() ? `<button class="ghost-button" type="button" data-edit-title="${escapeAttr(title.id)}">Edytuj serię</button>` : ""}
              </div>
            </div>
          </div>
        </section>

        <div class="title-info-grid">
          <section class="title-info-block">
            <h2>Osoby</h2>
            <div class="staff-list">
              ${staff.map(([label, value]) => `
                <div class="staff-row">
                  <b>${escapeHtml(label)}</b>
                  <span>${escapeHtml(value)}</span>
                </div>
              `).join("")}
            </div>
          </section>

          <section class="title-info-block">
            <h2>Rozdziały</h2>
            <div class="chapter-list">
              ${title.chapters.slice().reverse().map((chapter) => renderChapterRow(title, chapter)).join("")}
            </div>
          </section>
        </div>
      </article>
    `;

    container.querySelector("[data-library]").addEventListener("click", () => toggleLibrary(title.id));
    container.querySelectorAll("[data-open-reader]").forEach((button) => {
      button.addEventListener("click", () => {
        location.hash = `#reader/${encodeURIComponent(title.id)}/${encodeURIComponent(button.dataset.openReader)}`;
      });
    });
    container.querySelectorAll("[data-like-chapter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleChapterLike(title.id, button.dataset.likeChapter);
        renderTitle(title.id);
      });
    });
    const editButton = container.querySelector("[data-edit-title]");
    if (editButton) {
      editButton.addEventListener("click", () => {
        navigate("edit-series");
        setTimeout(() => {
          document.querySelector("#editSeriesSelect").value = title.id;
          populateEditSeriesForm();
        }, 0);
      });
    }
  }

  function renderChapterRow(title, chapter) {
    const read = state.readChapters.includes(chapter.id);
    const liked = state.likedChapters.includes(chapter.id);
    return `
      <button class="chapter-card ${read ? "is-read" : ""}" type="button" data-open-reader="${escapeAttr(chapter.id)}">
        <img class="chapter-thumb" src="${escapeAttr(chapter.cover || title.cover)}" alt="">
        <span class="chapter-info">
          <h3>${escapeHtml(chapter.number)}</h3>
          <p>${escapeHtml(chapter.title)}</p>
        </span>
        <span class="chapter-date">${escapeHtml(formatDate(chapter.date))}</span>
        <span class="heart-button ${liked ? "is-liked" : ""}" data-like-chapter="${escapeAttr(chapter.id)}">♥ ${chapter.likes}</span>
      </button>
    `;
  }

  function renderReader(titleId, chapterId) {
    const title = findTitle(titleId);
    const chapter = title ? title.chapters.find((item) => item.id === chapterId) : null;
    const container = document.querySelector("#readerDetail");
    if (!title || !chapter) {
      container.innerHTML = `<div class="title-info-block"><h1>Nie znaleziono rozdziału</h1></div>`;
      return;
    }

    markRead(chapter.id);
    const liked = state.likedChapters.includes(chapter.id);
    const pages = chapter.pages && chapter.pages.length ? chapter.pages : [title.cover];
    container.innerHTML = `
      <article class="reader-shell">
        <div class="reader-bar">
          <button class="ghost-button" type="button" data-back-title="${escapeAttr(title.id)}">← Tytuł</button>
          <div class="reader-title">
            <h1>${escapeHtml(chapter.number)}</h1>
            <p>${escapeHtml(title.title)} · ${escapeHtml(formatDate(chapter.date))}</p>
          </div>
          <button class="heart-button ${liked ? "is-liked" : ""}" type="button" data-reader-like="${escapeAttr(chapter.id)}">♥ ${chapter.likes}</button>
        </div>
        <div class="reader-pages">
          ${pages.map((page, index) => `
            <figure class="reader-page">
              ${page ? `<img src="${escapeAttr(page)}" alt="Strona ${index + 1}">` : `<div class="reader-page-fallback">Strona ${index + 1}</div>`}
            </figure>
          `).join("")}
        </div>
      </article>
    `;

    container.querySelector("[data-back-title]").addEventListener("click", () => openTitle(title.id));
    container.querySelector("[data-reader-like]").addEventListener("click", () => {
      toggleChapterLike(title.id, chapter.id);
      renderReader(title.id, chapter.id);
    });
  }

  function renderProfile() {
    const container = document.querySelector("#profileDetail");
    const user = currentUser();
    if (!user) {
      container.innerHTML = `
        <div class="profile-shell">
          <div class="profile-body" style="padding-top: 32px;">
            <div class="profile-tile">
              <h1>Profil pojawi się po logowaniu.</h1>
              <p>Zaloguj się przez Discorda albo użyj trybu demonstracyjnego lokalnie.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const libraryTitles = state.library.map(findTitle).filter(Boolean);
    const translated = state.translations.filter((title) => title.translators.includes(user.id));

    container.innerHTML = `
      <article class="profile-shell">
        <div class="profile-banner"><img src="${escapeAttr(user.banner)}" alt=""></div>
        <div class="profile-body">
          <div class="profile-header-row">
            <img class="profile-avatar" src="${escapeAttr(user.avatar)}" alt="">
            <div class="profile-names">
              <h1>${escapeHtml(user.displayName)}</h1>
              <p>@${escapeHtml(user.username)}</p>
              <div class="tag-row">${user.roles.map((role) => `<span class="tag">${escapeHtml(role)}</span>`).join("")}</div>
            </div>
          </div>

          <div class="profile-content">
            <section class="profile-tile profile-description">
              <h2>Opis</h2>
              <textarea id="profileDescriptionInput">${escapeHtml(state.profileDescription)}</textarea>
              <button class="primary-button" type="button" id="saveProfileDescription">Zapisz opis</button>
            </section>

            <section class="profile-tile">
              <h2>Biblioteczka</h2>
              <div class="library-grid">
                ${libraryTitles.length ? libraryTitles.map((title) => `
                  <button class="library-item" type="button" data-profile-title="${escapeAttr(title.id)}">
                    <img class="library-cover" src="${escapeAttr(title.cover)}" alt="">
                    <h3>${escapeHtml(title.title)}</h3>
                  </button>
                `).join("") : `<p>Nie masz jeszcze tytułów w bibliotece.</p>`}
              </div>
            </section>

            ${translated.length ? `
              <section class="profile-tile">
                <h2>Tłumaczone tytuły</h2>
                <div class="library-grid">
                  ${translated.map((title) => `
                    <button class="library-item" type="button" data-profile-title="${escapeAttr(title.id)}">
                      <img class="library-cover" src="${escapeAttr(title.cover)}" alt="">
                      <h3>${escapeHtml(title.title)}</h3>
                    </button>
                  `).join("")}
                </div>
              </section>
            ` : ""}
          </div>
        </div>
      </article>
    `;

    container.querySelector("#saveProfileDescription").addEventListener("click", () => {
      state.profileDescription = document.querySelector("#profileDescriptionInput").value;
      persistState();
    });
    container.querySelectorAll("[data-profile-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.profileTitle));
    });
  }

  function renderData() {
    hydrateConfigForm();
    const roleGrid = document.querySelector("#roleGrid");
    const roleCards = roles.map((role) => `
      <article class="role-card">
        <h3>${escapeHtml(role.name)}</h3>
        <p>${escapeHtml(role.permissions)}</p>
      </article>
    `).join("");

    const userRoleCards = canManageData() ? Object.values(state.users).map((user) => `
      <article class="role-card" data-role-user="${escapeAttr(user.id)}">
        <h3>${escapeHtml(user.displayName)}</h3>
        <p>@${escapeHtml(user.username)} · ID: ${escapeHtml(user.id)}</p>
        <label>
          Role
          <select multiple data-user-roles="${escapeAttr(user.id)}">
            ${roles.map((role) => `<option value="${escapeAttr(role.name)}" ${user.roles.includes(role.name) ? "selected" : ""}>${escapeHtml(role.name)}</option>`).join("")}
          </select>
        </label>
      </article>
    `).join("") : "";

    roleGrid.innerHTML = roleCards + userRoleCards;
    roleGrid.querySelectorAll("[data-user-roles]").forEach((select) => {
      select.addEventListener("change", () => {
        const user = state.users[select.dataset.userRoles];
        if (!user) return;
        user.roles = Array.from(select.selectedOptions).map((option) => option.value);
        user.roles = ensureReaderRole(user).roles;
        if (state.currentUser === user.id) state.currentUser = user.id;
        persistState();
        renderSession();
        renderProfile();
      });
    });
  }

  async function handleAddTitle(event) {
    event.preventDefault();
    const cover = await fileToDataUrl(document.querySelector("#newTitleCover").files[0]);
    const banner = await fileToDataUrl(document.querySelector("#newTitleBanner").files[0]);
    const selectedTranslators = selectedValues(document.querySelector("#newTitleTranslators"));
    const titleName = document.querySelector("#newTitleName").value.trim();
    const newTitle = {
      id: slugify(titleName),
      title: titleName,
      type: document.querySelector("#newTitleType").value,
      status: document.querySelector("#newTitleStatus").value,
      genres: splitList(document.querySelector("#newTitleGenres").value),
      adult: false,
      cover,
      banner,
      description: document.querySelector("#newTitleDescription").value.trim(),
      authors: document.querySelector("#authorUnknown").checked ? ["Nieznany"] : splitList(document.querySelector("#newTitleAuthors").value),
      artists: document.querySelector("#artistUnknown").checked ? ["Nieznany"] : splitList(document.querySelector("#newTitleArtists").value),
      translators: selectedTranslators,
      editors: splitList(document.querySelector("#newTitleEditors").value).map((entry) => {
        const [role, name] = entry.includes(":") ? entry.split(":") : ["Edycja", entry];
        return { role: role.trim(), name: name.trim() };
      }),
      chapters: []
    };

    if (state.translations.some((title) => title.id === newTitle.id)) {
      newTitle.id = `${newTitle.id}-${Date.now()}`;
    }

    state.translations.push(newTitle);
    event.target.reset();
    persistState();
    renderAll();
    openTitle(newTitle.id);
  }

  function handleChapterFiles(event) {
    const files = Array.from(event.target.files || []).sort((a, b) => a.name.localeCompare(b.name, "pl"));
    state.uploadedPages = files.map((file) => ({
      name: file.name,
      file,
      preview: URL.createObjectURL(file)
    }));
    renderUploadList();
  }

  function renderUploadList() {
    const list = document.querySelector("#uploadList");
    list.innerHTML = state.uploadedPages.map((file, index) => `
      <div class="upload-item">
        <span>${escapeHtml(index + 1)}. ${escapeHtml(file.name)}</span>
        <div class="mini-actions">
          <button class="icon-button" type="button" data-page-up="${index}" aria-label="Przenieś wyżej">↑</button>
          <button class="icon-button" type="button" data-page-down="${index}" aria-label="Przenieś niżej">↓</button>
        </div>
      </div>
    `).join("");

    list.querySelectorAll("[data-page-up]").forEach((button) => {
      button.addEventListener("click", () => moveUploadedPage(Number(button.dataset.pageUp), -1));
    });
    list.querySelectorAll("[data-page-down]").forEach((button) => {
      button.addEventListener("click", () => moveUploadedPage(Number(button.dataset.pageDown), 1));
    });
  }

  function moveUploadedPage(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= state.uploadedPages.length) return;
    const temp = state.uploadedPages[index];
    state.uploadedPages[index] = state.uploadedPages[next];
    state.uploadedPages[next] = temp;
    renderUploadList();
  }

  async function handleAddChapter(event) {
    event.preventDefault();
    const title = findTitle(document.querySelector("#chapterTitleSelect").value);
    if (!title) return;

    const pages = state.uploadedPages.length
      ? await Promise.all(state.uploadedPages.map((page) => fileToDataUrl(page.file)))
      : [title.cover, title.cover, title.cover];
    const selectedTranslators = selectedValues(document.querySelector("#chapterTranslatorSelect"));
    const number = document.querySelector("#chapterNumber").value.trim();
    const chapter = {
      id: `${title.id}-chapter-${slugify(number)}-${Date.now()}`,
      number: `Rozdział ${number}`,
      title: selectedTranslators.length ? `Tłumaczenie: ${selectedTranslators.map(displayUserName).join(", ")}` : "Nowy rozdział",
      season: document.querySelector("#chapterSeason").value.trim(),
      date: document.querySelector("#chapterDate").value || new Date().toISOString(),
      likes: 0,
      cover: title.cover,
      translators: selectedTranslators,
      pages
    };

    title.chapters.push(chapter);
    await publishChapterToServer(title.id, chapter);
    state.uploadedPages = [];
    event.target.reset();
    renderUploadList();
    persistState();
    renderAll();
    openTitle(title.id);
  }

  function handleSaveData(event) {
    event.preventDefault();
    state.discordSettings.clientId = document.querySelector("#discordClientId").value.trim();
    state.discordSettings.redirectUri = document.querySelector("#discordRedirectUri").value.trim();
    state.discordSettings.countChannelId = document.querySelector("#discordCountChannelId").value.trim();
    state.discordSettings.translatorRoleId = document.querySelector("#discordTranslatorRoleId").value.trim();
    persistState();
    renderCounters();
  }

  function handleEditSeries(event) {
    event.preventDefault();
    const title = findTitle(document.querySelector("#editSeriesSelect").value);
    if (!title) return;
    title.title = document.querySelector("#editSeriesName").value.trim();
    title.cover = document.querySelector("#editSeriesCover").value.trim();
    title.banner = document.querySelector("#editSeriesBanner").value.trim();
    title.description = document.querySelector("#editSeriesDescription").value.trim();
    title.type = document.querySelector("#editSeriesType").value.trim();
    title.status = document.querySelector("#editSeriesStatus").value;
    title.genres = splitList(document.querySelector("#editSeriesGenres").value);
    persistState();
    renderAll();
    openTitle(title.id);
  }

  function handleDeleteSeries() {
    const titleId = document.querySelector("#editSeriesSelect").value;
    state.translations = state.translations.filter((title) => title.id !== titleId);
    state.library = state.library.filter((id) => id !== titleId);
    persistState();
    renderAll();
    navigate("translations");
  }

  function hydrateConfigForm() {
    document.querySelector("#discordClientId").value = state.discordSettings.clientId || "";
    document.querySelector("#discordRedirectUri").value = state.discordSettings.redirectUri || "";
    document.querySelector("#discordCountChannelId").value = state.discordSettings.countChannelId || "";
    document.querySelector("#discordTranslatorRoleId").value = state.discordSettings.translatorRoleId || "";
  }

  function populatePeopleSelects() {
    const translators = state.team
      .filter((member) => member.status === "current")
      .map((member) => state.users[member.discordId] || placeholderUser(member.discordId));

    const options = translators.map((user) => `<option value="${escapeAttr(user.id)}">${escapeHtml(user.displayName)} · ${escapeHtml(user.id)}</option>`).join("");
    document.querySelector("#newTitleTranslators").innerHTML = options;
    document.querySelector("#chapterTranslatorSelect").innerHTML = options;
  }

  function populateChapterTitleSelect() {
    const select = document.querySelector("#chapterTitleSelect");
    const user = currentUser();
    const titles = state.translations.filter((title) => {
      if (!user) return false;
      if (canManageTitles()) return true;
      if (hasRole("Tłumacz")) return title.translators.includes(user.id);
      return false;
    });

    select.innerHTML = titles.map((title) => `<option value="${escapeAttr(title.id)}">${escapeHtml(title.title)}</option>`).join("");
    updateChapterHints();
  }

  function updateChapterHints() {
    const select = document.querySelector("#chapterTitleSelect");
    const title = findTitle(select.value);
    if (!title) return;
    const last = title.chapters[title.chapters.length - 1];
    document.querySelector("#chapterNumber").placeholder = last ? `Propozycja: ${suggestNextChapter(last.number)}` : "Propozycja: 1";
  }

  function populateEditSeriesSelect() {
    const select = document.querySelector("#editSeriesSelect");
    const previous = select.value;
    select.innerHTML = state.translations.map((title) => `<option value="${escapeAttr(title.id)}">${escapeHtml(title.title)}</option>`).join("");
    if (previous && state.translations.some((title) => title.id === previous)) select.value = previous;
    populateEditSeriesForm();
  }

  function populateEditSeriesForm() {
    const title = findTitle(document.querySelector("#editSeriesSelect").value);
    if (!title) return;
    document.querySelector("#editSeriesName").value = title.title;
    document.querySelector("#editSeriesCover").value = title.cover;
    document.querySelector("#editSeriesBanner").value = title.banner;
    document.querySelector("#editSeriesDescription").value = title.description;
    document.querySelector("#editSeriesType").value = title.type;
    document.querySelector("#editSeriesStatus").value = title.status;
    document.querySelector("#editSeriesGenres").value = title.genres.join(", ");
  }

  function toggleLibrary(titleId) {
    if (!currentUser()) {
      loginAs("100000000000000001");
    }

    if (state.library.includes(titleId)) {
      state.library = state.library.filter((id) => id !== titleId);
    } else {
      state.library.push(titleId);
    }
    persistState();
    renderTitle(titleId);
    renderProfile();
  }

  function toggleChapterLike(titleId, chapterId) {
    const title = findTitle(titleId);
    const chapter = title ? title.chapters.find((item) => item.id === chapterId) : null;
    if (!chapter) return;
    const liked = state.likedChapters.includes(chapter.id);
    if (liked) {
      state.likedChapters = state.likedChapters.filter((id) => id !== chapter.id);
      chapter.likes = Math.max(0, chapter.likes - 1);
    } else {
      state.likedChapters.push(chapter.id);
      chapter.likes += 1;
    }
    persistState();
  }

  function markRead(chapterId) {
    if (!state.readChapters.includes(chapterId)) {
      state.readChapters.push(chapterId);
      persistState();
    }
  }

  function currentUser() {
    return state.currentUser ? state.users[state.currentUser] : null;
  }

  function hasRole(roleName) {
    const user = currentUser();
    return Boolean(user && user.roles.includes(roleName));
  }

  function canManageTitles() {
    return hasAnyRole(["Właściciel", "Współwłaściciel", "Administrator"]);
  }

  function canManageChapters() {
    return hasAnyRole(["Właściciel", "Współwłaściciel", "Administrator", "Tłumacz"]);
  }

  function canManageData() {
    return hasAnyRole(["Właściciel", "Współwłaściciel", "Administrator"]);
  }

  function hasAnyRole(names) {
    const user = currentUser();
    return Boolean(user && names.some((role) => user.roles.includes(role)));
  }

  function selectedValues(select) {
    return Array.from(select.selectedOptions).map((option) => option.value);
  }

  function findTitle(id) {
    return state.translations.find((title) => title.id === id);
  }

  function displayUserName(userId) {
    const user = state.users[userId] || placeholderUser(userId);
    return user.displayName;
  }

  async function getDiscordUser(discordId) {
    if (state.users[discordId]) return state.users[discordId];
    if (hasBackend()) {
      try {
        const response = await fetch(apiUrl(`${DISCORD_USER}${encodeURIComponent(discordId)}`), { credentials: "include" });
        if (response.ok) return ensureReaderRole(await response.json());
      } catch {
        return placeholderUser(discordId);
      }
    }
    return placeholderUser(discordId);
  }

  function placeholderUser(discordId) {
    const shortId = discordId ? discordId.slice(-4) : "0000";
    return ensureReaderRole({
      id: discordId || `local-${Date.now()}`,
      displayName: `Discord ${shortId}`,
      username: `user_${shortId}`,
      roles: ["Czytelnik"],
      avatar: avatarSvg(shortId.slice(-1), "#ffe1f0", "#9d3c72"),
      banner: bannerSvg("#ffe0f1", "#ffa6d8", shortId)
    });
  }

  function ensureReaderRole(user) {
    const next = clone(user);
    next.roles = Array.isArray(next.roles) ? next.roles.slice() : [];
    if (!next.roles.includes("Czytelnik")) next.roles.push("Czytelnik");
    next.avatar = next.avatar || avatarSvg(initialsFor(next.displayName || next.username || "?"), "#ffe1f0", "#9d3c72");
    next.banner = next.banner || bannerSvg("#ffe0f1", "#ffa6d8", next.displayName || "BB");
    return next;
  }

  function apiUrl(path) {
    return `${API_BASE}${path}`;
  }

  function hasBackend() {
    if (location.search.includes("demo=1")) return false;
    if (API_BASE) return true;
    if (!location.protocol.startsWith("http")) return false;
    if (location.hostname.endsWith("github.io")) return false;
    return true;
  }

  function restoreState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return clone(seedState);
      const parsed = JSON.parse(saved);
      const merged = Object.assign(clone(seedState), parsed);
      merged.users = Object.assign(clone(seedState.users), parsed.users || {});
      merged.discordSettings = Object.assign(clone(seedState.discordSettings), parsed.discordSettings || {});
      merged.uploadedPages = [];
      if (!Number.isInteger(merged.teamCarouselIndex)) merged.teamCarouselIndex = 0;
      return merged;
    } catch {
      return clone(seedState);
    }
  }

  function persistState() {
    const safe = clone(state);
    safe.uploadedPages = [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  }

  function makeTranslation(options) {
    const cover = options.cover || coverSvg(options.title, "#ffd1e8", "#9d3c72");
    const title = {
      id: options.id,
      title: options.title,
      type: options.type || "Manhwa",
      status: options.status || "Aktywna",
      genres: options.genres || ["Romans"],
      adult: Boolean(options.adult),
      cover,
      banner: options.banner || bannerSvg("#ffd1e8", "#ffa6d8", options.title),
      description: options.description || "Opis serii pojawi się tutaj po uzupełnieniu panelu dodawania lub edycji.",
      authors: options.authors || ["Nieznany"],
      artists: options.artists || ["Brak profilu"],
      translators: options.translators || ["100000000000000001"],
      editors: options.editors || [{ role: "Korektor", name: "BunBun" }],
      chapters: []
    };

    title.chapters = [1, 2, 3].map((number, index) => ({
      id: `${title.id}-ch-${number}`,
      number: `Rozdział ${number}`,
      title: `Rozdział ${number}`,
      season: "1",
      date: new Date(Date.UTC(2026, 7, 9 - index)).toISOString(),
      likes: (options.likes && options.likes[index]) || 0,
      cover: title.cover,
      translators: title.translators,
      pages: makeChapterPages(title, number)
    }));
    return title;
  }

  function makeChapterPages(title, number) {
    if (title.id === "unsleep") {
      return [SAMPLE_PAGE_1, SAMPLE_PAGE_2];
    }
    return [1, 2, 3, 4].map((page) => pageSvg(`${title.title}\n${number}.${page}`, page));
  }

  function splitList(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function suggestNextChapter(value) {
    const match = String(value).match(/([0-9]+(?:[.,][0-9]+)?)(?!.*[0-9])/);
    if (!match) return "1";
    const number = Number(match[1].replace(",", "."));
    if (!Number.isFinite(number)) return "1";
    return String(number + 1);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("Brak pliku"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function formatDate(dateValue) {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || `title-${Date.now()}`;
  }

  function initialsFor(value) {
    return Array.from(String(value || "?").trim())[0] || "?";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function avatarSvg(letter, background, foreground) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="${background}" offset="0"/>
            <stop stop-color="#fff7fb" offset="1"/>
          </linearGradient>
        </defs>
        <rect width="220" height="220" rx="110" fill="url(#g)"/>
        <circle cx="50" cy="48" r="30" fill="#fff" opacity=".32"/>
        <circle cx="178" cy="168" r="42" fill="#fff" opacity=".24"/>
        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Arial" font-size="96" font-weight="900" fill="${foreground}">${escapeHtml(letter)}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function bannerSvg(from, to, label) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="520" viewBox="0 0 1400 520">
        <defs>
          <linearGradient id="b" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="${from}" offset="0"/>
            <stop stop-color="${to}" offset=".8"/>
          </linearGradient>
        </defs>
        <rect width="1400" height="520" fill="url(#b)"/>
        <path d="M0 390 C 260 300, 420 540, 720 420 S 1150 280, 1400 360 L 1400 520 L 0 520 Z" fill="#fff" opacity=".36"/>
        <circle cx="1080" cy="105" r="78" fill="#fff" opacity=".22"/>
        <circle cx="220" cy="180" r="120" fill="#fff" opacity=".18"/>
        <text x="80" y="310" font-family="Segoe UI, Arial" font-size="84" font-weight="900" fill="#ffffff" opacity=".72">${escapeHtml(label)}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function coverSvg(title, from, textColor) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960">
        <defs>
          <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="${from}" offset="0"/>
            <stop stop-color="#fff7fb" offset="1"/>
          </linearGradient>
        </defs>
        <rect width="720" height="960" fill="url(#c)"/>
        <rect x="46" y="50" width="628" height="860" rx="28" fill="#fff" opacity=".25"/>
        <circle cx="545" cy="195" r="92" fill="#fff" opacity=".3"/>
        <circle cx="170" cy="710" r="125" fill="#fff" opacity=".22"/>
        <text x="70" y="500" font-family="Segoe UI, Arial" font-size="72" font-weight="900" fill="${textColor}">${escapeHtml(title)}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function pageSvg(label, index) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1350" viewBox="0 0 900 1350">
        <rect width="900" height="1350" fill="#fff7fb"/>
        <rect x="0" y="0" width="900" height="1350" fill="#ffd4ec" opacity="${0.2 + index * 0.08}"/>
        <path d="M0 970 C 230 860 380 1230 620 1040 S 820 840 900 910 L 900 1350 L 0 1350 Z" fill="#fff" opacity=".66"/>
        <circle cx="710" cy="270" r="140" fill="#fff" opacity=".48"/>
        <circle cx="235" cy="450" r="190" fill="#fff" opacity=".35"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Segoe UI, Arial" font-size="76" font-weight="900" fill="#9d3c72">${escapeHtml(label)}</text>
      </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
})();
