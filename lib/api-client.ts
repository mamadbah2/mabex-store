export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Obligatoire pour envoyer le cookie httpOnly authToken au middleware et au backend
  })
}
