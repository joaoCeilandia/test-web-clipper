let getDOM = document.getElementById("tmp-clipboard");

//recebe mensagem da pagina
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(message)
  switch (message?.type) {
    case 'submit':
      let myIframe = document.getElementById("vobi-iframe")
      myIframe.contentWindow.postMessage({type: 'submit', host: 'vobi'}, '*');
      break;
    default:
      if(message?.host === 'vobi'){
        chrome.storage.local.set({ [message.type]: message.data });
      }
  }
});

//recebe a mensagem do iframe
window.onmessage = function(message) {
  if (message?.data?.host === 'vobi') {
      console.log('entrou ',message?.data?.type)
      chrome.storage.local.set({ [message?.data?.type]: message?.data?.data });
  }
};

getDOM.addEventListener("click", async () => {
  const teste = () => {
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


    // ver onde clicou
    document.addEventListener('click', function( event ) {
      console.log(event.target)
    });

    //criar na modal tela
    fetch(chrome.runtime.getURL('/modal.html')).then(r => r.text()).then(html => {
      //insere html da modal
      document.body.insertAdjacentHTML('beforeend', html);

      //adiciona listeners da modal
      let getClose = document.getElementById("close-sidebar");

      getClose.addEventListener("click", async () => {
        let element = document.getElementById("floating-sidebar")
        element.classList.add("closed");
      });

      let getSubmit = document.getElementById("submit-sidebar");

      getSubmit.addEventListener("click", async () => {
        //manda msg da pagina pra listener da pagina (content)
        let event = new CustomEvent('submit');
        document.dispatchEvent(event);
      });
    });
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const { id: tabId } = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: teste
    },
    () => {
      chrome.storage.local.get(["user"], ({ user }) => {
        console.log(user);
      });
    }
    );
  });
});