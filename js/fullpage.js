function setupFullpage(anchors) {
  fullpage_api = new fullpage('#fullpage', {
    licenseKey: 'gplv3-license',
    verticalCentered: true,
    anchors: anchors,
    normalScrollElements: '.summary-list, .topbar',
    afterSlideLoad: function (section, origin, destination, slideIndex) {
      document.body.classList.toggle('alternate');
    },
    onLeave: function (origin, destination, direction) {
      console.log("direction", direction);
      document.body.classList.toggle('alternate');
      handleScroll(direction);
    }
  });
}

function reloadFullPage() {
  fullpage_api.reBuild();
}