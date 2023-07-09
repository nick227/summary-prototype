

function handleScroll(direction) {
  const targetElement = document.querySelector('.'+classNames.topbar);
  if (direction === 'down') {
    targetElement.classList.add('mini');
  } else {
    targetElement.classList.remove('mini');
  }
}

function setupTopBar(){
  //using fullpage
  //window.addEventListener('scroll', handleScroll);
}
