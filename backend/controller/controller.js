// https://api.artic.edu/api/v1/artworks?page=2&limit=100

const fail = (res, status, message) => res.status(status).json({ message });
const ok = (res, data) => res.status(200).json(data);

const getArtworks = async (req, res) => {
    const { page, limit } = req.body;

    if (!page, !limit) {
        return fail(res, 400, 'page et limit requis')
    }

    try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
         const result = await response.json();
        return ok(res, result)
    } catch (err) {
        return fail(res, 500, err.message)
    }
}

const getArtiste = async (req, res) => {
    const { page, limit } = req.body;

    if (!page, !limit) {
        return fail(res, 400, 'page et limit requis')
    }

    try {
        const response = await fetch(`https://api.artic.edu/api/v1/artworks?fields=${id},artist_display`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
         const result = await response.json();
        return ok(res, result)
    } catch (err) {
        return fail(res, 500, err.message)
    }
}
