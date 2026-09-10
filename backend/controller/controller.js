// https://api.artic.edu/api/v1/artworks?page=2&limit=100

const fail = (res, status, message) => res.status(status).json({ message });
const ok = (res, data) => res.status(200).json(data);

const getArtworks = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 24);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return fail(res, 400, 'page doit être un entier positif et limit un entier entre 1 et 100')
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

const getArtist = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 24);

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return fail(res, 400, 'page doit être un entier positif et limit un entier entre 1 et 100');
    }

    try {
        const response = await fetch(
            `https://api.artic.edu/api/v1/agents?page=${page}&limit=${limit}`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const result = await response.json();

        return ok(res, result)

    } catch (err) {
        return fail(res, 500, err.message);
    }
}


module.exports = {
    getArtworks,
    getArtist
}