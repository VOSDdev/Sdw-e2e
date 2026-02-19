# План расстановки `data-testid` — sanatanadharma.world

> Текущее состояние: **0 атрибутов** `data-testid` в проекте.

## Конвенция именования
Формат: `{контекст}-{элемент}-{тип}`

| Тип | Суффикс | Пример |
|-----|---------|--------|
| Кнопка | `-button` | `login-submit-button` |
| Ссылка | `-link` | `nav-library-link` |
| Поле ввода | `-input` | `login-email-input` |
| Текст/счётчик | `-count`, `-text` | `content-likes-count` |
| Контейнер | `-container` | `search-results-container` |
| Список | `-list` | `library-books-list` |
| Элемент списка | `-item` | `library-book-item` |
| Форма | `-form` | `login-form` |
| Модалка | `-dialog` | `forum-create-topic-dialog` |
| Выпадающее меню | `-dropdown` | `header-language-dropdown` |

---

## Приоритет 1 — Критический (Smoke + Auth)

### 1.1 Header (`components/header-v2/`)
~324 строк шаблона. Интерактивные элементы:

| testid | Элемент | Строка |
|--------|---------|--------|
| `header-logo-link` | Лого (клик → главная) | img (click)="navigateToHome()" |
| `header-burger-button` | Бургер-меню (мобильный) | button.burger-menu-toggle |
| `header-nav-main-link` | Ссылка «Главная» | a (click)="navigateToHome()" |
| `header-nav-menu-link` | Ссылка меню (tradition/teaching/practice) | a (click)="showLinkMemu(menuKey)" |
| `header-nav-forum-link` | Ссылка «Форум» | a (click)="navigateToForum()" |
| `header-support-dropdown` | Меню «Поддержать» | div.support-menu |
| `header-donation-link` | Пожертвование | div.dropdown-item → donation |
| `header-subscription-link` | Подписка | div.dropdown-item → subscription |
| `header-language-dropdown` | Выбор языка | div.language-menu |
| `header-language-{code}-button` | Конкретный язык (ru/en/de/ua/it) | div.dropdown-item → changeLanguage() |
| `header-search-link` | Иконка поиска | svg → routerLink search |
| `header-ai-chat-link` | Иконка AI-чат | svg → navigateToAIChat() |
| `header-user-menu-button` | Меню пользователя | div.user-menu |
| `header-login-link` | Кнопка «Войти» | (ссылка на /signin) |
| `header-logout-button` | Кнопка «Выйти» | (в user dropdown) |
| `header-profile-link` | Ссылка на профиль | (в user dropdown) |
| `header-notifications-link` | Иконка уведомлений | (если есть) |

**Итого: ~17 атрибутов**

### 1.2 Footer (`components/footer-v2/`)
~134 строк.

| testid | Элемент |
|--------|---------|
| `footer-container` | Контейнер подвала |
| `footer-nav-{section}-link` | Ссылки навигации |
| `footer-social-{platform}-link` | Соц. сети |
| `footer-copyright-text` | Копирайт |

**Итого: ~8-10 атрибутов**

### 1.3 Login (`pages/login/`)
~50 строк. Компактная форма.

| testid | Элемент |
|--------|---------|
| `login-form` | `<form>` |
| `login-email-input` | Input email |
| `login-password-input` | Input пароль |
| `login-show-password-button` | Показать/скрыть пароль |
| `login-submit-button` | Кнопка «Войти» (app-button primary) |
| `login-google-button` | Кнопка Google OAuth |
| `login-register-link` | Ссылка «Регистрация» |
| `login-forgot-link` | Ссылка «Забыли пароль» |
| `login-error-text` | Сообщение об ошибке (если есть) |

**Итого: ~9 атрибутов**

### 1.4 Registration (`components/registration-form/`)
~80 строк.

| testid | Элемент |
|--------|---------|
| `registration-form` | `<form>` |
| `registration-email-input` | Input email |
| `registration-password-input` | Input пароль |
| `registration-confirm-password-input` | Input подтверждение |
| `registration-captcha-container` | reCAPTCHA |
| `registration-submit-button` | Кнопка «Зарегистрироваться» |
| `registration-google-button` | Кнопка Google |
| `registration-login-link` | Ссылка «Уже есть аккаунт» |
| `registration-passwords-mismatch-text` | Ошибка паролей |

**Итого: ~9 атрибутов**

### 1.5 Homepage (`pages/main-v2/`)
~80+ строк видимых.

