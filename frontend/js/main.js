import { getArtworks, getArtistes } from './api.js';

const menu = document.querySelector('#menu-button');
const navigation = document.querySelector('#nav-links');
menu?.addEventListener('click', () => {
    const open = navigation.classList.toggle('mobile-open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) {
        navigation.classList.remove('mobile-open');
        menu.setAttribute('aria-expanded', 'false');
    }
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        navigation?.classList.remove('mobile-open');
        menu?.setAttribute('aria-expanded', 'false');
    }
});

function node(tag, className, text) {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text != null) item.textContent = text;
    return item;
}
function imageUrl(artwork) {
    return artwork.image_id
        ? `https://www.artic.edu/iiif/2/${encodeURIComponent(artwork.image_id)}/full/843,/0/default.jpg`
        : null;
}
function artworkImage(artwork) {
    const frame = node('div', 'artwork-image');
    const url = imageUrl(artwork);
    const fallback = node('p', 'image-fallback', 'Image non disponible');
    frame.append(fallback);
    if (url) {
        const image = node('img');
        image.src = url;
        image.alt = artwork.thumbnail?.alt_text || artwork.title || 'Œuvre de la collection';
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove(), { once: true });
        frame.append(image);
    }
    return frame;
}

// Les données du musée sont insérées comme du texte, jamais comme du HTML.
function artworkCard(artwork, index) {
    const card = node('article', 'artwork-card');
    const info = node('div', 'artwork-info');
    const text = node('div');
    const heading = node('h3', '', artwork.title || 'Sans titre');
    text.append(
        node('p', 'artwork-category', artwork.artwork_type_title || 'Œuvre'),
        heading,
        node('p', '', artwork.artist_title || 'Artiste non renseigné'),
        node('p', 'artwork-date', artwork.date_display || 'Date non renseignée')
    );
    const details = node('button', 'text-link artwork-details', 'Voir l’œuvre →');
    details.type = 'button';
    details.setAttribute('aria-label', `Voir l’œuvre : ${artwork.title || 'Sans titre'}`);
    details.addEventListener('click', () => showDetails(artwork));
    text.append(details);
    info.append(text, node('span', '', String(index + 1).padStart(2, '0')));
    card.append(artworkImage(artwork), info);
    return card;
}

const dialog = node('dialog', 'artwork-dialog');
dialog.setAttribute('aria-labelledby', 'dialog-title');
document.body.append(dialog);
function showDetails(artwork) {
    const close = node('button', 'dialog-close', 'Fermer ×');
    close.type = 'button';
    close.addEventListener('click', () => dialog.close());
    const title = node('h2', '', artwork.title || 'Sans titre');
    title.id = 'dialog-title';
    const content = node('div', 'dialog-content');
    content.append(title,
        node('p', '', artwork.artist_display || artwork.artist_title || 'Artiste non renseigné'),
        node('p', '', artwork.date_display || 'Date non renseignée'),
        node('p', '', artwork.medium_display || 'Technique non renseignée'),
        node('p', '', artwork.dimensions || ''),
        node('p', 'credit-line', artwork.credit_line || '')
    );
    dialog.replaceChildren(close, artworkImage(artwork), content);
    dialog.showModal();
}
dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

function artistCard(artist, index, preview = false) {
    const card = node('article', preview ? 'artist-preview' : 'artist-card');
    const info = node('div', preview ? '' : 'artist-info');
    if (!preview) {
        const initials = artist.title.split(/\s+/).slice(0, 2).map(part => [...part][0]).join('');
        const monogram = node('div', 'artist-image artist-monogram', initials);
        monogram.setAttribute('aria-hidden', 'true');
        card.append(monogram);
    }
    const years = [artist.birth_date, artist.death_date].filter(year => year != null && year !== 0).join(' – ');
    info.append(node('span', 'artist-number', String(index + 1).padStart(2, '0')),
        node(preview ? 'h3' : 'h2', '', artist.title),
        node('p', '', artist.agent_type_title === 'Corporate Body' ? 'Atelier ou collectif' : 'Artiste'),
        node('p', '', years || 'Dates non renseignées'));
    card.append(info);
    return card;
}

function errorState(container, error, retry) {
    const message = node('div', 'collection-message error');
    message.setAttribute('role', 'alert');
    message.append(node('h3', '', 'Chargement impossible'), node('p', '', error.message));
    const button = node('button', 'button', 'Réessayer');
    button.type = 'button';
    button.addEventListener('click', retry);
    message.append(button);
    container.replaceChildren(message);
}

