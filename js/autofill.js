function setupAutoFill() {
  const autofillCheckbox = document.querySelector('#autofillOn');
  updatePageAutoFill(autofillCheckbox);

  autofillCheckbox.addEventListener('change', function () {
  	updatePageAutoFill(autofillCheckbox);
  });
}

function updatePageAutoFill(autofillCheckbox){

    const isAutofillChecked = autofillCheckbox.checked;

    if (isAutofillChecked) {
    	updateAutoFillConfirm();
    }

    for (const section of formSections) {
      for (const field of section.fields) {
        const inputField = document.getElementById(field);

        if (isAutofillChecked) {
          const valueIndex = section.fields.indexOf(field);
          const fieldValue = section.values[valueIndex];

          if (fieldValue && inputField.value === '') {
            inputField.value = fieldValue;
          }
        } else {
          inputField.value = '';
        }
      }
    }
}

function updateAutoFillConfirm() {
  for (const section of formSections) {
    const sectionId = section.sectionId;
    const sectionFields = section.fields;
    const lastFieldId = sectionFields[sectionFields.length - 1];
    const lastField = document.getElementById(lastFieldId);
    const targetElm = lastField.parentNode;
    const checkId = sectionId + '-confirm';

    const confirmContainer = document.createElement('label');
    confirmContainer.className = 'confirm-container';
    confirmContainer.setAttribute('for', checkId);
    const confirmText = document.createElement('span');
    confirmText.textContent = 'confirm';

    const confirmCheckbox = document.createElement('input');
    confirmCheckbox.type = 'checkbox';
    confirmCheckbox.id = checkId;
    confirmCheckbox.className = classNames.confirmCheckbox;
    confirmCheckbox.dataset.sectionId = sectionId;
    confirmCheckbox.addEventListener("change", function(){
    	handleAutofillConfirm(sectionId, event.target);
    });

    confirmContainer.appendChild(confirmText);
    confirmContainer.appendChild(confirmCheckbox);

    targetElm.insertAdjacentElement('afterend', confirmContainer);
  }
}

function handleAutofillConfirm(sectionId, checkboxElm){
    const isConfirmChecked = checkboxElm.checked;
    const section = document.querySelector(`#${sectionId}`);
    if(isConfirmChecked){
      showSummary(section);
      updateStatsInfo();
    	checkboxElm.blur();
    	fullpage_api.moveSectionDown();
    } else {
      removeSummary(section);
    }
}
