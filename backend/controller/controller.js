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

const getArtist = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return fail(res, 400, 'id requis');
    }

    try {
        const response = await fetch(
            `https://api.artic.edu/api/v1/artworks/${id}?fields=artist_title`
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        return ok(res, result.data.artist_title);

    } catch (err) {
        return fail(res, 500, err.message);
    }
}


module.exports = {
    getArtworks,
    getArtist
}