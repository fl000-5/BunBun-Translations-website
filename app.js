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
  const TITLES_API = "/api/titles";
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
    profileViewingUserId: null,
    teamCarouselIndex: 0,
    teamCarouselMoving: false,
    teamCarouselInitialized: false,
    titleQuery: "",
    randomTitleId: null,
    uploadedPages: [],
    profileDescription: "",
    discordSettings: {
      clientId: "",
      redirectUri: "https://twojadomena.pl/api/auth/discord/callback",
      countChannelId: "",
      translatorRoleId: "",
      helperRoleId: ""
    },
    users: clone(mockDiscordUsers),
    team: [
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
        banner: bannerSvg("#ffd0e9", "#f391ca", "Unsleep"),
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

  // Migration: remove the three accounts requested for deletion from older local caches.
  const removedSeedIds = new Set([
    "100000000000000001",
    "100000000000000002",
    "100000000000000003"
  ]);
  state.team = state.team.filter((member) => !removedSeedIds.has(String(member.discordId)));

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    bindNavigation();
    bindLogin();
    bindFilters();
    bindTeam();
    bindForms();
    await initDiscordSession();
    renderAll();
    await syncTitlesFromServer();
    await hydrateTranslatorUsers();
    await hydrateTeamUsers();
    state.activeTeamTab = "current";
    state.teamCarouselInitialized = false;
    renderTeam();
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
    document.querySelector("#searchForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      renderGlobalSearch();
    });
    searchInput.addEventListener("input", () => {
      state.titleQuery = searchInput.value.trim();
      renderGlobalSearch();
      if (activeViewName() === "translations") {
        renderTranslations();
      }
    });
    searchInput.addEventListener("focus", () => renderGlobalSearch());
    document.addEventListener("click", (event) => {
      if (!event.target.closest("#searchForm")) {
        document.querySelector("#globalSearchResults")?.classList.add("is-hidden");
      }
    });
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        searchInput.value = "";
        state.titleQuery = "";
        document.querySelector("#globalSearchResults")?.classList.add("is-hidden");
        if (activeViewName() === "translations") renderTranslations();
      }
    });
  }

  function renderGlobalSearch() {
    const box = document.querySelector("#globalSearchResults");
    const input = document.querySelector("#titleSearch");
    if (!box || !input) return;
    const query = input.value.trim().toLowerCase();
    if (!query) {
      box.classList.add("is-hidden");
      box.innerHTML = "";
      return;
    }

    const results = state.translations
      .filter((title) => title.title.toLowerCase().includes(query))
      .sort((a, b) => a.title.localeCompare(b.title, "pl", { sensitivity: "base" }))
      .slice(0, 8);

    box.innerHTML = results.length
      ? results.map((title) => `
          <button type="button" class="global-search-result" data-global-search-title="${escapeAttr(title.id)}">
            <img src="${escapeAttr(title.cover)}" alt="">
            <span>
              <b>${escapeHtml(title.title)}</b>
              <small>${escapeHtml(title.type)} · ${escapeHtml(title.status)}</small>
            </span>
          </button>
        `).join("")
      : `<div class="global-search-empty">Nie znaleziono tytułu.</div>`;

    box.classList.remove("is-hidden");
    box.querySelectorAll("[data-global-search-title]").forEach((button) => {
      button.addEventListener("click", () => {
        box.classList.add("is-hidden");
        input.blur();
        openTitle(button.dataset.globalSearchTitle);
      });
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
    ["typeFilter", "statusFilter", "genreFilter", "adultFilter"].forEach((id) => {
      document.querySelector(`#${id}`).addEventListener("change", renderTranslations);
    });
  }

  function bindTeam() {
    document.querySelectorAll("[data-team-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTeamTab = button.dataset.teamTab;
        state.teamCarouselIndex = 0;
        state.teamCarouselInitialized = false;
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
    bindProfileNavigation();
    renderSession();
    renderLatest();
    renderRandomTitle();
    renderCounters();
    renderTeam();
    renderGenreOptions();
    renderTranslations();
    populatePeopleSelects();
    populateChapterTitleSelect();
    renderProfile();
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
    library: "libraryView",
      "add-title": "addTitleView",
      "add-chapter": "addChapterView",
      data: "dataView",
    };

    const fallback = ids[view] ? view : "home";
    document.querySelectorAll(".view").forEach((section) => section.classList.remove("is-active"));
    document.querySelector(`#${ids[fallback]}`).classList.add("is-active");
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === fallback);
    });

    if (fallback === "translations") renderTranslations();
    if (fallback === "profile") renderProfile();
    if (fallback === "library") renderLibrary();
    if (fallback === "data") renderData();
    if (fallback === "add-chapter") {
      populateChapterTitleSelect();
      updateChapterHints();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function activeViewName() {
    const active = document.querySelector(".view.is-active");
    return active ? active.dataset.viewName : "home";
  }

  function bindProfileNavigation() {
    document.querySelectorAll('[data-view="profile"], [data-nav="profile"]').forEach((el) => {
      el.addEventListener("click", () => { state.profileViewingUserId = null; });
    });
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

  async function syncTitlesFromServer() {
    if (!hasBackend()) return;
    try {
      const response = await fetch(apiUrl(TITLES_API), { credentials: "include", cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const remote = Array.isArray(data.titles) ? data.titles : [];
      if (remote.length) {
        state.translations = remote;
        state.translations.forEach(normalizeTitlePeople);
        persistState();
        renderAll();
      } else if (canManageTitles() && state.translations.length) {
        await Promise.all(state.translations.map((title) => saveTitleToServer(title, false)));
      }
    } catch (error) {
      console.warn("Nie udało się zsynchronizować tytułów:", error);
    }
  }

  async function saveTitleToServer(title, showError = true) {
    if (!hasBackend() || !title) return false;
    try {
      const response = await fetch(apiUrl(`${TITLES_API}/${encodeURIComponent(title.id)}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title })
      });
      if (!response.ok) throw new Error(`title_save_${response.status}`);
      return true;
    } catch (error) {
      if (showError) alert("Nie udało się zapisać tytułu na serwerze.");
      return false;
    }
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
      number: String(chapter.number || "").replace(/^Rozdział\s*/i, "").trim(),
      title: String(chapter.title || "").trim(),
      season: String(chapter.season || ""),
      date: chapter.date || new Date().toISOString(),
      likes: Number(chapter.likes) || 0,
      cover: chapter.cover || title.cover,
      translators: Array.isArray(chapter.translators) ? chapter.translators : title.translators,
      pages: Array.isArray(chapter.pages) && chapter.pages.length ? chapter.pages : [chapter.cover || title.cover]
    };
  }

  async function publishChapterToServer(titleId, chapter) {
    if (!hasBackend()) {
      throw new Error("Brak połączenia z backendem.");
    }

    const title = findTitle(titleId);
    if (!title) throw new Error("Nie znaleziono wybranego tytułu.");

    // Aktualne dane tytułu są wysyłane razem z publikacją.
    // Backend zapisze je przed wysłaniem paneli na Discorda.

    const response = await fetch(apiUrl(CHAPTER_PUBLISH), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        titleId,
        titleName: title.title || "",
        title,
        chapter: normalizeChapter(chapter, title)
      })
    });

    let payload = null;
    try { payload = await response.json(); } catch {}

    if (!response.ok) {
      const message = payload?.error || `chapter_publish_${response.status}`;
      throw new Error(message);
    }

    return payload;
  }

  function renderLatest() {
    const grid = document.querySelector("#latestGrid");
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    const latestTitles = state.translations
      .map((title) => {
        const latestChapter = title.chapters
          .slice()
          .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))[0];

        return {
          title,
          latestDate: latestChapter ? (new Date(latestChapter.date).getTime() || 0) : 0
        };
      })
      .filter((item) => item.latestDate > 0 && now - item.latestDate <= sevenDays)
      .sort((a, b) => b.latestDate - a.latestDate)
      .slice(0, 6);

    if (!latestTitles.length) {
      grid.innerHTML = `<div class="latest-empty">Brak nowych rozdziałów z ostatnich 7 dni.</div>`;
      return;
    }

    grid.innerHTML = latestTitles.map(({ title }) => {
      const chapters = title.chapters
        .slice()
        .sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0))
        .slice(0, 3);

      return `
        <article class="latest-card">
          <button type="button"
                  class="latest-cover-link"
                  data-open-title="${escapeAttr(title.id)}"
                  aria-label="Otwórz ${escapeAttr(title.title)}">
            <img src="${escapeAttr(title.cover)}" alt="">
          </button>

          <div class="latest-card-content">
            <button type="button"
                    class="latest-title-link"
                    data-open-title="${escapeAttr(title.id)}">
              ${escapeHtml(title.title)}
            </button>

            <div class="latest-chapter-list">
              ${chapters.map((chapter) => `
                <button type="button"
                        class="latest-chapter-link"
                        data-open-reader-title="${escapeAttr(title.id)}"
                        data-open-reader-chapter="${escapeAttr(chapter.id)}">
                  <span>${escapeHtml(chapterDisplayName(chapter))} ・ ${escapeHtml(formatDate(chapter.date))}</span>
                </button>
              `).join("")}
            </div>
          </div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-open-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.openTitle));
    });

    grid.querySelectorAll("[data-open-reader-chapter]").forEach((button) => {
      button.addEventListener("click", () => {
        location.hash =
          `#reader/${encodeURIComponent(button.dataset.openReaderTitle)}/${encodeURIComponent(button.dataset.openReaderChapter)}`;
      });
    });
  }

  function renderRandomTitle() {
    const title = findTitle(state.randomTitleId) || pickRandomTitle();
    state.randomTitleId = title.id;
    document.querySelector("#randomTitle").innerHTML = `
      <div class="random-title-heading">
        <span>Losowy tytuł</span>
      </div>
      <img class="random-title-banner" src="${escapeAttr(title.banner)}" alt="">
      <div class="random-title-body">
        <h3>${escapeHtml(title.title)}</h3>
        <p>${escapeHtml(excerptText(title.description, 180))}</p>
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
    document.querySelector("#helperCount").textContent = 0;
    document.querySelector("#seriesCount").textContent = state.translations.length;
    document.querySelector("#chapterCount").textContent = chapters;

    const fallbackMembers = 148 + state.team.length;
    document.querySelector("#discordMembers").textContent = fallbackMembers;

    if (!hasBackend()) return;

    try {
      const params = new URLSearchParams({
        channelId: state.discordSettings.countChannelId || "",
        translatorRoleId: state.discordSettings.translatorRoleId || "",
        helperRoleId: state.discordSettings.helperRoleId || ""
      });
      const response = await fetch(apiUrl(`${DISCORD_STATS}?${params}`), { credentials: "include" });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.members === "number") document.querySelector("#discordMembers").textContent = data.members;
      if (typeof data.translators === "number") document.querySelector("#translatorCount").textContent = data.translators;
      if (typeof data.helpers === "number") document.querySelector("#helperCount").textContent = data.helpers;
    } catch {
      document.querySelector("#discordMembers").textContent = fallbackMembers;
    }
  }

  async function hydrateTranslatorUsers() {
    if (!hasBackend()) return;
    const ids = [...new Set(
      state.translations.flatMap((title) => Array.isArray(title.translators) ? title.translators : [])
    )];
    await Promise.all(ids.map(async (id) => {
      try { await getDiscordUser(id, true); } catch {}
    }));
  }

  async function hydrateTeamUsers() {
    if (!hasBackend()) return;
    const members = [...state.team];
    await Promise.all(members.map(async (member) => {
      if (!member.discordId) return;
      try {
        const user = await getDiscordUser(member.discordId, true);
        if (user?.id) state.users[user.id] = ensureReaderRole(user);
      } catch {
        // Pozostawiamy istniejące dane lokalne, jeśli Discord chwilowo nie odpowiada.
      }
    }));
    persistState();
    renderTeam();
  }

  function renderTeam() {
    document.querySelectorAll("[data-team-tab]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.teamTab === state.activeTeamTab);
    });

    const track = document.querySelector("#teamTrack");
    const members = state.team.filter((member) => member.status === state.activeTeamTab);

    if (!members.length) {
      track.innerHTML = `<div class="team-empty">Brak osób w tej kadrze.</div>`;
    } else {
      if (!state.teamCarouselInitialized) {
        const defaultId = "1206654146955182106";
        const defaultIndex = members.findIndex((member) => member.discordId === defaultId);
        state.teamCarouselIndex = defaultIndex >= 0 ? defaultIndex : 0;
        state.teamCarouselInitialized = true;
      }

      if (state.teamCarouselIndex < 0 || state.teamCarouselIndex >= members.length) {
        state.teamCarouselIndex = 0;
      }

      const index = state.teamCarouselIndex;

      const renderCard = (member) => {
        const user = state.users[member.discordId] || placeholderUser(member.discordId);
        return `
          <article class="team-card">
            <img class="team-avatar" src="${escapeAttr(user.avatar)}" alt="">
            <div class="team-card-copy">
              <button type="button" class="team-profile-name" data-team-profile="${escapeAttr(user.id)}" aria-label="Otwórz profil ${escapeAttr(user.displayName)}">${escapeHtml(user.displayName)}</button>
              <p>${escapeHtml(member.roles.join(", "))}</p>
            </div>
          </article>
        `;
      };

      // We always keep one extra card on each side of the three visible cards.
      // The carousel moves only one card per click. After the animation, the
      // contents are rotated and the track is silently returned to the center.
      const visibleAndClones = [
        members[(index - 1 + members.length) % members.length],
        members[index % members.length],
        members[(index + 1) % members.length],
        members[(index + 2) % members.length],
        members[(index + 3) % members.length]
      ];

      track.innerHTML = `<div class="team-track-inner">${visibleAndClones.map(renderCard).join("")}</div>`;
      track.querySelectorAll("[data-team-profile]").forEach((button) => {
        button.addEventListener("click", () => openUserProfile(button.dataset.teamProfile));
      });

      requestAnimationFrame(() => {
        const inner = track.querySelector(".team-track-inner");
        const firstCard = inner?.querySelector(".team-card");
        if (!inner || !firstCard) return;
        const step = firstCard.offsetWidth + 24;
        inner.style.transition = "none";
        inner.style.transform = `translate3d(${-step}px, 0, 0)`;
      });
    }

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

  function moveTeamCarousel(direction) {
    const track = document.querySelector("#teamTrack");
    const members = state.team.filter((member) => member.status === state.activeTeamTab);
    if (!track || members.length <= 1 || state.teamCarouselMoving) return;

    const inner = track.querySelector(".team-track-inner");
    const firstCard = inner?.querySelector(".team-card");
    if (!inner || !firstCard) return;

    const step = firstCard.offsetWidth + 24;
    const targetX = direction > 0 ? -step * 2 : 0;

    state.teamCarouselMoving = true;
    inner.style.transition = "transform 450ms ease";
    inner.style.transform = `translate3d(${targetX}px, 0, 0)`;

    const finish = () => {
      inner.removeEventListener("transitionend", finish);

      state.teamCarouselIndex =
        (state.teamCarouselIndex + direction + members.length) % members.length;

      // Re-rendering rotates the sequence around the new first member.
      // The track is then positioned in the exact same visual place without
      // any visible jump.
      renderTeam();
      state.teamCarouselMoving = false;
    };

    inner.addEventListener("transitionend", finish, { once: true });
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

    const filtered = state.translations
      .filter((title) => {
        if (query && !title.title.toLowerCase().includes(query)) return false;
        if (type !== "all" && title.type !== type) return false;
        if (status !== "all" && title.status !== status) return false;
        if (genre !== "all" && !title.genres.includes(genre)) return false;
        if (!adult && title.adult) return false;
        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title, "pl", { sensitivity: "base" }));

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

    normalizeTitlePeople(title);
    const loggedUser = currentUser();
    if (loggedUser) state.library = loadUserLibrary(loggedUser.id);
    const inLibrary = state.library.includes(title.id);
    const staff = [
      ["Autor", renderPeopleInline(title.authors)],
      ["Artysta", renderPeopleInline(title.artists)],
      ["Tłumacz", title.translators.map(displayUserName).join(", ") || "Brak"],
      ["Edycja", renderEditorsInline(title.editors)]
    ];
    const canEdit = canManageTitles();
    const canDelete = canDeleteSeries();

    container.innerHTML = `
      <article class="title-detail">
        <section class="title-hero">
          <img class="title-banner" src="${escapeAttr(title.banner)}" alt="">
          <div class="title-main">
            <img class="title-cover" src="${escapeAttr(title.cover)}" alt="">
            <div class="title-copy">
              <h1>${escapeHtml(title.title)}</h1>
              <p class="title-description">${escapeHtml(title.description)}</p>
              <div class="tag-row">
                ${title.genres.map((genre) => `<span class="tag">${escapeHtml(genre)}</span>`).join("")}
                <span class="tag">${escapeHtml(title.type)}</span>
                <span class="tag">${escapeHtml(title.status)}</span>
              </div>
              <div class="title-actions">
                <button class="primary-button icon-text-button" type="button" data-library="${escapeAttr(title.id)}">
                  ${bookmarkIcon()}<span>${inLibrary ? "W bibliotece" : "Dodaj do biblioteki"}</span>
                </button>
                ${canEdit ? `<button class="ghost-button icon-text-button" type="button" data-edit-title="${escapeAttr(title.id)}" aria-expanded="false">
                  ${pencilIcon()}<span>Edytuj tytuł</span>
                </button>` : ""}
                ${canDelete ? `<button class="danger-button icon-text-button" type="button" data-delete-title="${escapeAttr(title.id)}">
                  ${trashIcon()}<span>Usuń tytuł</span>
                </button>` : ""}
              </div>
            </div>
          </div>
        </section>

        ${canEdit ? renderInlineSeriesEditor(title) : ""}

        <div class="title-info-grid">
          <section class="title-info-block">
            <h2>Osoby</h2>
            <div class="staff-list">
              ${staff.map(([label, value]) => `
                <div class="staff-row">
                  <b>${escapeHtml(label)}</b>
                  <span>${value}</span>
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

    const libraryButton = container.querySelector("[data-library]");
    if (libraryButton) libraryButton.addEventListener("click", () => toggleLibrary(title.id));
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
    container.querySelectorAll("[data-chapter-menu]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const id = button.dataset.chapterMenu;
        const panel = container.querySelector(`[data-chapter-menu-panel="${CSS.escape(id)}"]`);
        container.querySelectorAll(".chapter-menu.is-open").forEach((node) => node.classList.remove("is-open"));
        container.querySelectorAll("[data-chapter-menu][aria-expanded=true]").forEach((node) => node.setAttribute("aria-expanded", "false"));
        if (panel) {
          const opening = !panel.classList.contains("is-open");
          panel.classList.toggle("is-open", opening);
          panel.classList.toggle("is-hidden", !opening);
          button.setAttribute("aria-expanded", String(opening));
        }
      });
    });
    container.querySelectorAll("[data-edit-chapter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeChapterMenus(container);
        openChapterEditor(title.id, button.dataset.editChapter);
      });
    });
    container.querySelectorAll("[data-delete-chapter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        closeChapterMenus(container);
        handleDeleteChapter(title.id, button.dataset.deleteChapter);
      });
    });

    const editButton = container.querySelector("[data-edit-title]");
    if (editButton) editButton.addEventListener("click", () => toggleInlineSeriesEditor(title.id));
    const deleteButton = container.querySelector("[data-delete-title]");
    if (deleteButton) deleteButton.addEventListener("click", () => handleDeleteTitleFromDetail(title.id));

    const editor = container.querySelector("#inlineSeriesEditor");
    if (editor) bindInlineSeriesEditor(editor, title);
  }

  function renderInlineSeriesEditor(title) {
    const translatorUsers = getTranslatorPeople();
    const staffUsers = getPeopleForChapterEditor(title);
    const authors = normalizePeople(title.authors);
    const artists = normalizePeople(title.artists);
    const editors = normalizeEditors(title.editors);
    const translatorChecks = translatorUsers.map((user) => `
      <label class="pretty-check">
        <input type="checkbox" data-translator-check value="${escapeAttr(user.id)}" ${title.translators.includes(user.id) ? "checked" : ""}>
        <span class="pretty-check-box"></span>
        <span>${escapeHtml(user.displayName)}</span>
      </label>
    `).join("");

    const editorRoleBlocks = ["Cleaner", "Korektor", "Typesetter"].map((role) => {
      const selected = editors.filter((item) => item.role === role).map((item) => item.userId).filter(Boolean);
      const people = staffUsers.map((user) => `
        <label class="pretty-check editor-person-check">
          <input type="checkbox" data-editor-check="${escapeAttr(role)}" value="${escapeAttr(user.id)}" ${selected.includes(user.id) ? "checked" : ""}>
          <span class="pretty-check-box"></span>
          <span>${escapeHtml(user.displayName)}</span>
        </label>
      `).join("");
      return `
        <details class="editor-picker">
          <summary>${escapeHtml(role)} <span data-editor-summary="${escapeAttr(role)}">${selected.length ? selected.map(displayUserName).join(", ") : "Brak"}</span></summary>
          <div class="editor-picker-list">
            <label class="pretty-check">
              <input type="checkbox" data-editor-none="${escapeAttr(role)}" ${selected.length ? "" : "checked"}>
              <span class="pretty-check-box"></span>
              <span>Brak</span>
            </label>
            ${people}
          </div>
        </details>
      `;
    }).join("");

    return `
      <section class="inline-editor is-hidden" id="inlineSeriesEditor" aria-label="Edycja tytułu">
        <div class="inline-editor-head">
          <div>
            <h2>Edytuj tytuł</h2>
            <p>Edytuj wszystkie informacje o tytule. Zmiany zapisują się po kliknięciu przycisku na dole.</p>
          </div>
          <button class="icon-button" type="button" data-close-editor aria-label="Zamknij edycję">×</button>
        </div>
        <form class="series-editor-form" data-inline-series-form>
          <div class="two-columns">
            <label>
              Tytuł
              <input name="title" value="${escapeAttr(title.title)}" required>
            </label>
            <label>
              ID kanału Discord
              <input name="channelId" value="${escapeAttr(title.channelId || "")}" placeholder="np. 123456789012345678">
            </label>
          </div>
          <label class="checkbox-row editor-adult-check">
            <input name="adult" type="checkbox" ${title.adult ? "checked" : ""}>
            Pokaż jako tytuł 18+
          </label>
          <div class="media-edit-grid">
            <div class="media-editor-card">
              <div class="media-editor-label"><b>Okładka</b><span>3:4</span></div>
              <div class="media-preview cover-preview"><img data-cover-preview src="${escapeAttr(title.cover)}" alt="Podgląd okładki"></div>
              <label class="file-picker">
                <span>Wybierz zdjęcie</span>
                <input name="cover" type="file" accept="image/*">
              </label>
            </div>
            <div class="media-editor-card">
              <div class="media-editor-label"><b>Baner</b><span>16:9</span></div>
              <div class="media-preview banner-preview"><img data-banner-preview src="${escapeAttr(title.banner)}" alt="Podgląd baneru"></div>
              <label class="file-picker">
                <span>Wybierz zdjęcie</span>
                <input name="banner" type="file" accept="image/*">
              </label>
            </div>
          </div>
          <label>
            Opis
            <textarea name="description" rows="6" required>${escapeHtml(title.description)}</textarea>
          </label>
          <div class="two-columns">
            <label>Typ<input name="type" value="${escapeAttr(title.type)}" required></label>
            <label>Status
              <select name="status" required>
                ${["Aktywna", "Zawieszona", "Planowana", "Zakończona", "Porzucona"].map((value) => `<option ${title.status === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
              </select>
            </label>
          </div>
          <label>Gatunki<input name="genres" value="${escapeAttr(title.genres.join(", "))}" placeholder="Romans, Dramat, BL"></label>

          <div class="people-editor-section">
            <div class="editor-section-heading"><h3>Autorzy</h3><button type="button" class="ghost-button" data-add-person="authors">+ Dodaj autora</button></div>
            <div class="people-editor-list" data-people-list="authors">${renderPersonRows(authors, "author")}</div>
          </div>
          <div class="people-editor-section">
            <div class="editor-section-heading"><h3>Artyści</h3><button type="button" class="ghost-button" data-add-person="artists">+ Dodaj artystę</button></div>
            <div class="people-editor-list" data-people-list="artists">${renderPersonRows(artists, "artist")}</div>
          </div>

          <div class="people-editor-section">
            <div class="editor-section-heading"><h3>Tłumacze</h3><span class="editor-help">Wybierz osoby z kadry.</span></div>
            <div class="pretty-check-grid">${translatorChecks || `<span class="editor-help">Brak osób w obecnej kadrze.</span>`}</div>
          </div>

          <div class="people-editor-section">
            <div class="editor-section-heading"><h3>Edycja</h3><span class="editor-help">Dla każdej funkcji wybierz osobę albo „Brak”.</span></div>
            <div class="editor-pickers-grid">${editorRoleBlocks}</div>
          </div>

          <div class="inline-editor-actions">
            <button class="primary-button" type="submit">Zapisz edycję</button>
          </div>
        </form>
      </section>
    `;
  }

  function renderPersonRows(items, type) {
    const safeItems = items.length ? items : [{ name: "", url: "", status: "profile" }];
    return safeItems.map((person, index) => `
      <div class="person-editor-row" data-person-row>
        <input data-person-name value="${escapeAttr(person.name || "")}" placeholder="Nazwa">
        <input data-person-url value="${escapeAttr(person.url || "")}" placeholder="Link do profilu (opcjonalnie)" type="url">
        <select data-person-status>
          <option value="profile" ${person.status !== "unknown" && person.status !== "none" ? "selected" : ""}>Profil</option>
          <option value="none" ${person.status === "none" ? "selected" : ""}>Brak profilu</option>
          <option value="unknown" ${person.status === "unknown" ? "selected" : ""}>Nieznany</option>
        </select>
        <button class="icon-button is-small" type="button" data-remove-person aria-label="Usuń osobę">×</button>
      </div>
    `).join("");
  }

  function bindInlineSeriesEditor(editor, title) {
    editor.querySelector("[data-close-editor]")?.addEventListener("click", () => toggleInlineSeriesEditor(title.id, false));
    editor.querySelectorAll("input[name=cover], input[name=banner]").forEach((input) => {
      input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        try {
          const data = await imageFileToDataUrl(file, input.name === "cover" ? 900 : 1600, input.name === "cover" ? 1200 : 900);
          const preview = editor.querySelector(input.name === "cover" ? "[data-cover-preview]" : "[data-banner-preview]");
          if (preview) preview.src = data;
          input.dataset.previewValue = data;
        } catch (error) {
          alert(error.message || "Nie udało się wczytać obrazu.");
          input.value = "";
        }
      });
    });

    editor.querySelectorAll("[data-add-person]").forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.addPerson;
        const list = editor.querySelector(`[data-people-list="${type}"]`);
        list.insertAdjacentHTML("beforeend", renderPersonRows([{ name: "", url: "", status: "profile" }], type === "authors" ? "author" : "artist"));
      });
    });
    editor.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove-person]");
      if (remove) remove.closest("[data-person-row]")?.remove();
    });

    editor.querySelectorAll("[data-editor-check]").forEach((input) => input.addEventListener("change", () => {
      const role = input.dataset.editorCheck;
      const group = editor.querySelectorAll(`[data-editor-check="${CSS.escape(role)}"]`);
      if (input.checked) {
        group.forEach((other) => { if (other !== input) other.checked = false; });
        const none = editor.querySelector(`[data-editor-none="${CSS.escape(role)}"]`);
        if (none) none.checked = false;
      }
      updateEditorSummary(editor, role);
    }));
    editor.querySelectorAll("[data-editor-none]").forEach((input) => input.addEventListener("change", () => {
      const role = input.dataset.editorNone;
      if (input.checked) editor.querySelectorAll(`[data-editor-check="${CSS.escape(role)}"]`).forEach((other) => { other.checked = false; });
      updateEditorSummary(editor, role);
    }));

    editor.querySelector("[data-inline-series-form]").addEventListener("submit", async (event) => {
      event.preventDefault();
      await saveInlineSeriesEditor(title.id, event.currentTarget, editor);
    });
  }

  function updateEditorSummary(editor, role) {
    const checked = Array.from(editor.querySelectorAll(`[data-editor-check="${CSS.escape(role)}"]:checked`));
    const summary = editor.querySelector(`[data-editor-summary="${CSS.escape(role)}"]`);
    if (summary) summary.textContent = checked.length ? checked.map((input) => displayUserName(input.value)).join(", ") : "Brak";
  }

  function toggleInlineSeriesEditor(titleId, force) {
    const editor = document.querySelector("#inlineSeriesEditor");
    if (!editor) return;
    const shouldOpen = typeof force === "boolean" ? force : editor.classList.contains("is-hidden");
    editor.classList.toggle("is-hidden", !shouldOpen);
    document.body.classList.toggle("modal-open", shouldOpen);
    const button = document.querySelector(`[data-edit-title="${CSS.escape(titleId)}"]`);
    if (button) button.setAttribute("aria-expanded", String(shouldOpen));
  }

  async function saveInlineSeriesEditor(titleId, form, editor) {
    const title = findTitle(titleId);
    if (!title) return;
    const data = new FormData(form);
    title.title = String(data.get("title") || "").trim();
    title.channelId = String(data.get("channelId") || "").trim();
    title.adult = data.get("adult") === "on";
    title.description = String(data.get("description") || "").trim();
    title.type = String(data.get("type") || "").trim();
    title.status = String(data.get("status") || "").trim();
    title.genres = splitList(data.get("genres"));

    const coverInput = form.querySelector("input[name=cover]");
    const bannerInput = form.querySelector("input[name=banner]");
    if (coverInput?.dataset.previewValue) title.cover = coverInput.dataset.previewValue;
    if (bannerInput?.dataset.previewValue) title.banner = bannerInput.dataset.previewValue;

    title.authors = collectPeopleRows(editor.querySelector('[data-people-list="authors"]'));
    title.artists = collectPeopleRows(editor.querySelector('[data-people-list="artists"]'));
    title.translators = Array.from(editor.querySelectorAll("[data-translator-check]:checked")).map((input) => input.value);
    title.editors = collectEditorAssignments(editor);

    normalizeTitlePeople(title);
    persistState();
    await saveTitleToServer(title);
    renderAll();
    renderTitle(title.id);
    const freshEditor = document.querySelector("#inlineSeriesEditor");
    if (freshEditor) toggleInlineSeriesEditor(title.id, false);
    showToast("Wszystkie zmiany zostały zapisane.");
  }

  function collectPeopleRows(list) {
    return Array.from(list?.querySelectorAll("[data-person-row]") || []).map((row) => ({
      name: row.querySelector("[data-person-name]")?.value.trim() || "",
      url: row.querySelector("[data-person-url]")?.value.trim() || "",
      status: row.querySelector("[data-person-status]")?.value || "profile"
    })).filter((person) => person.name || person.status !== "unknown");
  }

  function collectEditorAssignments(editor) {
    return ["Cleaner", "Korektor", "Typesetter"].flatMap((role) => {
      const checked = editor.querySelector(`[data-editor-check="${CSS.escape(role)}"]:checked`);
      return checked ? [{ role, userId: checked.value, name: displayUserName(checked.value) }] : [];
    });
  }

  async function handleDeleteTitleFromDetail(titleId) {
    if (!canDeleteSeries()) return;
    const title = findTitle(titleId);
    if (!title) return;

    document.querySelector("#deleteTitleModal")?.remove();
    const modal = document.createElement("div");
    modal.id = "deleteTitleModal";
    modal.className = "confirm-modal-backdrop";
    modal.innerHTML = `
      <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="deleteTitleHeading">
        <div class="confirm-modal-icon">${trashIcon()}</div>
        <h2 id="deleteTitleHeading">Na pewno chcesz usunąć ten tytuł?</h2>
        <p>„${escapeHtml(title.title)}” zostanie usunięty z listy tytułów.</p>
        <div class="confirm-modal-actions">
          <button type="button" class="ghost-button" data-delete-no>${closeIcon()}<span>Nie</span></button>
          <button type="button" class="danger-button confirm-danger" data-delete-yes>${trashIcon()}<span>Tak</span></button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.classList.add("modal-open");
    bindCustomDatePicker(modal.querySelector("[data-date-picker]"));

    const close = () => {
      modal.remove();
      if (!document.querySelector("#inlineSeriesEditor:not(.is-hidden)")) document.body.classList.remove("modal-open");
    };
    modal.querySelector("[data-delete-no]")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    modal.querySelector("[data-delete-yes]")?.addEventListener("click", async () => {
      state.translations = state.translations.filter((item) => item.id !== titleId);
      state.library = state.library.filter((id) => id !== titleId);
      if (state.randomTitleId === titleId) state.randomTitleId = null;
      close();
      if (hasBackend()) {
        await fetch(apiUrl(`${TITLES_API}/${encodeURIComponent(titleId)}`), { method: "DELETE", credentials: "include" }).catch(() => null);
      }
      persistState();
      renderAll();
      navigate("translations");
    });
  }

  function normalizePeople(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => {
      if (typeof item === "string") {
        const value = item.trim();
        return { name: value, url: "", status: /^(unknown|nieznany)$/i.test(value) ? "unknown" : "profile" };
      }
      return {
        name: String(item?.name || "").trim(),
        url: String(item?.url || "").trim(),
        status: item?.status === "none" || item?.status === "unknown" ? item.status : "profile"
      };
    });
  }

  function normalizeEditors(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => ({
      role: String(item?.role || "").trim(),
      userId: String(item?.userId || "").trim(),
      name: String(item?.name || (item?.userId ? displayUserName(item.userId) : "")).trim()
    })).filter((item) => item.role);
  }

  function normalizeTitlePeople(title) {
    title.authors = normalizePeople(title.authors);
    title.artists = normalizePeople(title.artists);
    title.editors = normalizeEditors(title.editors);
    if (!Array.isArray(title.translators)) title.translators = [];
  }

  function renderPeopleInline(items) {
    const people = normalizePeople(items);
    if (!people.length) return "Brak";
    return people.map((person) => {
      if (person.status === "unknown") return `<span>Nieznany</span>`;
      if (person.status === "none") return `<span>${escapeHtml(person.name || "Brak profilu")}</span>`;
      if (person.url) return `<a class="person-link" href="${escapeAttr(person.url)}" target="_blank" rel="noreferrer">${escapeHtml(person.name || "Profil")}</a>`;
      return `<span>${escapeHtml(person.name || "Nieznany")}</span>`;
    }).join(", ");
  }

  function renderEditorsInline(items) {
    const editors = normalizeEditors(items);
    if (!editors.length) return "Brak";
    return editors.map((editor) => `${escapeHtml(editor.role)}: ${escapeHtml(editor.name || displayUserName(editor.userId))}`).join(", ");
  }

  function getTeamPeople() {
    const ids = [...new Set(state.team.filter((member) => member.status === "current").map((member) => member.discordId))];
    return ids.map((id) => state.users[id] || placeholderUser(id));
  }

  function getTranslatorPeople() {
    const removedTranslatorIds = new Set([
      "100000000000000001", // Flooo
      "100000000000000002", // Katsumi
      "100000000000000003"  // eri — konto z rolą Tłumacz
    ]);
    return Object.values(state.users).filter((user) =>
      Array.isArray(user.roles) &&
      user.roles.includes("Tłumacz") &&
      !removedTranslatorIds.has(String(user.id))
    );
  }

  function getPeopleForTitle(title) {
    return getTranslatorPeople();
  }

  function getPeopleForChapterEditor(title) {
    const ids = new Set();
    state.team
      .filter((member) => member.status === "current")
      .forEach((member) => {
        const user = state.users[member.discordId];
        if (user && user.roles?.some((role) =>
          ["Właściciel", "Współwłaściciel", "Tłumacz", "Pomocnik tłumacza"].includes(role)
        )) ids.add(member.discordId);
      });
    (title.translators || []).forEach((id) => ids.add(id));
    normalizeEditors(title.editors).forEach((editor) => { if (editor.userId) ids.add(editor.userId); });
    return Array.from(ids).map((id) => state.users[id] || placeholderUser(id));
  }

  function chapterDisplayName(chapter) {
    const custom = String(chapter?.title || "").trim();
    if (custom && custom !== "Nowy rozdział" && !/^Tłumaczenie:/i.test(custom)) return custom;
    const number = String(chapter?.number || "").replace(/^Rozdział\s*/i, "").trim();
    return number ? `Rozdział ${number}` : "Rozdział";
  }

  function renderChapterRow(title, chapter) {
    const read = state.readChapters.includes(chapter.id);
    const liked = state.likedChapters.includes(chapter.id);
    const canEdit = canManageChapters();
    return `
      <article class="chapter-card ${read ? "is-read" : ""}" data-chapter-card="${escapeAttr(chapter.id)}">
        <button class="chapter-main-button" type="button" data-open-reader="${escapeAttr(chapter.id)}">
          <span class="chapter-info">
            <h3>${escapeHtml(chapterDisplayName(chapter))}</h3>
            <p>${escapeHtml((chapter.translators || title.translators || []).map(displayUserName).join(", ") || "Brak")}</p>
          </span>
          <span class="chapter-date">${escapeHtml(formatDate(chapter.date))}</span>
        </button>
        <span class="chapter-card-actions">
          <button class="heart-button ${liked ? "is-liked" : ""}" type="button" data-like-chapter="${escapeAttr(chapter.id)}">♥ ${chapter.likes}</button>
          ${canEdit ? `
          <div class="chapter-menu-wrap">
            <button class="chapter-menu-button" type="button" data-chapter-menu="${escapeAttr(chapter.id)}" aria-label="Opcje rozdziału" aria-expanded="false">
              ${dotsIcon()}
            </button>
            <div class="chapter-menu is-hidden" data-chapter-menu-panel="${escapeAttr(chapter.id)}">
              <button type="button" data-edit-chapter="${escapeAttr(chapter.id)}">${pencilIcon()}<span>Edytuj rozdział</span></button>
              <button type="button" data-delete-chapter="${escapeAttr(chapter.id)}">${trashIcon()}<span>Usuń rozdział</span></button>
            </div>
          </div>` : ""}
        </span>
      </article>
    `;
  }

  function closeChapterMenus(container) {
    container?.querySelectorAll(".chapter-menu.is-open").forEach((node) => {
      node.classList.remove("is-open");
      node.classList.add("is-hidden");
    });
    container?.querySelectorAll("[data-chapter-menu][aria-expanded=true]").forEach((node) => node.setAttribute("aria-expanded", "false"));
  }

  function renderCustomDatePicker(value) {
    const iso = String(value || "").slice(0, 10);
    const display = iso ? formatPrettyDate(iso) : "";
    return `
      <div class="custom-date-picker" data-date-picker data-value="${escapeAttr(iso)}">
        <input class="pretty-date-display" type="text" value="${escapeAttr(display)}" placeholder="Wybierz datę" readonly aria-label="Data">
        <input type="hidden" name="date" data-date-value value="${escapeAttr(iso)}">
        <button type="button" class="date-picker-toggle" data-date-toggle aria-label="Wybierz datę">${calendarIcon()}</button>
        <div class="custom-calendar is-hidden" data-calendar></div>
      </div>`;
  }

  function formatPrettyDate(iso) {
    const parts = String(iso || "").split("-");
    return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : "";
  }

  function bindCustomDatePicker(picker) {
    if (!picker) return;
    const display = picker.querySelector("[data-date-display]") || picker.querySelector(".pretty-date-display");
    const hidden = picker.querySelector("[data-date-value]");
    const toggle = picker.querySelector("[data-date-toggle]");
    const calendar = picker.querySelector("[data-calendar]");
    let selected = hidden.value || "";
    let cursor = selected ? new Date(`${selected}T12:00:00`) : new Date();
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), 1);

    const monthNames = ["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień"];
    const dayNames = ["pon","wt","śr","czw","pt","sob","nie"];

    function renderCalendar() {
      const year = cursor.getFullYear();
      const month = cursor.getMonth();
      const first = new Date(year, month, 1);
      const start = (first.getDay() + 6) % 7;
      const days = new Date(year, month + 1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();

      let cells = "";
      for (let i = 0; i < start; i++) {
        const day = prevDays - start + i + 1;
        cells += `<button type="button" class="calendar-day is-muted" data-calendar-day="${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}">${day}</button>`;
      }
      for (let day = 1; day <= days; day++) {
        const iso = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const cls = `${iso === selected ? " is-selected" : ""}${iso === new Date().toISOString().slice(0,10) ? " is-today" : ""}`;
        cells += `<button type="button" class="calendar-day${cls}" data-calendar-day="${iso}">${day}</button>`;
      }
      const total = Math.ceil((start + days) / 7) * 7;
      for (let i = start + days, day = 1; i < total; i++, day++) {
        cells += `<button type="button" class="calendar-day is-muted" data-calendar-day="${year}-${String(month + 2).padStart(2,"0")}-${String(day).padStart(2,"0")}">${day}</button>`;
      }

      calendar.innerHTML = `
        <div class="custom-calendar-head">
          <button type="button" data-calendar-prev aria-label="Poprzedni miesiąc">‹</button>
          <strong>${monthNames[month]} ${year}</strong>
          <button type="button" data-calendar-next aria-label="Następny miesiąc">›</button>
        </div>
        <div class="custom-calendar-week">${dayNames.map((day) => `<span>${day}</span>`).join("")}</div>
        <div class="custom-calendar-grid">${cells}</div>
        <div class="custom-calendar-foot">
          <button type="button" data-calendar-clear>Wyczyść</button>
          <button type="button" data-calendar-today>Dzisiaj</button>
        </div>`;
    }

    const setDate = (iso) => {
      selected = iso || "";
      hidden.value = selected;
      display.value = formatPrettyDate(selected);
      picker.dataset.value = selected;
      renderCalendar();
    };

    const positionCalendar = () => {
      const rect = picker.getBoundingClientRect();
      const calendarWidth = Math.min(320, window.innerWidth - 32);
      const left = Math.max(16, Math.min(rect.left, window.innerWidth - calendarWidth - 16));
      const estimatedHeight = 390;
      const top = rect.bottom + 8 + estimatedHeight <= window.innerHeight
        ? rect.bottom + 8
        : Math.max(16, rect.top - estimatedHeight - 8);
      calendar.style.left = `${left}px`;
      calendar.style.top = `${top}px`;
      calendar.style.width = `${calendarWidth}px`;
    };

    const openCalendar = (event) => {
      event.stopPropagation();
      calendar.classList.toggle("is-hidden");
      if (!calendar.classList.contains("is-hidden")) {
        renderCalendar();
        positionCalendar();
      }
    };
    toggle.addEventListener("click", openCalendar);
    display.addEventListener("click", openCalendar);

    calendar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-calendar-day]");
      if (button) {
        const iso = button.dataset.calendarDay;
        const date = new Date(`${iso}T12:00:00`);
        if (date.getMonth() !== cursor.getMonth()) {
          cursor = new Date(date.getFullYear(), date.getMonth(), 1);
        }
        setDate(iso);
        calendar.classList.add("is-hidden");
        return;
      }
      if (event.target.closest("[data-calendar-prev]")) {
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
        renderCalendar();
      }
      if (event.target.closest("[data-calendar-next]")) {
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
        renderCalendar();
      }
      if (event.target.closest("[data-calendar-clear]")) setDate("");
      if (event.target.closest("[data-calendar-today]")) {
        const today = new Date().toISOString().slice(0,10);
        cursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        setDate(today);
        calendar.classList.add("is-hidden");
      }
    });

    document.addEventListener("click", (event) => {
      if (!picker.contains(event.target)) calendar.classList.add("is-hidden");
    }, { once: false });
  }

  function openChapterEditor(titleId, chapterId) {
    const title = findTitle(titleId);
    const chapter = title?.chapters.find((item) => item.id === chapterId);
    if (!title || !chapter) return;

    document.querySelector("#chapterEditModal")?.remove();
    const modal = document.createElement("div");
    modal.id = "chapterEditModal";
    modal.className = "confirm-modal-backdrop";
    modal.innerHTML = `
      <div class="confirm-modal chapter-edit-modal" role="dialog" aria-modal="true" aria-labelledby="chapterEditHeading">
        <div class="confirm-modal-icon">${pencilIcon()}</div>
        <h2 id="chapterEditHeading">Edytuj rozdział</h2>
        <form id="chapterEditForm" class="chapter-edit-form">
          <label>
            Nazwa rozdziału
            <input name="title" type="text" value="${escapeAttr(
              chapter.title &&
              chapter.title !== "Nowy rozdział" &&
              !/^Tłumaczenie:/i.test(chapter.title)
                ? chapter.title
                : ""
            )}" placeholder="np. Side Story">
          </label>
          <div class="chapter-edit-two-columns">
            <label>
              Numer rozdziału
              <input name="number" type="number" min="0" step="1" inputmode="numeric" value="${escapeAttr(String(chapter.number ?? "").replace(/^Rozdział\s*/i, "").trim())}" required>
            </label>
            <label>
              Numer sezonu
              <input name="season" type="number" min="0" step="1" inputmode="numeric" value="${escapeAttr(chapter.season || "")}">
            </label>
          </div>
          <label>
            Data
            ${renderCustomDatePicker(chapter.date)}
          </label>
          <fieldset class="chapter-translator-fieldset">
            <legend>Tłumacz</legend>
            <div class="pretty-check-grid chapter-translator-checks">
              ${getTranslatorPeople().map((user) => `
                <label class="pretty-check">
                  <input type="checkbox" name="translators" value="${escapeAttr(user.id)}" ${(chapter.translators || []).includes(user.id) ? "checked" : ""}>
                  <span class="pretty-check-box">${checkIcon()}</span>
                  <span>${escapeHtml(user.displayName)}</span>
                </label>
              `).join("") || `<span class="editor-help">Brak osób w obecnej kadrze.</span>`}
            </div>
          </fieldset>
        </form>
        <div class="confirm-modal-actions chapter-edit-actions">
          <button type="button" class="ghost-button" data-chapter-edit-cancel>${closeIcon()}<span>Anuluj</span></button>
          <button type="submit" form="chapterEditForm" class="primary-button">${saveIcon()}<span>Zapisz edycję</span></button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.classList.add("modal-open");

    const close = () => {
      modal.remove();
      if (!document.querySelector("#inlineSeriesEditor:not(.is-hidden)")) document.body.classList.remove("modal-open");
    };
    modal.querySelector("[data-chapter-edit-cancel]")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    modal.querySelector("#chapterEditForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const updated = {
        ...chapter,
        number: String(data.get("number") || "").trim(),
        title: String(data.get("title") || "").trim(),
        season: String(data.get("season") || "").trim(),
        date: data.get("date") ? `${data.get("date")}T00:00:00.000Z` : chapter.date,
        translators: Array.from(form.querySelectorAll("[name=translators]:checked")).map((input) => input.value)
      };
      try {
        const response = await fetch(apiUrl(`/api/chapters/${encodeURIComponent(chapter.id)}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ titleId, chapter: updated })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `chapter_edit_${response.status}`);
        const index = title.chapters.findIndex((item) => item.id === chapter.id);
        if (index >= 0) title.chapters[index] = normalizeChapter(payload.chapter || updated, title);
        persistState();
        close();
        renderTitle(title.id);
        renderLatest();
        showToast("Zmiany rozdziału zostały zapisane.");
      } catch (error) {
        alert(`Nie udało się edytować rozdziału.\\n\\n${error.message || "Nieznany błąd."}`);
      }
    });
  }

  async function handleDeleteChapter(titleId, chapterId) {
    if (!canManageChapters()) return;
    const title = findTitle(titleId);
    const chapter = title?.chapters.find((item) => item.id === chapterId);
    if (!title || !chapter) return;

    document.querySelector("#deleteChapterModal")?.remove();
    const modal = document.createElement("div");
    modal.id = "deleteChapterModal";
    modal.className = "confirm-modal-backdrop";
    modal.innerHTML = `
      <div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="deleteChapterHeading">
        <div class="confirm-modal-icon">${trashIcon()}</div>
        <h2 id="deleteChapterHeading">Na pewno chcesz usunąć ten rozdział?</h2>
        <p>„${escapeHtml(chapterDisplayName(chapter))}” zostanie usunięty ze strony.</p>
        <div class="confirm-modal-actions">
          <button type="button" class="ghost-button" data-delete-chapter-no>${closeIcon()}<span>Nie</span></button>
          <button type="button" class="danger-button confirm-danger" data-delete-chapter-yes>${trashIcon()}<span>Tak</span></button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.classList.add("modal-open");
    const close = () => {
      modal.remove();
      if (!document.querySelector("#inlineSeriesEditor:not(.is-hidden)")) document.body.classList.remove("modal-open");
    };
    modal.querySelector("[data-delete-chapter-no]")?.addEventListener("click", close);
    modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
    modal.querySelector("[data-delete-chapter-yes]")?.addEventListener("click", async () => {
      try {
        const response = await fetch(apiUrl(`/api/chapters/${encodeURIComponent(chapterId)}`), {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titleId })
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || `chapter_delete_${response.status}`);
        title.chapters = title.chapters.filter((item) => item.id !== chapterId);
        state.readChapters = state.readChapters.filter((id) => id !== chapterId);
        state.likedChapters = state.likedChapters.filter((id) => id !== chapterId);
        persistState();
        close();
        renderTitle(title.id);
        renderLatest();
        renderCounters();
        showToast("Rozdział został usunięty ze strony.");
      } catch (error) {
        alert(`Nie udało się usunąć rozdziału.\\n\\n${error.message || "Nieznany błąd."}`);
      }
    });
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
            <h1>${escapeHtml(chapterDisplayName(chapter))}</h1>
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

  function libraryStorageKey(userId) {
    return `BUNBUN_LIBRARY_${String(userId)}`;
  }

  function loadUserLibrary(userId) {
    try {
      const value = JSON.parse(localStorage.getItem(libraryStorageKey(userId)) || "[]");
      return Array.isArray(value) ? value.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  function saveUserLibrary(userId, library) {
    try {
      localStorage.setItem(libraryStorageKey(userId), JSON.stringify([...new Set(library)]));
    } catch {}
  }

  function renderLibrary() {
    const container = document.querySelector("#libraryDetail");
    if (!container) return;
    const user = currentUser();
    if (!user) {
      container.innerHTML = `<div class="library-login-message">Zaloguj się, aby zobaczyć swoją biblioteczkę.</div>`;
      return;
    }

    state.library = loadUserLibrary(user.id);
    const titles = state.library.map(findTitle).filter(Boolean);
    container.innerHTML = `
      <div class="team-title home-section-title library-page-heading">
        <span></span>
        <h2>Biblioteczka</h2>
        <span></span>
      </div>
      <div class="library-grid translated-title-grid">
        ${titles.length ? titles.map((title) => `
          <button class="library-item" type="button" data-library-title="${escapeAttr(title.id)}">
            <img class="library-cover" src="${escapeAttr(title.cover)}" alt="">
            <h3>${escapeHtml(title.title)}</h3>
          </button>
        `).join("") : `<p class="library-empty">Nie masz jeszcze tytułów w biblioteczce.</p>`}
      </div>
    `;
    container.querySelectorAll("[data-library-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.libraryTitle));
    });
  }

  async function openUserProfile(userId) {
    if (!userId) return;
    state.profileViewingUserId = String(userId);
    navigate("profile");

    if (hasBackend()) {
      try {
        await getDiscordUser(String(userId), true);
      } catch {}
    }

    renderProfile();
  }

  function renderProfile() {
    const container = document.querySelector("#profileDetail");
    const user = state.profileViewingUserId
      ? (state.users[state.profileViewingUserId] || placeholderUser(state.profileViewingUserId))
      : currentUser();
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

    const translated = user.roles.includes("Tłumacz")
      ? state.translations.filter((title) => title.translators.includes(user.id))
      : [];

    container.innerHTML = `
      <article class="profile-shell">
        <div class="profile-banner ${user.banner || user.bannerUrl ? "" : "has-color-banner"}"
             ${!user.banner && !user.bannerUrl ? `style="--discord-banner-color:${escapeAttr(user.bannerColor || "#ffd0e9")}"` : ""}>
          ${user.banner || user.bannerUrl
            ? `<img src="${escapeAttr(user.banner || user.bannerUrl)}" alt="">`
            : `<span aria-hidden="true"></span>`}
        </div>
        <div class="profile-body">
          <div class="profile-header-row">
            <img class="profile-avatar" src="${escapeAttr(user.avatar)}" alt="">
            <div class="profile-names">
              <h1>${escapeHtml(user.displayName)}</h1>
              <p>@${escapeHtml(user.username)}</p>
              <div class="tag-row">${user.roles.map((role) => `<span class="tag">${escapeHtml(role)}</span>`).join("")}</div>
            </div>
          </div>
        </div>
      </article>

      ${translated.length ? `
        <section class="profile-translated-section">
          <div class="team-title home-section-title">
            <span></span>
            <h2>Tłumaczone tytuły</h2>
            <span></span>
          </div>
          <div class="library-grid translated-title-grid">
            ${translated.map((title) => `
              <button class="library-item" type="button" data-profile-title="${escapeAttr(title.id)}">
                <img class="library-cover" src="${escapeAttr(title.cover)}" alt="">
                <h3>${escapeHtml(title.title)}</h3>
              </button>
            `).join("")}
          </div>
        </section>
      ` : ""}
    `;
    container.querySelectorAll("[data-profile-title]").forEach((button) => {
      button.addEventListener("click", () => openTitle(button.dataset.profileTitle));
    });
  }

  function renderData() {
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
      adult: Boolean(document.querySelector("#newTitleAdult")?.checked),
      channelId: document.querySelector("#newTitleChannelId")?.value.trim() || "",
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
    await saveTitleToServer(newTitle);
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

    const form = event.currentTarget;
    const title = findTitle(document.querySelector("#chapterTitleSelect").value);
    if (!title) {
      alert("Nie wybrano tytułu. Jeśli lista jest pusta, odśwież stronę po zapisaniu tytułu.");
      return;
    }

    if (!state.uploadedPages.length) {
      alert("Dodaj co najmniej jeden panel rozdziału.");
      return;
    }

    const number = document.querySelector("#chapterNumber").value.trim();
    if (!number) {
      alert("Wpisz numer rozdziału.");
      return;
    }

    const selectedTranslators = selectedValues(document.querySelector("#chapterTranslatorSelect"));
    const pages = await Promise.all(state.uploadedPages.map((page) => fileToDataUrl(page.file)));

    const chapter = {
      id: `${title.id}-chapter-${slugify(number)}-${Date.now()}`,
      number,
      title: "",
      season: document.querySelector("#chapterSeason").value.trim(),
      date: document.querySelector("#chapterDate").value || new Date().toISOString(),
      likes: 0,
      cover: title.cover,
      translators: selectedTranslators,
      pages
    };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent || "Dodaj rozdział";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Publikowanie…";
    }

    try {
      await publishChapterToServer(title.id, chapter);

      // Dopiero po potwierdzeniu backendu dodajemy rozdział lokalnie.
      title.chapters.push(chapter);
      state.uploadedPages = [];
      form.reset();
      renderUploadList();
      persistState();
      renderAll();
      openTitle(title.id);
      alert("Rozdział został wysłany na kanał Discorda. Nagłówek został przypięty, a panele są wyświetlane na stronie bezpośrednio z Discorda.");
    } catch (error) {
      console.error("Publikowanie rozdziału nie powiodło się:", error);
      const reason = String(error?.message || "Nieznany błąd.");
      const messages = {
        not_logged_in: "Sesja logowania wygasła. Zaloguj się ponownie.",
        insufficient_site_role: "Nie masz uprawnień do publikowania rozdziałów.",
        not_assigned_to_title: "Nie jesteś przypisany do tego tytułu.",
        title_not_found: "Tytuł nie został jeszcze zapisany na backendzie.",
        title_channel_id_missing: "Ten tytuł nie ma ustawionego ID kanału Discord. Uzupełnij je w „Edytuj tytuł”.",
        title_channel_not_found_or_not_text: "Nie znaleziono kanału rozdziałów albo bot nie ma do niego dostępu.",
        discord_not_configured: "Bot Discord nie jest poprawnie skonfigurowany.",
        chapter_upload_failed: "Nie udało się zapisać paneli rozdziału."
      };
      alert(`Nie udało się dodać rozdziału.\n\n${messages[reason] || reason}`);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  }

  function handleSaveData(event) {
    event.preventDefault();
    state.discordSettings.clientId = document.querySelector("#discordClientId").value.trim();
    state.discordSettings.redirectUri = document.querySelector("#discordRedirectUri").value.trim();
    state.discordSettings.countChannelId = document.querySelector("#discordCountChannelId").value.trim();
    state.discordSettings.translatorRoleId = document.querySelector("#discordTranslatorRoleId").value.trim();
    state.discordSettings.helperRoleId = document.querySelector("#discordHelperRoleId").value.trim();
    persistState();
    renderCounters();
  }

  function hydrateConfigForm() {
    document.querySelector("#discordClientId").value = state.discordSettings.clientId || "";
    document.querySelector("#discordRedirectUri").value = state.discordSettings.redirectUri || "";
    document.querySelector("#discordCountChannelId").value = state.discordSettings.countChannelId || "";
    document.querySelector("#discordTranslatorRoleId").value = state.discordSettings.translatorRoleId || "";
    document.querySelector("#discordHelperRoleId").value = state.discordSettings.helperRoleId || "";
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

  function toggleLibrary(titleId) {
    const user = currentUser();
    if (!user) {
      loginAs("100000000000000001");
      return;
    }
    state.library = loadUserLibrary(user.id);
    state.library = state.library.includes(titleId)
      ? state.library.filter((id) => id !== titleId)
      : [...state.library, titleId];
    saveUserLibrary(user.id, state.library);
    renderTitle(titleId);
    renderLibrary();
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
    return hasAnyRole(["Właściciel", "Współwłaściciel"]);
  }

  function canDeleteSeries() {
    return hasAnyRole(["Właściciel", "Współwłaściciel"]);
  }

  function canManageChapters() {
    return hasAnyRole(["Właściciel", "Współwłaściciel", "Tłumacz"]);
  }

  function canManageData() {
    return hasAnyRole(["Właściciel", "Współwłaściciel"]);
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

  async function getDiscordUser(discordId, force = false) {
    if (state.users[discordId] && !force) return state.users[discordId];
    if (hasBackend()) {
      try {
        const response = await fetch(apiUrl(`${DISCORD_USER}${encodeURIComponent(discordId)}`), { credentials: "include" });
        if (response.ok) {
          const user = ensureReaderRole(await response.json());
          if (user?.id) state.users[user.id] = user;
          return user;
        }
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
    const order = ["Właściciel", "Współwłaściciel", "Tłumacz", "Pomocnik tłumacza", "Czytelnik"];
    const sourceRoles = Array.isArray(next.roles) ? next.roles : [];
    next.roles = order.filter((role) =>
      role === "Czytelnik" || sourceRoles.includes(role)
    );
    next.avatar = next.avatar || avatarSvg(initialsFor(next.displayName || next.username || "?"), "#ffe1f0", "#9d3c72");
    // Do NOT create a fake banner when Discord returned null.
    // A real user's banner can legitimately be null; renderProfile() then
    // uses bannerColor as the background.
    if (!Object.prototype.hasOwnProperty.call(next, "banner")) {
      next.banner = null;
    }
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
      merged.translations = Array.isArray(merged.translations) ? merged.translations : [];
      merged.translations.forEach((title) => {
        normalizeTitlePeople(title);
        if (title.id === "unsleep" && title.banner === title.cover) {
          title.banner = bannerSvg("#ffd0e9", "#f391ca", "Unsleep");
        }
      });
      return merged;
    } catch {
      return clone(seedState);
    }
  }

  function persistState() {
    const safe = clone(state);
    safe.uploadedPages = [];

    // Nie zapisujemy ciężkich obrazów jako data:image/... w localStorage.
    // Okładki/banery są przechowywane na backendzie, a panele rozdziałów
    // po publikacji pochodzą bezpośrednio z Discord CDN. Trzymanie ich
    // dodatkowo w przeglądarce szybko przekracza limit Storage.
    if (Array.isArray(safe.translations)) {
      safe.translations = safe.translations.map((title) => {
        const next = { ...title };

        if (typeof next.cover === "string" && next.cover.startsWith("data:")) {
          next.cover = "";
        }
        if (typeof next.banner === "string" && next.banner.startsWith("data:")) {
          next.banner = "";
        }

        if (Array.isArray(next.chapters)) {
          next.chapters = next.chapters.map((chapter) => {
            const c = { ...chapter };

            if (typeof c.cover === "string" && c.cover.startsWith("data:")) {
              c.cover = "";
            }

            if (Array.isArray(c.pages)) {
              c.pages = c.pages.filter((page) =>
                typeof page === "string" && !page.startsWith("data:")
              );
            }

            return c;
          });
        }

        return next;
      });
    }

    const serialized = JSON.stringify(safe);

    try {
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      // Storage jest tylko lokalnym cachem. Jego przekroczenie nie może
      // anulować poprawnie wykonanego zapisu na backendzie/Discordzie.
      if (error?.name === "QuotaExceededError" || String(error).includes("quota")) {
        try {
          localStorage.removeItem(STORAGE_KEY);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            currentUser: safe.currentUser,
            users: safe.users,
            discordSettings: safe.discordSettings,
            translations: []
          }));
        } catch {
          // Ignorujemy brak miejsca w Storage — dane główne są na backendzie.
        }
        console.warn("Pominięto część lokalnego cache z powodu limitu Storage.");
      } else {
        console.warn("Nie udało się zapisać lokalnego cache:", error);
      }
    }
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
      channelId: String(options.channelId || ""),
      cover,
      banner: options.banner || bannerSvg("#ffd1e8", "#ffa6d8", options.title),
      description: options.description || "Opis serii pojawi się tutaj po uzupełnieniu panelu dodawania lub edycji.",
      authors: normalizePeople(options.authors || ["Nieznany"]),
      artists: normalizePeople(options.artists || ["Brak profilu"]),
      translators: options.translators || ["100000000000000001"],
      editors: normalizeEditors(options.editors || [{ role: "Korektor", name: "BunBun" }]),
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

  function imageFileToDataUrl(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error("Wybierz prawidłowy plik graficzny."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Nie udało się odczytać obrazu."));
      reader.onload = () => {
        const image = new Image();
        image.onerror = () => reject(new Error("Nie udało się wczytać obrazu."));
        image.onload = () => {
          const ratio = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.86));
        };
        image.src = reader.result;
      };
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

  function showToast(message) {
    let toast = document.querySelector("#bunbunToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "bunbunToast";
      toast.className = "bunbun-toast";
      toast.innerHTML = `<span class="toast-icon">${saveIcon()}</span><span data-toast-text></span>`;
      document.body.appendChild(toast);
    }
    toast.querySelector("[data-toast-text]").textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }

  function excerptText(value, maxLength = 180) {
    const text = String(value || "").replace(/\\s+/g, " ").trim();
    if (text.length <= maxLength) return text;
    const cut = text.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(" ");
    return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
  }

  function dotsIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>`;
  }

  function saveIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h11l3 3V20.5H5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 3.5v6h7v-6M8.5 20.5v-6h7v6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  function bookmarkIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.8L6 21z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  }

  function calendarIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 3.5v4M17 3.5v4M3.5 10h17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  }

  function checkIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12.5 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function pencilIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16.8V20h3.2L18.9 8.3l-3.2-3.2L4 16.8Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="m14.6 6.9 2.5-2.5a1.8 1.8 0 0 1 2.5 0l.5.5a1.8 1.8 0 0 1 0 2.5l-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  }

  function closeIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  }

  function trashIcon() {
    return `<svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M9 7V4h6v3m-8 0 1 13h6l1-13M10 10v7m4-7v7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
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
