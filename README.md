# SDW E2E Tests

End-to-end testing framework for [Sanatana Dharma World](https://sanatanadharma.world) using Playwright + TypeScript.

## Setup

```bash
npm install
npx playwright install chromium
```

## Configuration

Copy and fill environment variables:

```bash
cp config/dev.env .env
# Edit .env with real credentials
```

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Target environment URL |
| `E2E_USER_EMAIL` | Regular test user email |
| `E2E_USER_PASSWORD` | Regular test user password |
| `E2E_ADMIN_EMAIL` | Admin test user email |
| `E2E_ADMIN_PASSWORD` | Admin test user password |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for reports |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for reports |

## Running Tests

```bash
npm test              # All tests
npm run test:smoke    # Smoke tests only
npm run test:chromium # Desktop only
npm run test:mobile   # Mobile only
npm run report        # Open HTML report
```

## Structure

```
├── pages/          # Page Object Models
├── fixtures/       # Test fixtures & data
├── utils/          # Helpers & reporters
├── tests/
│   └── smoke/      # Smoke tests
├── config/         # Environment configs
└── .github/        # CI workflows
```

## data-testid Convention

Format: `{page}-{element}-{type}`

Types: `-button`, `-link`, `-input`, `-count`, `-text`, `-container`, `-list`, `-item`

Example: `article-like-button`, `login-email-input`
