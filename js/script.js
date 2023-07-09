
document.addEventListener('DOMContentLoaded', start);

function start(){

  const sections = createSections();

  setupFullpage(sections.keys.map(name => name+'-fullpage'));

  setupValidationListeners(sections.keys);

  initializeMasks(sections.fields);

  setupStylePicker();

  setupAutoFill();

  setupInlineEdit();

  setupTopBar();

}


function createSections(){

  const section = document.querySelector('section');
  const formHTML = generateFormHTML(formSections);
  const fields = [];
  formSections.forEach((section) => {
    fields.push(...section.fields);
  });

  section.innerHTML = section.innerHTML + formHTML;

  const keys = formSections.map(section => section.sectionId);

  return { keys: keys, fields: fields };

}