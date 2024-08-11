const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '/api/content' // relative URL for production (Heroku)
    : 'http://localhost:3001/api/content'; // absolute URL for local development

export default API_BASE_URL;