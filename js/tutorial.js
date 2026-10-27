function klikk(boks) {
    let apen = boks.dataset.apen !== "true";
    boks.dataset.apen = apen;

    if (apen === true) {
        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `Hvordan spille Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum`;
        }

        if (boks.id === 'keybinds') {
            boks.innerHTML = `Keybinds Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum`;
        }

        boks.classList.remove('lukket_div');
        boks.classList.add('apnet_div');
    } else {

        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `<div class="rounded p-5 text-center">Hvordan spille</div>`;
        }

        if (boks.id === 'keybinds') {
            boks.innerHTML = `<div class="rounded p-5 text-center">Keybinds</div>`;
        }

        boks.classList.remove('apnet_div');
        boks.classList.add('lukket_div');
    }
}

document.querySelectorAll('.col-md-4').forEach((boks) => {
    boks.addEventListener('click', () => klikk(boks));
});