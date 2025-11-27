export default async function handler(req, res) {
    const animal = req.query.animal;

    if (!process.env.PEXELS_API_KEY) {
        return res.status(500).json({ error: "API key não configurada no servidor." });
    }

    if (!animal) {
        return res.status(400).json({ error: "É necessário enviar o nome do animal." });
    }

    const url = `https://api.pexels.com/v1/search?query=${animal}&per_page=1&orientation=landscape`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: process.env.PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Erro ao consultar Pexels." });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        console.error("Erro no backend:", err);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
