function showToast(message) {
  const toasterOn = document.querySelector('#toasterOn');

  if (!toasterOn.checked) {
    return;
  }

  const mockImages = ['111.jpg', '222.png', '333.png'];
  const randomImg = './images/' + mockImages[Math.floor(Math.random() * mockImages.length)];

  const toast = document.getElementById('toast');
  const p = toast.querySelector('p');
  const img = toast.querySelector('img');

  img.src = randomImg;
  p.textContent = message;
  toast.style.display = 'block';
  toast.classList.remove(classNames.fadeOut);

  if (toasterTimer) {
    clearTimeout(toasterTimer);
  }

  toasterTimer = setTimeout(function() {
    toast.classList.add(classNames.fadeOut);
  }, toasterShowLength);
}