function setupFullpage(anchors) {
  fullpage_api = new fullpage('#fullpage', {
    licenseKey: 'gplv3-license',
    verticalCentered: true, 
    anchors: anchors, 
    normalScrollElements: '.summary-list, .topbar',
    afterSlideLoad: function () {
      document.body.classList.toggle('alternate');
    },
    onSlideLeave: function () {
      document.body.classList.toggle('alternate');
    }
  });
}

function reloadFullPage() {
  fullpage_api.reBuild();
}