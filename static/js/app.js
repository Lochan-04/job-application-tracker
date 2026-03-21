document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('[data-live-search-input]');
    const items = document.querySelectorAll('[data-live-search-item]');

    if (!input || !items.length) {
        return;
    }

    input.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();

        items.forEach((item) => {
            const text = (item.dataset.searchText || '').toLowerCase();
            item.classList.toggle('is-hidden', query && !text.includes(query));
        });
    });
});
