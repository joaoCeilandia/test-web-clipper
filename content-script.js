//listener pra mandar evento para a extensao

document.addEventListener("submit", function(data) {
    chrome.runtime.sendMessage({ type: 'submit', host: 'vobi'});
});