# Публикация сайта на Vercel

**Адрес сайта: https://master-english-henna.vercel.app**
(имя `master-english.vercel.app` занято чужим проектом, поэтому Vercel выдал имя с суффиксом)

Коротко: код едет на Vercel, база и файлы уже в облаке, менять их не нужно.

## 1. Что уже готово

- **База данных** — Prisma Postgres, доступна из интернета. Переносить нечего.
- **Загрузка файлов** — идёт в UploadThing (задан `UPLOADTHING_TOKEN`), диск хостинга не нужен.
- **Почта** — SMTP уже настроен, письма о комментариях будут уходить.
- **Медиа уроков** (`public/audio`, `public/video`) лежат в репозитории и поедут вместе с сайтом.
- Исходники учебников (`books/`, `video/`, `audio/`, `photos/`) в репозиторий не входят — они нужны только на вашем компьютере.

## 2. Что уже настроено

- Проект `master-english` в аккаунте `mastertuz`, связан с репозиторием `Mastertuz/master_english`.
- `.vercelignore` — Vercel не читает `.gitignore`, поэтому список исключений отдельный.
  Без него на выкладку уезжали 600 МБ исходников учебников.

## 3. Переменные окружения

Заносятся в Vercel: **Project → Settings → Environment Variables**.
Значения берутся из локального `.env`. **Кавычки из `.env` снимать обязательно** —
если значение уедет вместе с кавычками, сайт отвечает 500 «Can't reach database server».

Перезалить все разом:

```bash
grep -v '^#' .env | grep -v '^$' | while IFS='=' read -r k v; do v="${v%\"}"; v="${v#\"}"; printf '%s' "$v" | npx vercel env add "$k" production --force --sensitive; done
```

После смены переменных нужна новая сборка: `npx vercel --prod`.

| Переменная | Зачем |
| --- | --- |
| `DATABASE_URL` | подключение к базе Prisma Postgres |
| `UPLOADTHING_TOKEN` | загрузка картинок и аудио в конструкторе |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | письма о комментариях и восстановление пароля |

Задать нужно для окружения **Production** (и **Preview**, если хотите проверять черновики).

## 4. Перед публикацией

- Сменить пароли `admin` и `student` — они стандартные из сида.
- Проверить, что в админке нет тестовых учеников.

## 5. Как обновлять сайт потом

```bash
git add -A && git commit -m "что изменилось"
npx vercel --prod
```

Если проект подключён к GitHub, достаточно `git push` — Vercel соберёт сам.

## 6. Полезное

- Сборка проверяется локально: `npm run build`
- Прод-сервер рядом с запущенным `npm run dev` собирать так:
  `NEXT_DIST_DIR=.next-verify npm run build && NEXT_DIST_DIR=.next-verify npx next start -p 3101`
