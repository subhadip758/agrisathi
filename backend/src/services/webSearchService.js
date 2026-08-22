const https = require('https');
const http = require('http');

class WebSearchService {
  async searchWeb(query, maxResults = 4) {
    if (!query || typeof query !== 'string') return { success: false, results: [] };
    const q = query.trim();

    try {
      // 1. DuckDuckGo Instant Answer API
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(ddgUrl, {
        headers: { 'User-Agent': 'AgriSathi-Search-Agent/1.0 (Indian Agriculture AI Assistant)' }
      });
      const data = await res.json();

      const results = [];
      if (data.AbstractText) {
        results.push({
          title: data.Heading || q,
          snippet: data.AbstractText,
          url: data.AbstractURL || 'https://duckduckgo.com',
          source: data.AbstractSource || 'DuckDuckGo Web Search'
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        data.RelatedTopics.forEach(item => {
          if (item.Text && !item.Topics && results.length < maxResults) {
            results.push({
              title: item.Text.slice(0, 60),
              snippet: item.Text,
              url: item.FirstURL || '',
              source: 'Web Search'
            });
          }
        });
      }

      if (results.length > 0) {
        return { success: true, query: q, results, count: results.length, source: 'DuckDuckGo Public Web Search API' };
      }

      // 2. Wikipedia API Fallback
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
      const wikiRes = await fetch(wikiUrl);
      const wikiData = await wikiRes.json();

      if (wikiData.query?.search?.length > 0) {
        const wikiResults = wikiData.query.search.slice(0, maxResults).map(item => ({
          title: item.title,
          snippet: item.snippet.replace(/<[^>]+>/g, ''),
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          source: 'Wikipedia Encyclopedia'
        }));
        return { success: true, query: q, results: wikiResults, count: wikiResults.length, source: 'Wikipedia Search Engine' };
      }

      return { success: false, query: q, results: [], message: 'No search results found.' };
    } catch (err) {
      console.warn('⚠️ Web Search Service Error:', err.message);
      return { success: false, query: q, results: [], message: `Search unavailable: ${err.message}` };
    }
  }
}

module.exports = new WebSearchService();
