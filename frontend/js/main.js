import { getArtworks, getArtistes } from './api.js';

const container = document.querySelector('#artworks-container, #artists-container');
const isArtists = Boolean(document.querySelector('#artists-container'));
const search = document.querySelector('#search');
const status = document.querySelector('#status');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const pageLabel = document.querySelector('#page-label');
let currentPage = 1;
let result = null;
let busy = false;

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

function artworkCard(artwork) {
    const card = element('article', 'artwork-card');
    const media = element('div', 'artwork-media');
    const placeholder = element('p', 'image-placeholder', 'Image non disponible');
    media.append(placeholder);
    if (artwork.image_id) {
        const image = element('img', 'artwork-image');
        image.alt = artwork.thumbnail?.alt_text || artwork.title || 'Œuvre de la collection';
        image.loading = 'lazy';
        image.width = 600;
        image.height = 600;
        image.src = `https://www.artic.edu/iiif/2/${encodeURIComponent(artwork.image_id)}/full/600,/0/default.jpg`;
        image.addEventListener('error', () => image.remove(), { once: true });
        media.append(image);
    }
    const content = element('div', 'artwork-content');
    content.append(
        element('p', 'eyebrow', artwork.date_display || 'Date non renseignée'),
        element('h2', 'artwork-title', artwork.title || 'Sans titre'),
        element('p', 'artwork-artist', artwork.artist_title || 'Artiste non renseigné'),
        element('p', 'artwork-medium', artwork.medium_display || 'Technique non renseignée')
    );
    card.append(media, content);
    return card;
}

function artistCard(artist) {
    const card = element('article', 'artist-card');
    const initials = artist.title.split(/\s+/).filter(Boolean).slice(0, 2).map(word => [...word][0]).join('');
    const monogram = element('div', 'artist-monogram', initials);
    monogram.setAttribute('aria-hidden', 'true');
    card.append(monogram, element('h2', 'artist-name', artist.title));
    card.append(element('p', 'artist-id', artist.id == null ? 'Identifiant non renseigné' : `Artiste n° ${artist.id}`));
    card.append(element('p', 'eyebrow', 'Œuvres sur cette page'));
    const list = element('ul', 'artist-works');
    artist.artworks.forEach(artwork => list.append(element('li', '', artwork.title || 'Sans titre')));
    card.append(list);
    return card;
}

function render() {
    const query = search.value.trim().toLocaleLowerCase('fr');
    const items = result.data.filter(item => {
        const text = isArtists
            ? [item.title, ...item.artworks.map(artwork => artwork.title)].join(' ')
            : [item.title, item.artist_title, item.medium_display].join(' ');
        return text.toLocaleLowerCase('fr').includes(query);
    });
    container.replaceChildren(...items.map(isArtists ? artistCard : artworkCard));
    if (!items.length) container.append(element('p', 'loading', 'Aucun résultat sur cette page. Essayez une autre recherche ou une autre page.'));
    status.textContent = `${items.length} ${isArtists ? 'artiste(s)' : 'œuvre(s)'} affiché(e)s sur cette page`;
}

async function loadPage(page) {
    if (busy) return;
    busy = true;
    search.disabled = true;
    previous.disabled = next.disabled = true;
    container.setAttribute('aria-busy', 'true');
    container.replaceChildren(element('p', 'loading', 'Chargement de la collection…'));
    status.textContent = 'Connexion au musée…';
    try {
        const data = await (isArtists ? getArtistes(page) : getArtworks(page));
        result = data;
        currentPage = page;
        render();
    } catch (error) {
        result = null;
        const message = element('div', 'error');
        message.append(element('h2', '', 'La collection est momentanément indisponible'), element('p', '', error.message));
        const retry = element('button', 'button', 'Réessayer');
        retry.type = 'button';
        retry.addEventListener('click', () => loadPage(page));
        message.append(retry);
        container.replaceChildren(message);
        status.textContent = 'Échec du chargement.';
    } finally {
        busy = false;
        search.disabled = !result;
        container.setAttribute('aria-busy', 'false');
        const total = Number(result?.pagination?.total_pages);
        pageLabel.textContent = `Page ${currentPage}${total > 0 ? ' sur ' + total : ''}`;
        previous.disabled = currentPage <= 1;
        next.disabled = !result || !(total > currentPage);
    }
}

if (container) {
    search.addEventListener('input', () => { if (result) render(); });
    previous.addEventListener('click', () => loadPage(currentPage - 1));
    next.addEventListener('click', () => loadPage(currentPage + 1));
    loadPage(1);
}
