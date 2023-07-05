
const section = document.querySelector('section');
const formHTML = generateFormHTML(formSections);

section.innerHTML = section.innerHTML + formHTML;

const keys = formSections.map(section => section.sectionId);

setupValidationListeners(keys);

setupFullpage(keys.map(name => name+'-fullpage'));

setupStylePicker();

setupAutoFill();

document.addEventListener('DOMContentLoaded', function() {
  const fields = []
  formSections.forEach((section) => {
    fields.push(...section.fields);
  });

  initializeMasks(fields);


});
