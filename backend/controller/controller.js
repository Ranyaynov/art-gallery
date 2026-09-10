const fail = (res, status, message) =>
    res.status(status).json({ message });

const ok = (res, data) =>
    res.status(200).json(data);

const getArtworks = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 24);

    if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
    ) {
        return fail(
            res,
            400,
            'page doit être un entier positif et limit un entier entre 1 et 100'
        );
    }

    try {

        const fields = [
            'id',
            'title',
            'image_id',
            'thumbnail',
            'artist_title',
            'artist_display',
            'date_display',
            'date_start',
            'artwork_type_title',
            'medium_display',
            'dimensions',
            'credit_line'
        ].join(',');

        const url =
            `https://api.artic.edu/api/v1/artworks` +
            `?page=${page}` +
            `&limit=${limit}` +
            `&fields=${fields}`;

        console.log('API appelée :', url);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        console.log(
            'Première oeuvre :',
            result.data?.[0]
        );

        return ok(res, result);

    } catch (err) {

        console.error('ERREUR API :', err);

        return fail(res, 500, err.message);
    }
};


const getArtist = async (req, res) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 24);

    if (
        !Number.isInteger(page) ||
        page < 1 ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100
    ) {
        return fail(
            res,
            400,
            'page doit être un entier positif et limit un entier entre 1 et 100'
        );
    }

    try {

        const response = await fetch(
            `https://api.artic.edu/api/v1/agents?page=${page}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();

        return ok(res, result);

    } catch (err) {

        console.error(err);

        return fail(res, 500, err.message);
    }
};


module.exports = {
    getArtworks,
    getArtist
};