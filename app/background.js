chrome.app.runtime.onLaunched.addListener(function(){
  chrome.app.window.create('login.html', {
    'width': 260,
    'height': 500,
  });
});