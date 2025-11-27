const PEXELS_API_KEY = process.env.PEXELS_API_KEY; 
const PEXELS_URL = 'https://api.pexels.com/v1/search';

export default async function handler(req, res) {
  
  if (!PEXELS_API_KEY) {
    return res.status(500).json({ error: 'Erro de Configuração: PEXELS_API_KEY não encontrada.' });
  }
  
  const { animal } = req.query; 

  if (!animal) {
    return res.status(400).json({ error: 'Parâmetro "animal" não fornecido.' });
  }

  try {
    const response = await fetch(`${PEXELS_URL}?query=${animal}&per_page=1&orientation=square`, {
      headers: {
        Authorization: PEXELS_API_KEY, 
      },
    });
    
    if (!response.ok) {
        return res.status(response.status).json({ 
            error: `Erro ao acessar Pexels: ${response.statusText}`,
            internal_status: response.status
        });
    }

    const data = await response.json();

    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.small; 
      
      return res.status(200).json({ imageUrl });
    } else {
      return res.status(404).json({ error: 'Nenhuma imagem encontrada para o animal.' });
    }
  } catch (error) {
    console.error('Erro Serverless:', error);
    return res.status(500).json({ error: 'Erro interno do servidor ao processar a busca.' });
  }
}