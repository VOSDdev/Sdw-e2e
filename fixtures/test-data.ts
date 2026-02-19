export const URLS = {
  home: '/',
  login: '/login',
  library: '/library',
  audio: '/audio',
  video: '/video',
  forum: '/forum',
  search: '/search',
  profile: '/profile',
} as const;

export const PUBLIC_PAGES = [
  { name: 'Home', path: URLS.home },
  { name: 'Library', path: URLS.library },
  { name: 'Audio', path: URLS.audio },
  { name: 'Video', path: URLS.video },
  { name: 'Forum', path: URLS.forum },
  { name: 'Search', path: URLS.search },
] as const;

export const SEARCH_QUERIES = {
  valid: 'dharma',
  noResults: 'xyznonexistent123',
  special: 'भगवद्गीता',
} as const;
