


     //pegar da tela
     const images = [...document.head.querySelectorAll('meta[property*="image"][content]')].map(meta => meta.content)
     const titles = [...document.head.querySelectorAll('meta[property*="title"][content]')].map(meta => meta.content)
     const descriptions = [...document.head.querySelectorAll('meta[property*="description"][content]')].map(meta => meta.content)
     const urls = [...document.head.querySelectorAll('meta[property*="url"][content]')].map(meta => meta.content)
     const brands = [...document.head.querySelectorAll('meta[property*="brand"][content]')].map(meta => meta.content)
     const prices = [...document.head.querySelectorAll('meta[property*="price:value"][content]')].map(meta => meta.content)
     const currency = [...document.head.querySelectorAll('meta[property*="price:currency"][content]')].map(meta => meta.content)
 
 
     images.forEach(meta => console.log('images', meta))
     titles.forEach(meta => console.log('titles', meta))
     descriptions.forEach(meta => console.log('descriptions', meta))
     urls.forEach(meta => console.log('urls', meta))
     brands.forEach(meta => console.log('brands', meta))
     prices.forEach(meta => console.log('prices', meta))
     currency.forEach(meta => console.log('currency', meta))
 
 
     chrome.storage.local.set({ images });
     chrome.storage.local.set({ titles });
     chrome.storage.local.set({ descriptions });
     chrome.storage.local.set({ urls });
     chrome.storage.local.set({ brands });
     chrome.storage.local.set({ prices });
     chrome.storage.local.set({ currency });
 
 
     const addImage = (imagesToAdd) => {
       let modalImagesDiv = document.getElementById("vobi-product-images");
       if(modalImagesDiv){ 
         imagesToAdd?.forEach(image => {
         let newImg = document.createElement("img");
         newImg.src = image;
         modalImagesDiv.appendChild(newImg);
       })
     }
     }
 
     const addSelectOptions = (optionsToAdd, parentId) => {
       let select = document.getElementById(parentId);
       if(select){ 
         optionsToAdd?.forEach(({ id, name }) => {
         let newOption = document.createElement("option");
         newOption.value = id;
         newOption.innerText = name;
         select.appendChild(newOption);
       })
     }
     }
 
     // ver onde clicou
     const getImageClick = (id) => {
       document.addEventListener('click', function( event ) {
         if(event.target?.src) {
           addImage([event.target?.src]);
           chrome.storage.local.get(["images"], ({ images }) => {
             chrome.storage.local.set({ images: [...images, event.target?.src] });
           });
         };
         console.log(event.target, event.target?.src, id);
       }, { once: true });
     }
 
     const getClick = (id, targetId) => {
       document.addEventListener('click', function( event ) {
         let el = document.getElementById(targetId);
         if(event.target?.innerText && el) el.value = event.target?.innerText;
         console.log(event.target, event.target?.innerText, id);
       }, { once: true });
     }
 
     const addClickListener = (id, targetId, isImage) => {
       const getFunc = isImage ? getImageClick : getClick;
       let el = document.getElementById(id);
       if(el) el.addEventListener('click', () => setTimeout(() => getFunc(id, targetId), 500));
     }
     
     const fillInput = (options, id) => {
       if(options.length) {
         let el = document.getElementById(id);
         if(el) el.value = options[0];
       }
     }
 
     //criar na modal tela
     fetch(chrome.runtime.getURL('/modal/emptyModal.html')).then(r =>  r.text()).then((html) => {
       //insere html da modal
       document.body.insertAdjacentHTML('beforeend', html);
 
       // adiciona campos na modal
 
       addImage(images);
 
       fillInput(titles, "vobi-product-title");
       fillInput(prices, "vobi-product-price");
       fillInput(descriptions, "vobi-product-description");
       fillInput([window.location], "vobi-product-link");
       fillInput(brands, "vobi-product-brand");
 
       chrome.storage.local.get(["refurbishes", "costCenters", "groups", "suppliers"], ({ refurbishes, costCenters, groups, suppliers }) => {
         
         addSelectOptions(refurbishes, 'vobi-project-select');
         addSelectOptions(costCenters, 'vobi-category-select');
         addSelectOptions(groups, 'vobi-group-select');
         addSelectOptions(suppliers, 'vobi-supplier-select');
 
         console.log({ refurbishes, costCenters, groups, suppliers });
       });
       
 
       addClickListener('vobi-get-image', '', true);
       addClickListener('vobi-get-title', "vobi-product-title");
       addClickListener('vobi-get-price', "vobi-product-price");
       addClickListener('vobi-get-description', "vobi-product-description");
 
       //adiciona listeners da modal
       let getClose = document.getElementById("close-sidebar");
 
       getClose.addEventListener("click", async () => {
         let element = document.getElementById("vobi-sidebar")
         element.classList.add("closed");
         chrome.storage.local.set({ open: false });
       });
 
       let getSubmit = document.getElementById("submit-sidebar");
 
       getSubmit.addEventListener("click", async () => {
         //manda msg da pagina pra listener da pagina (content)
         let event = new CustomEvent('submit');
         document.dispatchEvent(event);
       });
     });


     