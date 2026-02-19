export const URLS = {
  home: '/',
  login: '/login',
  register: '/register',
  library: '/library',
  audio: '/audio-gallery',
  forum: '/forum',
  search: '/search',
  profile: '/profile',
} as const;

export const PUBLIC_PAGES = [
  { name: 'Home', path: URLS.home },
  { name: 'Forum', path: URLS.forum },
  { name: 'Library', path: URLS.library },
  { name: 'Audio', path: URLS.audio },
  { name: 'Search', path: URLS.search },
  { name: 'Login', path: URLS.login },
  { name: 'Register', path: URLS.register },
] as const;

export const SEARCH_QUERIES = {
  valid: 'dharma',
  noResults: 'xyznonexistent123',
  special: 'भगवद्गीता',
} as const;