| testid | Элемент |
|--------|---------|
| `home-banner-container` | Баннер с видео |
| `home-banner-title-text` | Заголовок `<h1>` |
| `home-banner-cta-button` | CTA кнопка |
| `home-carousel-{id}-container` | Каждая карусель |
| `home-carousel-{id}-title-text` | Заголовок карусели |
| `home-carousel-{id}-showmore-link` | «Показать ещё» |

**Итого: ~10-15 атрибутов** (зависит от кол-ва каруселей)

---

## Приоритет 2 — Высокий (Core Flows)

### 2.1 Content/Article (`pages/content/`)
~537 строк. Самый насыщенный компонент.

| testid | Элемент |
|--------|---------|
| `content-title-text` | Заголовок статьи |
| `content-date-button` | Дата (action-button readonly) |
| `content-like-button` | Лайк (action-button type=like) |
| `content-likes-count` | Счётчик лайков (внутри action-button) |
| `content-favorite-button` | Избранное (action-button type=favorite) |
| `content-share-button` | Поделиться (action-button type=share) |
| `content-views-count` | Просмотры |
| `content-body-container` | Тело статьи |
| `content-tags-list` | Теги/категории |
| `content-tag-item` | Отдельный тег |
| `content-audio-play-button` | Кнопка play аудио |
| `content-purchase-button` | Кнопка покупки |
| `content-similar-list` | Похожие статьи |
| `content-similar-item` | Элемент похожих |
| `content-scroll-top-button` | Прокрутка вверх |
| `content-preview-dialog` | Модалка превью |
| `content-preview-close-button` | Закрыть превью |
| `content-telegram-link` | Ссылка Telegram автора |
| `content-instagram-link` | Ссылка Instagram автора |

**Итого: ~19 атрибутов**

### 2.2 ActionButton (`components/action-button/`)
Переиспользуемый компонент. Нужно добавить проброс `data-testid`:

| testid | Элемент |
|--------|---------|
| `{переданный testid}` | Корневой div (проброс через @Input) |
| `action-button-icon` | Иконка |
| `action-button-text` | Текст/счётчик |

**Подход:** Добавить `@Input() testId: string` в компонент, пробросить на корневой элемент. Тогда в content можно: `<app-action-button [testId]="'content-like'"...>`.

### 2.3 Forum V2 (`pages/forum/forum-v2/`)

| testid | Элемент |
|--------|---------|
| `forum-topics-list` | Список топиков |
| `forum-topic-item` | Элемент топика |
| `forum-create-topic-button` | Кнопка «Создать тему» |
| `forum-create-topic-dialog` | Модалка создания |
| `forum-topic-name-input` | Название темы |
| `forum-topic-submit-button` | Кнопка «Опубликовать» |
| `forum-filter-button` | Фильтры |
| `forum-filter-dialog` | Модалка фильтров |
| `forum-category-dropdown` | Фильтр по категории |
| `forum-sort-dropdown` | Сортировка |

**Итого: ~10 атрибутов**

### 2.4 Forum Topic V2 (`pages/forum/forum-topic-v2/`)

| testid | Элемент |
|--------|---------|
| `forum-topic-title-text` | Заголовок |
| `forum-topic-body-container` | Тело |
| `forum-topic-like-button` | Лайк топика |
| `forum-topic-likes-count` | Счётчик |
| `forum-topic-reply-button` | Ответить |
| `forum-comment-dialog` | Модалка комментария |
| `forum-comment-editor` | Редактор (simple-editor) |
| `forum-comment-submit-button` | Отправить комментарий |
| `forum-comment-close-button` | Закрыть |
| `forum-comment-item` | Комментарий |
| `forum-comment-like-button` | Лайк комментария |
| `forum-comment-reply-button` | Ответить на комментарий |

**Итого: ~12 атрибутов**

---

## Приоритет 3 — Средний (Media + i18n)

### 3.1 Library List (`pages/library/library-list/`)

| testid | Элемент |
|--------|---------|
| `library-books-list` | Список книг |
| `library-book-item` | Элемент книги |
| `library-filter-button` | Фильтры |
| `library-filter-dialog` | Модалка фильтров |
| `library-search-input` | Поиск |
| `library-sort-dropdown` | Сортировка |
| `library-category-dropdown` | Категория |
| `library-tags-dropdown` | Теги |

**Итого: ~8 атрибутов**

### 3.2 Library Book (`pages/library/`)

| testid | Элемент |
|--------|---------|
| `library-book-title-text` | Название |
| `library-book-author-text` | Автор |
| `library-book-cover-image` | Обложка |
| `library-book-read-button` | Читать |
| `library-book-purchase-button` | Купить |
| `library-book-favorite-button` | Избранное |

**Итого: ~6 атрибутов**

### 3.3 Audio Gallery (`pages/audio-gallery/`)

