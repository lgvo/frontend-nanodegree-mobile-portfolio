// add the no-critical CSS to render after the page loads
(function() {
    var addResources = function() {
        var h = document.getElementsByTagName('head')[0];
        var ss = window.document.createElement('link');
        ss.rel = 'stylesheet';
        ss.href = 'css/style.min.css';
        h.appendChild(ss);
    };

    if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) != -1) {
        addResources();
    } else {
        window.onload(addResources);
    }
})();