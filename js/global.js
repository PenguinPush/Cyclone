document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("overlay").style.opacity = "0";
});

function copyText() {
    let copyText = document.getElementById("copy-link");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
}