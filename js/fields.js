
function allFieldsHaveValues(fields) {
  return Array.from(fields).every((field) => field.value.trim() !== '');
}

function generateFormHTML(sections) {
  return sections
    .map((section) => {
      const { title, sectionId, fields, values } = section;

      const fieldsHTML = fields
        .map((fieldName, index) => {
          const inputId = `${fieldName}`;
          const placeholder = `${fieldName}`;
          const labelText = convertCamelCaseToTitleCase(fieldName);
          const value = values && values[index] ? values[index] : '';
          return `
            <div class="${classNames.fieldContainer}">
              <label for="${inputId}">${labelText}</label>
              <input type="text" id="${inputId}" value="${value}" placeholder="${placeholder}">
            </div>
          `;
        })
        .join('');

      const titleHTML = `<h2>${title}</h2>`;

      return `<div id="${sectionId}" class="${classNames.section}">${titleHTML}${fieldsHTML}</div>`;
    })
    .join('');
}

function setupValidationListeners(sections) {
  document.addEventListener('DOMContentLoaded', () => {
    sections.forEach((sectionId) => {
      setupFieldListeners(sectionId);
    });
  });
}

function setupFieldListeners(sectionId) {
  console.log(" sectionId: ",sectionId)
  const section = document.querySelector(`#${sectionId}`);
  const sectionFields = section.querySelectorAll('input:not(input[type="checkbox"]), select, textarea');
  const sectionTitle = formSections.find(o => o.sectionId === sectionId).title;
  const autofillCheckbox = document.querySelector('#autofillOn');

  let timeoutId;

  sectionFields.forEach((field) => {

    field.addEventListener('input', () => {
      syncSummary(sectionId, sectionFields);
    });

    field.addEventListener('focusout', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (allFieldsHaveValues(sectionFields) && !sectionFieldsActive(sectionFields)) {
          showToast(`All fields in ${sectionTitle} completed.`);
          if(!autofillCheckbox.checked){
              showSummary(section);
          }
        }
      }, 250);
    });

  });
}

function sectionFieldsActive(sectionFields) {
  for (let i = 0; i < sectionFields.length; i++) {
    if (sectionFields[i] === document.activeElement) {
      return true;
    }
  }
  return false;
}

function convertCamelCaseToTitleCase(input) {
  const spacedString = input.replace(/([A-Z])/g, ' $1').toLowerCase();
  const titleCaseString = spacedString.replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());

  return titleCaseString;
}
