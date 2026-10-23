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

        boks.style.backgroundColor = "#e8dcb5";
        boks.style.color = "#3a3329";
        boks.style.fontSize = "18px";
        boks.style.padding = "25px";
        boks.style.border = "3px solid #6e8b3d";
        boks.style.lineHeight = "1.4";
        boks.style.textAlign = "left";
    } else {
        boks.style.backgroundColor = "rgb(93, 130, 50)";
        boks.style.color = "black";
        boks.style.fontSize = "29px";
        boks.style.padding = "21px";
        boks.style.border = "2px solid black";
        boks.style.lineHeight = "normal";
        boks.style.textAlign = "center";
        boks.style.fontFamily = "'MinFavorittFont', sans-serif";

        if (boks.id === 'hvordan_spille') {
            boks.innerHTML = `<div class="rounded p-5 text-center" style="border: 1px solid white;">Hvordan spille</div>`;
        }

        if (boks.id === 'keybinds') {
            boks.innerHTML = `<div class="rounded p-5 text-center" style="border: 1px solid white;">Keybinds</div>`;
        }
    }
}

document.querySelectorAll('.col-md-4').forEach((boks) => {
    boks.addEventListener('click', () => klikk(boks));
});