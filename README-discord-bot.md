# BunBun Translations — bot + strona

W tej wersji bot Discord jest zintegrowany z backendem strony. Nie trzeba uruchamiać osobnego procesu dla samego bota: `server.js` uruchamia `discord.js`, obsługuje OAuth i API strony.

## Co robi bot

- wysyła nowe rozdziały do kanału przypisanego do tytułu,
- po wysłaniu odczytuje wiadomość i wszystkie załączone panele,
- pobiera panele z Discorda i zapisuje je w `assets/chapters/<tytuł>/<rozdział>/`,
- zapisuje rozdział do `data/chapters.json`, skąd strona pobiera go przez `/api/chapters`,
- odczytuje liczbę osób z nazwy wskazanego kanału,
- liczy osoby posiadające rolę Tłumacz,
- po logowaniu przez Discord pobiera aktualną nazwę użytkownika, avatar, banner i role,
- dla członków kadry pobiera te same dane bez potrzeby ręcznego wpisywania avatara lub bannera.

## Jak działa dodawanie rozdziału

1. Administrator lub przypisany tłumacz otwiera `Dodaj nowy rozdział`.
2. Wybiera tytuł, numer rozdziału, tłumaczy i panele.
3. Strona wysyła dane do backendu.
4. Backend pobiera ID kanału z konfiguracji tytułu.
5. Bot wysyła do tego kanału wiadomość zawierającą informacje o rozdziale oraz wszystkie panele jako załączniki.
6. Bot nasłuchuje swojej wiadomości `BUNBUN_CHAPTER ...`, pobiera załączniki z Discorda i zapisuje je lokalnie.
7. Rozdział pojawia się na stronie przez `/api/chapters`.

Dzięki temu Discord jest faktycznym miejscem publikacji, a strona jest zasilana z wiadomości wysłanej przez bota.

## Konfiguracja tytułu

Każdy tytuł ma pole `channelId`. To ID kanału, do którego bot ma wysyłać rozdziały tego tytułu. Pole można uzupełnić w `Edytuj tytuł`.

## Role i uprawnienia

Backend sprawdza role Discorda po stronie serwera:

- `Właściciel` / `Współwłaściciel` / `Administrator` — mogą zarządzać tytułami i publikować rozdziały,
- `Tłumacz` — może publikować rozdział tylko do tytułu, w którym znajduje się jego Discord ID na liście tłumaczy.

Nazwy ról mogą być zmienione bez przebudowy kodu tylko wtedy, gdy zachowasz te nazwy. Jeśli chcesz używać ID ról zamiast nazw, można to później przenieść do `.env`.

## Liczniki

`DISCORD_COUNT_CHANNEL_ID` wskazuje kanał, którego nazwa zawiera liczbę osób, np. `👥・1234`. Backend odczytuje pierwszą liczbę z nazwy.

`DISCORD_TRANSLATOR_ROLE_ID` wskazuje rolę Tłumacz. Backend pobiera członków serwera i liczy osoby posiadające tę rolę.

## OAuth Discord

W Discord Developer Portal ustaw redirect:

`http://localhost:3000/api/auth/discord/callback`

lub odpowiedni adres produkcyjny.

Zakres OAuth to `identify`, a dane profilu są dodatkowo odświeżane przez bota z serwera Discord.

## Instalacja

```bash
npm install
npm start
```

Przed uruchomieniem uzupełnij `.env` na podstawie `.env.example`.

Bot potrzebuje co najmniej dostępu do serwera, kanałów, wysyłania wiadomości, załączników oraz `Server Members Intent`.

## Ważne — tokeny

Nie umieszczaj tokenu bota ani Client Secret w frontendzie, GitHubie ani ZIP-ie przeznaczonym do publikacji. Jeśli token znalazł się w starym pliku `.env`, należy go **unieważnić i wygenerować nowy** w Discord Developer Portal.
