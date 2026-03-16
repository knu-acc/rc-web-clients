# Личная CRM — Проекты

Mobile-First веб-приложение для учёта клиентов и проектов (личная CRM). Стек: Next.js, Tailwind CSS, Supabase (Auth, Database, Storage). Дизайн в стиле Material You (Google Pixel).

## Зависимости (уже установлены)

```bash
npm install @supabase/supabase-js @supabase/ssr next-themes
```

Остальные зависимости добавляются при создании проекта через `create-next-app` (next, react, tailwindcss и т.д.).

## Настройка Supabase

1. Создайте проект на [supabase.com](https://supabase.com) (New Project → организация, имя, регион, пароль БД).
2. В **Settings → API** скопируйте **Project URL** и **anon public** key.
3. В корне проекта создайте `.env.local` (можно скопировать из `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-ключ
NEXT_PUBLIC_SITE_PASSWORD=4149
```

4. В Supabase откройте **SQL Editor** и выполните скрипт из файла [supabase/schema.sql](supabase/schema.sql) — создастся таблица `projects`, RLS и политики для Storage.

5. Создайте бакет для договоров: **Storage → New bucket**. Имя: `contracts`, доступ: **Private**, лимит размера файла: 10 MB, разрешённые типы: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `image/gif`. Политики доступа к объектам уже заданы в шаге 4.

6. В **Authentication → Providers** включите Email и при необходимости зарегистрируйте пользователя (или используйте встроенную регистрацию по email/паролю).

## Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Сначала введите код доступа к сайту (значение `NEXT_PUBLIC_SITE_PASSWORD`), затем войдите по email/паролю Supabase.

## Деплой на Netlify + Supabase

1. В Supabase откройте **Authentication → URL Configuration** и добавьте URL вашего сайта на Netlify:
	- `Site URL`: `https://<your-site>.netlify.app`
	- `Redirect URLs`: `https://<your-site>.netlify.app/*`
2. В Netlify подключите этот GitHub-репозиторий и оставьте автоопределение Next.js (в репозитории уже есть `netlify.toml`).
3. В **Netlify → Site configuration → Environment variables** добавьте:
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- `NEXT_PUBLIC_SITE_PASSWORD`
4. Нажмите **Deploy site** (дальше деплой будет идти автоматически при push).

## Функции

- **Доступ**: код сайта из `NEXT_PUBLIC_SITE_PASSWORD` + авторизация Supabase (Email/Password).
- **Проекты**: список с фильтром по статусу работы, карточки с ценой и статусами, свайп влево для удаления.
- **Добавление/редактирование**: форма со всеми полями (клиент, контакт, ссылка на сайт, цена, договор — загрузка в Storage, статусы, даты, заметки).
- **Темы**: светлая и тёмная (Material You), переключатель в шапке.
- **Приватность**: в разметке задано `robots: noindex, nofollow`.
