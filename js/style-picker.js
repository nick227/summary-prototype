function setupStylePicker(){
	const selectElm = document.querySelector('#stylePicker');
	selectElm.addEventListener("change", handleStylePickerChange);
	changeStyleSheet(selectElm.options[selectElm.selectedIndex].value);
}

function handleStylePickerChange(event) {
  const selectedValue = parseInt(event.target.value);
  changeStyleSheet(selectedValue);
}

function changeStyleSheet(selectedValue){
  	const styleSheetNames = ['summary-one.css', 'summary-two.css', 'summary-three.css', 'summary-four.css'];
	const selectedStyleSheet = styleSheetNames[selectedValue - 1];
	const head = document.head;
	const existingStyleSheet = document.getElementById('summary-stylesheet');

	if (existingStyleSheet) {
	  head.removeChild(existingStyleSheet);
	}

	const newStyleSheet = document.createElement('link');
	newStyleSheet.setAttribute('rel', 'stylesheet');
	newStyleSheet.setAttribute('href', `./css/${selectedStyleSheet}`);
	newStyleSheet.setAttribute('id', 'summary-stylesheet');

	head.appendChild(newStyleSheet);

}