# Testy: GitHub Pages + lokalny bot/backend

## Architektura

GitHub Pages -> HTTPS tunnel -> lokalny `server.js` -> Discord

GitHub Pages hostuje frontend. Lokalny `server.js` obsługuje API, OAuth, sesję i bota Discord.

## 1. Przygotuj Discord Developer Portal

1. Otwórz aplikację bota.
2. Skopiuj:
   - Application ID -> `DISCORD_CLIENT_ID`
   - Client Secret -> `DISCORD_CLIENT_SECRET`
   - Bot Token -> `DISCORD_BOT_TOKEN`
3. W OAuth2 -> Redirects dodaj dokładnie:
   `https://TWOJ-TUNNEL-URL/api/auth/discord/callback`
4. W zakładce Bot włącz `Server Members Intent`.
5. Bot musi być na Twoim serwerze i mieć dostęp do kanałów, wysyłania wiadomości oraz załączników.

## 2. Wrzuć stronę na GitHub Pages

1. Utwórz repozytorium.
2. Wrzuć pliki strony.
3. Włącz GitHub Pages dla wybranej gałęzi/folderu.
4. Skopiuj dokładny adres strony, np.:
   `https://twoj-login.github.io/bunbun-translations`
5. Otwórz `site-config.js` i ustaw:
   `window.BUNBUN_API_BASE = "https://TWOJ-TUNNEL-URL";`
6. Zrób commit/push i poczekaj na wdrożenie.

## 3. Uruchom backend i bota lokalnie

W folderze z `server.js`:

```bash
npm install
```

Utwórz `.env` na podstawie `.env.example` i wpisz:
- token bota,
- Client ID,
- Client Secret,
- Guild ID,
- ID kanału z licznikiem,
- ID roli Tłumacz,
- adres GitHub Pages jako `PUBLIC_SITE_URL`,
- publiczny adres tunelu jako `DISCORD_REDIRECT_URI`.

Następnie:

```bash
npm start
```

Powinieneś zobaczyć informację o zalogowaniu bota.

## 4. Udostępnij lokalny port przez HTTPS

Do testów najłatwiej użyć Cloudflare Tunnel albo ngrok.

Przykład z Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:3000
```

Dostaniesz adres podobny do:
`https://losowy-adres.trycloudflare.com`

Wtedy:
- `site-config.js` -> ten adres jako `BUNBUN_API_BASE`
- `.env` -> `DISCORD_REDIRECT_URI=https://losowy-adres.trycloudflare.com/api/auth/discord/callback`
- Discord Developer Portal -> ten sam redirect.

Po zmianie `site-config.js` wypchnij ponownie stronę na GitHub Pages.

## 5. Test logowania

Wejdź na stronę GitHub Pages i kliknij logowanie przez Discord.

Przepływ powinien być:

GitHub Pages
-> tunnel
-> `/api/auth/discord/start`
-> Discord
-> `/api/auth/discord/callback`
-> tunnel
-> powrót na GitHub Pages.

## 6. Test dodawania rozdziału

1. W „Edytuj tytuł” wpisz ID kanału Discord tego tytułu.
2. Zaloguj się użytkownikiem, który ma rolę Tłumacz i jest przypisany do tytułu.
3. Otwórz „Dodaj nowy rozdział”.
4. Wybierz tytuł.
5. Wpisz numer rozdziału.
6. Wybierz tłumaczy.
7. Dodaj panele.
8. Opublikuj.
9. Backend wyśle wiadomość do kanału Discord.
10. Bot odczyta własną wiadomość i załączniki.
11. Panele zostaną zapisane.
12. `/api/chapters` zwróci nowy rozdział.
13. Strona powinna go wyświetlić.

## 7. Jeśli tunnel dostanie nowy adres

Darmowy tymczasowy adres tunelu może się zmienić po ponownym uruchomieniu.

Wtedy trzeba zaktualizować w trzech miejscach:
1. `site-config.js`
2. `.env` -> `DISCORD_REDIRECT_URI`
3. Discord Developer Portal -> OAuth2 -> Redirects

Następnie ponownie wdrożyć stronę na GitHub Pages.

## 8. Najczęstsze problemy

### CORS
Jeżeli przeglądarka zgłasza CORS, sprawdź, czy:
`PUBLIC_SITE_URL`
jest dokładnie tym samym originem co GitHub Pages.

Nie dodawaj końcowego `/`.

Dobrze:
`https://twoj-login.github.io/bunbun-translations`

Źle:
`https://twoj-login.github.io/bunbun-translations/`

### OAuth redirect mismatch
Adres w Discord Developer Portal musi być identyczny z:
`DISCORD_REDIRECT_URI`

### 401 not_logged_in
Sprawdź, czy:
- backend działa przez HTTPS tunnel,
- cookie sesji ma `Secure`,
- frontend używa `credentials: include`,
- `PUBLIC_SITE_URL` jest ustawione na GitHub Pages.

### Bot nie wysyła rozdziału
Sprawdź:
- token,
- Guild ID,
- ID kanału tytułu,
- uprawnienia bota do kanału,
- czy zalogowany użytkownik ma odpowiednią rolę.

## Ważne

Nigdy nie wrzucaj `.env` do repozytorium GitHub.

Jeżeli token bota lub Client Secret były wcześniej publikowane, wygeneruj nowe.
