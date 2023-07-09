
function isInViewport(element) {
  var rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function handlePseudoElementDisplay() {
  var sections = document.querySelectorAll('.section');

  sections.forEach(function(section) {
    var pseudoElement = section.querySelector('::before');
    if (isInViewport(section)) {
      pseudoElement.style.setProperty('display', 'block');
    } else {
      pseudoElement.style.setProperty('display', 'none');
    }
  });
}



function setupBackgrounds(){
window.addEventListener('scroll', handlePseudoElementDisplay);
window.addEventListener('resize', handlePseudoElementDisplay);
window.addEventListener('load', handlePseudoElementDisplay);
}