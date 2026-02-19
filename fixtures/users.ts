export const users = {
  regular: {
    email: process.env.E2E_USER_EMAIL || 'test@example.com',
    password: process.env.E2E_USER_PASSWORD || 'password',
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.E2E_ADMIN_PASSWORD || 'password',
  },
} as const;
