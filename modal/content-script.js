//listener pra mandar evento para a extensao

const getInputValue = (id) => {
    return document.getElementById(id)?.value;
}

window.addEventListener("load", function() {
    chrome.storage.local.set({ open: false });
    chrome.storage.local.set({ created: false });
    console.log("Todos os recursos terminaram o carregamento!");
  });

document.addEventListener("submit", () => {
    const inputKeys = {
        title: 'vobi-product-title', 
        price: 'vobi-product-price', 
        description: 'vobi-product-description', 
        link: 'vobi-product-link', 
        brand: 'vobi-product-brand',
        supplier: 'vobi-supplier-select',
        category:'vobi-category-select',
        group: 'vobi-group-select',
        project: 'vobi-project-select'
    };
    let data = {};
    Object.entries(inputKeys).forEach(([key, id]) => {
        data[key] = getInputValue(id);
    })
    data.addToLibrary = document.getElementById('vobi-add-to-library')?.checked;
    chrome.runtime.sendMessage({ type: 'submit', host: 'vobi', data });
});