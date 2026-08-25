# Discord bot dla BunBun

Ten backend robi trzy rzeczy:

- logowanie przez Discord OAuth (`/api/auth/discord/start`, `/api/auth/me`, `/api/auth/logout`),
- pobieranie liczby osób z kanału Discord (`/api/discord/stats`),
- pobieranie nazwy i avatara użytkownika po ID konta (`/api/discord/users/:id`).

## Uruchomienie

1. Zainstaluj zależności:

```bash
npm install
```

2. Skopiuj `.env.example` do `.env` i uzupełnij wartości.

3. W Discord Developer Portal utwórz aplikację i bota.

4. Włącz botowi privileged intent `Server Members Intent`, bo licznik roli `Tłumacz` wymaga pobrania członków serwera.

5. Dodaj redirect OAuth:

```text
http://localhost:3000/api/auth/discord/callback
```

6. Zaproś bota na serwer z uprawnieniami do odczytu serwera, kanałów i członków.

7. Uruchom:

```bash
npm start
```

8. Otwórz:

```text
http://localhost:3000
```

## Licznik osób

W panelu `Dane` wpisujesz ID kanału, którego nazwa zawiera liczbę osób, np. `osoby-1234` albo `👥・1234`. Backend odczyta pierwszą liczbę z nazwy kanału. Jeśli kanał nie ma liczby, backend spróbuje użyć `guild.memberCount`.

## Ważne

Nie wpisuj tokenu bota ani Client Secret do plików frontendu. One mają być tylko w `.env` na serwerze.


## Publikowanie rozdziałów z bota

Strona udostępnia `GET /api/chapters`, z którego frontend pobiera opublikowane rozdziały co 15 sekund. Bot może publikować rozdział przez `POST /api/chapters/publish` z JSON-em `{ "titleId": "...", "titleName": "...", "chapter": { ... } }`. `titleId` powinno odpowiadać ID serii na stronie; `titleName` jest dodatkowym zabezpieczeniem, dzięki któremu frontend może dopasować serię także po jej nazwie. Jeśli ustawisz `BUNBUN_CONTENT_SYNC_KEY` w `.env`, bot powinien wysyłać ten sam klucz w nagłówku `x-bunbun-sync-key`.

W obecnym projekcie kod bota nie znajduje się w archiwum, więc samo API nie może automatycznie wiedzieć o rozdziałach dodawanych wyłącznie przez Discorda, dopóki bot nie wyśle ich na ten endpoint.