const periods = {
    antiquite: ['Antiquité', year => year < 500],
    renaissance: ['Renaissance', year => year >= 1400 && year < 1600],
    moderne: ['Art moderne', year => year >= 1860 && year < 1945],
    contemporain: ['Art contemporain', year => year >= 1945]
};
const grid = document.querySelector('#gallery-grid, #artists-grid');
if (grid) {
    const artists = grid.id === 'artists-grid';
    const search = document.querySelector('#search-input');
    const status = document.querySelector('#collection-status');
    const previous = document.querySelector('#previous');
    const next = document.querySelector('#next');
    const pageLabel = document.querySelector('#page-label');
    const filterButtons = [...document.querySelectorAll('[data-filter]')];
    const period = !artists ? periods[new URLSearchParams(location.search).get('period')] : null;
    let category = 'all';
    let currentPage = 1;
    let result = null;
    let busy = false;
    function render() {
        const query = search.value.trim().toLocaleLowerCase('fr');
        const list = result.data.filter(item => {
            const matchesSearch = [item.title, item.artist_title, item.medium_display].join(' ').toLocaleLowerCase('fr').includes(query);
            const type = (item.artwork_type_title || '').toLowerCase();
            const matchesCategory = category === 'all'
                || (category === 'painting' && type.includes('painting'))
                || (category === 'sculpture' && type.includes('sculpture'))
                || (category === 'photography' && type.includes('photograph'));
            const matchesPeriod = !period || (item.date_start != null && period[1](item.date_start));
            return matchesSearch && matchesCategory && matchesPeriod;
        });
        grid.replaceChildren(...list.map((item, index) => artists ? artistCard(item, index) : artworkCard(item, index)));
        if (!list.length) grid.append(node('p', 'collection-message', 'Aucun résultat sur cette page. Modifiez les filtres ou consultez la page suivante.'));
        status.textContent = `${list.length} ${artists ? 'artiste(s)' : 'œuvre(s)'} sur cette page${period ? ' · ' + period[0] : ''}. Recherche et filtres limités à la page chargée.`;
    }
    async function load(page) {
        if (busy) return;
        busy = true;
        previous.disabled = next.disabled = search.disabled = true;
        filterButtons.forEach(button => { button.disabled = true; });
        grid.setAttribute('aria-busy', 'true');
        grid.replaceChildren(node('p', 'collection-message', 'Chargement de la collection…'));
        status.textContent = 'Connexion au musée…';
        try {
            result = await (artists ? getArtistes(page) : getArtworks(page));
            currentPage = page;
            render();
        } catch (error) {
            result = null;
            status.textContent = 'La collection est indisponible.';
            errorState(grid, error, () => load(page));
        } finally {
            busy = false;
            grid.setAttribute('aria-busy', 'false');
            search.disabled = !result;
            filterButtons.forEach(button => { button.disabled = !result; });
            previous.disabled = currentPage <= 1;
            next.disabled = !result || !(result.pagination?.total_pages > currentPage);
            pageLabel.textContent = `Page ${currentPage}${result?.pagination?.total_pages ? ' sur ' + result.pagination.total_pages : ''}`;
        }
    }
    search.addEventListener('input', () => { if (result && !busy) render(); });
    document.querySelector('#search-button').addEventListener('click', () => { if (result && !busy) render(); });
    filterButtons.forEach(button => button.addEventListener('click', () => {
        category = button.dataset.filter;
        filterButtons.forEach(item => {
            item.classList.toggle('active', item === button);
            item.setAttribute('aria-pressed', String(item === button));
        });
        if (result) render();
    }));
    previous.addEventListener('click', () => load(currentPage - 1));
    next.addEventListener('click', () => load(currentPage + 1));
    load(1);
}

const featured = document.querySelector('#featured-artworks');
if (featured) {
    async function loadFeatured() {
        featured.setAttribute('aria-busy', 'true');
        featured.replaceChildren(node('p', 'collection-message', 'Chargement des œuvres…'));
        try {
            const result = await getArtworks(1, 3);
            featured.replaceChildren(...result.data.map(artworkCard));
            if (!result.data.length) featured.append(node('p', 'collection-message', 'Aucune œuvre disponible.'));
            const heroWork = result.data.find(item => item.image_id);
            if (heroWork) {
                const hero = document.querySelector('.hero');
                const image = new Image();
                image.onload = () => { hero.style.backgroundImage = `url("${image.src}")`; };
                image.src = imageUrl(heroWork);
            }
        } catch (error) {
            errorState(featured, error, loadFeatured);
        } finally {
            featured.setAttribute('aria-busy', 'false');
        }
    }
    async function loadPreview() {
        const preview = document.querySelector('#featured-artists');
        preview.replaceChildren(node('p', 'collection-message', 'Chargement des artistes…'));
        try {
            const result = await getArtistes(1, 12);
            preview.replaceChildren(...result.data.slice(0, 3).map((artist, index) => artistCard(artist, index, true)));
            if (!result.data.length) preview.append(node('p', 'collection-message', 'Aucun artiste disponible.'));
        } catch (error) {
            errorState(preview, error, loadPreview);
        }
    }
    loadFeatured();
    loadPreview();
}
