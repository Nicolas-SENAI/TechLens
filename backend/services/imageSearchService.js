/**
 * Serviço de Busca de Imagens Reais para Produtos
 * Busca imagens nítidas na web usando DuckDuckGo Images com fallback para Wikipedia e Unsplash.
 */

const imageCache = new Map();

const CATEGORY_FALLBACK_IMAGES = {
  'Audio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  'Áudio e Fones': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
  'Teclados e Periféricos': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  'Periféricos': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  'Cabos e Conectores': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'Redes e Wi-Fi': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80',
  'Wearables e Relógios': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
  'Smartphones e Celulares': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
  'Televisores e Smart TVs': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
  'Carregadores e Energia': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
  'Casa Inteligente': 'https://images.unsplash.com/photo-1518444065439-e933c06ceb1f?w=600&auto=format&fit=crop&q=80',
  'Eletrônicos': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80'
};

export const imageSearchService = {
  /**
   * Busca uma imagem nítida e direta do produto na web
   * @param {string} termoBusca Nome ou modelo do produto (ex: "AKG N5 HYBRID", "Redragon Fizz Pro K616")
   * @param {string} categoria Categoria do produto para fallback
   * @returns {Promise<string>} URL da imagem
   */
  async buscarImagemProduto(termoBusca, categoria = 'Eletrônicos') {
    if (!termoBusca || typeof termoBusca !== 'string' || !termoBusca.trim()) {
      return this.obterImagemFallback(categoria);
    }

    const chaveCache = termoBusca.trim().toLowerCase();
    if (imageCache.has(chaveCache)) {
      return imageCache.get(chaveCache);
    }

    // 1. Tentar DuckDuckGo Images
    try {
      const query = `${termoBusca.trim()} produto`;
      const tokenRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      const tokenText = await tokenRes.text();
      const vqdMatch = tokenText.match(/vqd=["']?([^"']+)["']?/);

      if (vqdMatch && vqdMatch[1]) {
        const vqd = vqdMatch[1];
        const imgApiUrl = `https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,`;
        const imgRes = await fetch(imgApiUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        if (imgRes.ok) {
          const data = await imgRes.json();
          if (data && data.results && data.results.length > 0) {
            // Escolhe a primeira imagem válida com protocolo HTTPS
            for (const item of data.results.slice(0, 5)) {
              if (item.image && item.image.startsWith('https://')) {
                // Evita formatos não renderizáveis
                const url = item.image;
                if (!url.includes('.svg') && !url.includes('.ico')) {
                  imageCache.set(chaveCache, url);
                  return url;
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[ImageSearch] Falha ao buscar imagem DuckDuckGo para "${termoBusca}":`, err.message);
    }

    // 2. Tentar Wikipedia API como alternativa
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(termoBusca)}&gsrlimit=1&prop=pageimages&pithumbsize=600&format=json`;
      const wikiRes = await fetch(wikiUrl);
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        const pages = wikiData.query?.pages;
        if (pages) {
          const firstPageId = Object.keys(pages)[0];
          const img = pages[firstPageId]?.thumbnail?.source;
          if (img && img.startsWith('https://')) {
            imageCache.set(chaveCache, img);
            return img;
          }
        }
      }
    } catch (wikiErr) {
      // Ignora erro da wikipedia
    }

    // 3. Fallback de alta qualidade por categoria
    const fallback = this.obterImagemFallback(categoria);
    imageCache.set(chaveCache, fallback);
    return fallback;
  },

  obterImagemFallback(categoria) {
    if (!categoria) return CATEGORY_FALLBACK_IMAGES['Eletrônicos'];
    for (const [catKey, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
      if (categoria.toLowerCase().includes(catKey.toLowerCase()) || catKey.toLowerCase().includes(categoria.toLowerCase())) {
        return url;
      }
    }
    return CATEGORY_FALLBACK_IMAGES['Eletrônicos'];
  }
};

