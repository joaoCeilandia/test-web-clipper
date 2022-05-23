let getDOM = document.getElementById("tmp-clipboard");

function getCookies(domain, name, callback) {
  chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
      if(callback) {
          callback(cookie.value);
      }
  });
}

getDOM.addEventListener("click", async () => {
  const teste = () => {
    //pegar da tela
    const images = [...document.head.querySelectorAll('meta[property*="image"][content]')].map(meta => meta.content)
    const titles = [...document.head.querySelectorAll('meta[property*="title"][content]')].map(meta => meta.content)
    const descriptions = [...document.head.querySelectorAll('meta[property*="description"][content]')].map(meta => meta.content)
    const urls = [...document.head.querySelectorAll('meta[property*="url"][content]')].map(meta => meta.content)
    const brands = [...document.head.querySelectorAll('meta[property*="brand"][content]')].map(meta => meta.content)
    const prices = document.head.querySelectorAll('meta[property*="price"][content]')


    images.forEach(meta => console.log('images', meta))
    titles.forEach(meta => console.log('titles', meta))
    descriptions.forEach(meta => console.log('descriptions', meta))
    urls.forEach(meta => console.log('urls', meta))
    brands.forEach(meta => console.log('brands', meta))
    prices.forEach(meta => console.log('prices', meta))

    chrome.storage.sync.set({ images });
    chrome.storage.sync.set({ titles });
    chrome.storage.sync.set({ descriptions });
    chrome.storage.sync.set({ urls });
    chrome.storage.sync.set({ brands });
    chrome.storage.sync.set({ prices });

    const bodyPrices = document.body.querySelectorAll('[class*=price]')

    // ver onde clicou
    document.addEventListener('click', function( event ) {
      console.log(event.target)
    });

    //criar na tela
    var div=document.createElement("div");
    document.body.appendChild(div);
    div.innerText="test123";
    fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      // not using innerHTML as it would break js event listeners of the page
    });

  }
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { id: tabId } = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: teste,
    },
    () => {
      chrome.storage.sync.get(["myVariable"], ({ myVariable }) => {
        console.log('qqq22 ' + myVariable);
      });
    }
    );
  });
});