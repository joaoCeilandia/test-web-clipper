chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });

  chrome.tabs.query({
    "currentWindow": true,//Filters tabs in current window
    "status": "complete", //The Page is completely loaded
    "active": true, // The tab or web page is browsed at this state,
    "windowType": "normal" // Filters normal web pages, eliminates g-talk notifications etc
}, function (tabs) {//It returns an array
    for (tab in tabs) {
        $('#url').val(tabs[tab].url); 
        $('#title').val(tabs[tab].title);
        console.log(tab)
        $loader.hide(); 
    }
});