| testid | Элемент |
|--------|---------|
| `audio-tracks-list` | Список |
| `audio-track-item` | Трек |
| `audio-play-button` | Play |
| `audio-filter-button` | Фильтры |
| `audio-playlist-button` | Плейлист |

**Итого: ~5 атрибутов**

### 3.4 Main Player (`components/main-player/`)
~1051 строк — самый большой компонент.

| testid | Элемент |
|--------|---------|
| `player-container` | Контейнер плеера |
| `player-play-button` | Play/Pause |
| `player-prev-button` | Предыдущий |
| `player-next-button` | Следующий |
| `player-progress-bar` | Прогресс-бар |
| `player-current-time-text` | Текущее время |
| `player-duration-text` | Длительность |
| `player-volume-button` | Громкость |
| `player-volume-slider` | Слайдер громкости |
| `player-track-title-text` | Название трека |
| `player-repeat-button` | Повтор |
| `player-shuffle-button` | Перемешать |
| `player-playlist-button` | Плейлист |
| `player-speed-button` | Скорость |
| `player-minimize-button` | Свернуть |

**Итого: ~15 атрибутов**

### 3.5 Search (`components/search/`)

| testid | Элемент |
|--------|---------|
| `search-input` | Поле поиска |
| `search-submit-button` | Кнопка поиска |
| `search-results-container` | Контейнер результатов |
| `search-result-item` | Элемент результата |
| `search-results-count-text` | Количество |
| `search-filter-button` | Фильтры |
| `search-filter-dialog` | Модалка фильтров |
| `search-empty-text` | «Ничего не найдено» |

**Итого: ~8 атрибутов**

### 3.6 Photo Gallery (`components/photo-gallery/`)

| testid | Элемент |
|--------|---------|
| `photo-gallery-list` | Список |
| `photo-gallery-item` | Фото |
| `photo-lightbox-container` | Lightbox |
| `photo-lightbox-prev-button` | Предыдущее |
| `photo-lightbox-next-button` | Следующее |
| `photo-lightbox-close-button` | Закрыть |

**Итого: ~6 атрибутов**

---

## Приоритет 4 — Низкий (Profile + Misc)

### 4.1 Profile (`pages/profile/`)

| testid | Элемент |
|--------|---------|
| `profile-avatar-image` | Аватар |
| `profile-name-text` | Имя |
| `profile-nav-{section}-link` | Навигация (favorites/my-data/playlists/subscriptions) |
| `profile-edit-button` | Редактировать |

### 4.2 Profile Form (`components/profile-form/`)
| testid | Элемент |
|--------|---------|
| `profile-form` | Форма |
| `profile-firstname-input` | Имя |
| `profile-lastname-input` | Фамилия |
| `profile-email-input` | Email |
| `profile-save-button` | Сохранить |
| `profile-avatar-upload` | Загрузка аватара |

### 4.3 Notifications (`pages/notifications/`)
| testid | Элемент |
|--------|---------|
| `notifications-list` | Список |
| `notifications-item` | Элемент |
| `notifications-empty-text` | Пусто |

---

## Общий компонент: app-button (`components/button/`)
Нужно добавить проброс `data-testid`:
```typescript
@Input() testId: string = '';
// В шаблоне: [attr.data-testid]="testId || null"
```
Это позволит каждому использованию app-button иметь уникальный testid.

---

## Сводка

| Приоритет | Область | Файлов | testid атрибутов |
|-----------|---------|--------|------------------|
| 1 — Критический | Header, Footer, Login, Registration, Homepage | 5 | ~55 |
| 2 — Высокий | Content, ActionButton, Forum, ForumTopic | 4 | ~45 |
| 3 — Средний | Library, Audio, MainPlayer, Search, Photo | 6 | ~48 |
| 4 — Низкий | Profile, Notifications | 4 | ~15 |
| **Итого** | | **19 файлов** | **~163 атрибута** |

## Порядок выполнения

1. **Сквозные компоненты:** `app-button`, `app-action-button` — добавить проброс testId (влияет на все остальные)
2. **Приоритет 1:** Header → Login → Registration → Footer → Homepage
3. **Приоритет 2:** Content → Forum V2 → Forum Topic V2
4. **Приоритет 3:** Library → Audio → MainPlayer → Search → Photo
5. **Приоритет 4:** Profile → Notifications

## Ограничения
- `app-button` и `app-action-button` — переиспользуемые, нужен @Input для проброса testId
- `main-player` (1051 строк) — потребует детального анализа при расстановке
- `search` (1661 строк) — большой компонент, но структура стандартная
- Deprecated компоненты (forum v1) — пропускаем
