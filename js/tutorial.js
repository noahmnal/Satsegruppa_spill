function klikk(boks) {
    boks.innerHTML = 'Lorem Ipsum ...';
    boks.style.backgroundColor = "gray";
}

document.querySelectorAll('.col-md-4').forEach((boks) => {
    boks.addEventListener('click', () => klikk(boks));
});