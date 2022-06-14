//recebe mensagem da pagina
chrome.runtime.onMessage.addListener(function(message) {
  console.log(message)
  let newMessage = { ...message };
  switch (message?.type) {
    case 'submit':
      let vobiIframe = document.getElementById("vobi-iframe");

      chrome.storage.local.get(["images"], ({ images }) => {
        newMessage['images'] = images;
        vobiIframe.contentWindow.postMessage(newMessage, '*');
      });
      
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
      if(message?.data?.data){
        Object.entries(message?.data?.data).forEach(([key, value]) => {
          chrome.storage.local.set({ [key]: value });
        })
      }
  }
};

chrome.storage.local.get(["user","created", "open"], ({ user, created, open }) => {
  console.log({ user, created, open })
  if(created){
    if(!open) {

    }
    return;
  }
  if(user?.id) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const { id: tabId } = tabs[0];
  
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["modal/modal.js"]
      });
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const { id: tabId } = tabs[0];
  
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["modal/emptyModal.js"]
      });
    });
  }
  chrome.storage.local.set({ open: true });
  chrome.storage.local.set({ created: true });
  //window.close();
  return;
});

