
function removeSummary(section) {
  const item = document.querySelector(`div[data-section-id="${section.id}"]`);
  const lastItem = document.querySelector('.'+classNames.summaryLast);
  item.remove();
  if(lastItem){
      lastItem.remove();
  }
}

function showSummary(section, className='') {
  const sectionFields = section.querySelectorAll('input, select, textarea');
  const selectedSummaryMode = document.querySelector('input[name="summaryMode"]:checked').value;

  if (selectedSummaryMode === 'none') return;

  const summaryElm = createSummary(section.id, sectionFields);
  summaryElm.classList.add(selectedSummaryMode);

  if (selectedSummaryMode === 'center') {
    hideVisibleFields(section);
    addCenterSummary(section, summaryElm);
  }

  if (selectedSummaryMode === 'left') {
    addLeftSummary(summaryElm);
  }

  if (selectedSummaryMode === 'log') {
    addLogSummary(summaryElm);
  }
}

function addLeftSummary(summaryElm) {
  let summaryList = document.querySelector('.summary-list');
  if (!summaryList) {
    summaryList = document.createElement('div');
    summaryList.classList.add('summary-list');
    summaryList.addEventListener("click", handleSummaryListClick);
    document.body.appendChild(summaryList);
  }
  upsertSummaryItem(summaryList, summaryElm);
  checkLastSummaryListItem();
}

function addCenterSummary(section, summaryElm) {
  section.appendChild(summaryElm);
}

function upsertSummaryItem(summaryList, summaryElm) {
  const existingSummaryElm = summaryList.querySelector(`.summary-container[data-section-id="${summaryElm.dataset.sectionId}"]`);

  if (existingSummaryElm) {
    updateExistingElement(existingSummaryElm, summaryElm);
  } else {
    const sectionId = summaryElm.dataset.sectionId;
    const sectionIndex = formSections.findIndex(section => section.sectionId === sectionId);

    // Find the appropriate position based on sectionIndex
    let insertIndex = -1;
    for (let i = 0; i < summaryList.children.length; i++) {
      const child = summaryList.children[i];
      const childSectionId = child.dataset.sectionId;
      const childSectionIndex = formSections.findIndex(section => section.sectionId === childSectionId);

      if (sectionIndex < childSectionIndex) {
        insertIndex = i;
        break;
      }
    }

    if (insertIndex !== -1) {
      summaryList.insertBefore(summaryElm, summaryList.children[insertIndex]);
    } else {
      summaryList.appendChild(summaryElm);
    }
  }
}


function updateExistingElement(existingElm, newElm) {
  if (existingElm.tagName !== newElm.tagName) return;

  if (shouldCheckElement(existingElm) && existingElm.textContent !== newElm.textContent) {
    existingElm.textContent = newElm.textContent;
  }

  const existingChildNodes = existingElm.childNodes;
  const newChildNodes = newElm.childNodes;

  for (let i = 0; i < Math.min(existingChildNodes.length, newChildNodes.length); i++) {
    const existingChildNode = existingChildNodes[i];
    const newChildNode = newChildNodes[i];

    if (existingChildNode.nodeType === Node.ELEMENT_NODE && newChildNode.nodeType === Node.ELEMENT_NODE) {
      updateExistingElement(existingChildNode, newChildNode);
    }
  }
}

function syncSummary(sectionId, sectionFields) {
  const section = document.getElementById(sectionId);
  const summaryList = document.querySelector('.'+classNames.summaryList);
  const sectionSummaryLastIdElm = document.querySelector('.section-summary-last');
console.log("  sync", sectionSummaryLastIdElm)
  if(sectionSummaryLastIdElm){
    console.log("  okkkkay", sectionSummaryLastIdElm)
    updateLastSummarySection();
  }

  if (summaryList) {
    const existingSummaryElm = summaryList.querySelector(`.summary-container[data-section-id="${sectionId}"]`);
    if (existingSummaryElm) {
      const existingFieldValuesList = existingSummaryElm.querySelector(`.${classNames.fieldValuesList}`);
      if (existingFieldValuesList) {
          const sectionTitle = getSummaryTitle(sectionId);
          const fieldsCommaList = createFieldCommaList(sectionFields);
          existingFieldValuesList.innerHTML = '';
          existingFieldValuesList.appendChild(makeLiElm(sectionTitle, 'title'));
          existingFieldValuesList.appendChild(makeLiElm(fieldsCommaList));

      }
    }
  }
}

function getTextContentRecursively(element) {
  let text = '';

  if (element.nodeType === Node.TEXT_NODE) {
    text += element.textContent.trim();
  } else if (element.nodeType === Node.ELEMENT_NODE && shouldCheckElement(element)) {
    text += element.textContent.trim();
    for (let child of element.childNodes) {
      text += getTextContentRecursively(child);
    }
  }

  return text;
}

function setTextContentRecursively(element, text) {
  if (element.nodeType === Node.TEXT_NODE) {
    element.textContent = text;
  } else if (element.nodeType === Node.ELEMENT_NODE && shouldCheckElement(element)) {
    element.textContent = text;
    for (let child of element.childNodes) {
      setTextContentRecursively(child, text);
    }
  }
}

function shouldCheckElement(element) {
  return ['P', 'H2', 'LI'].includes(element.tagName);
}

function addFieldValues(sectionFields, fieldValuesList, sectionId, mode="mini") {

  if(mode === 'mini'){
      const sectionTitle = getSummaryTitle(sectionId);
      const fieldsCommaList = createFieldCommaList(sectionFields);

      fieldValuesList.appendChild(makeLiElm(sectionTitle, 'title'));
      fieldValuesList.appendChild(makeLiElm(fieldsCommaList));
  }
  

  if(mode === 'list'){
    sectionFields.forEach((field) => {
      const value = field.value;
      const key = field.id;
      const listItem = document.createElement('li');
      listItem.innerHTML = `<span>${convertCamelCaseToTitleCase(key)}</span>: ${value}`;
      fieldValuesList.appendChild(listItem);
    });
  }
}

function createFieldCommaList(sectionFields) {
  let fieldsCommaList = Array.from(sectionFields)
      .filter(field => field.type !== 'checkbox' )
      .map(field => field.value)
      .join(', ');

  return fieldsCommaList
}

function makeLiElm(value, className='item'){
  const res = document.createElement('li');
  res.className = className;
  res.innerHTML = value;
  return res;
}

function addTitlesOnly(sectionFields, fieldValuesList, sectionId) {
  const titleElm = document.createElement('li');
  const summaryElm = document.createElement('li');
  const sectionTitle = getSummaryTitle(sectionId);
  titleElm.textContent = sectionTitle;
  summaryElm.textContent = getFieldsDigest(sectionFields);
  fieldValuesList.appendChild(titleElm);
  fieldValuesList.appendChild(summaryElm);
}

function getSummaryTitle(sectionId){
  return formSections.find((o) => o.sectionId === sectionId)?.title;
}

function getFieldsDigest(nodeList) {
  const summary = {
    inputs: 0,
    selects: 0,
    textareas: 0
  };

  for (let i = 0; i < nodeList.length; i++) {
    const element = nodeList[i];
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
      summary.inputs++;
    }
  }

  const summaryString = `${summary.inputs} fields`;
  return summaryString;
}

function updateSummaryImage(summaryContainer, width, height){
  const img = summaryContainer.querySelector('img');
  img.src = getRandomImageURL(width, height);
}

function getNewWidth(sectionFields, extraWidth=0){
  const numFields = sectionFields.length;
  const newWidth = numFields < 4 ? summaryMinWidth : numFields < 6 ? summaryMinWidth * 2 : summaryMinWidth * 3;

  return `${extraWidth + newWidth}px`;
}

function createSummaryContainer(sectionId) {
  const summaryContainer = document.createElement('div');
  const section = document.getElementById(sectionId);
  summaryContainer.className = isCheckedConfirmCheckbox(section) ? 'confirmed' : '';
  summaryContainer.classList.add('summary-container');
  summaryContainer.innerHTML = summaryTemplates[sectionId] ? summaryTemplates[sectionId] : summaryTemplates.basic;
  summaryContainer.dataset.sectionId = sectionId;

  return summaryContainer;
}

function isCheckedConfirmCheckbox(section) {
  return section && section.querySelector('.confirmCheckbox:checked') !== null;
}

function attachSummaryEventListeners(summaryContainer) {
  summaryContainer.addEventListener('click', handleSummaryClick);
  summaryContainer.addEventListener('focusin', handleSummaryClick);
}

function handleSummaryClick(event) {
  const positionLeftCheck = event.currentTarget.classList.contains('left');
  
  if (!positionLeftCheck) {
    handleCenterSummaryClick(event);
  }
  if (positionLeftCheck) {
    handleLeftSummaryClick(event);
  }
}

function handleLeftSummaryClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  const summaryElm = event.currentTarget;
  const sectionId = summaryElm.dataset.sectionId;
  const styleSheetPickerVal = document.querySelector('#stylePicker').value;
  
  fullpage_api.moveTo(`${sectionId}-fullpage`);
  
  if(parseInt(styleSheetPickerVal) === 3){
    toggleTooltip(summaryElm);
  }
}

function handleSummaryListClick(event){
  event.preventDefault();
  event.stopPropagation();
  event.currentTarget.classList.toggle('minimized');
}

function toggleTooltip(element) {
  const tooltip = element.querySelector('.tooltip');
  element.classList.toggle('active');
  if (tooltip) {
    tooltip.remove();
  } else {
    const tooltipHTML = createTooltip(element);
    clearAllToolTips();
    element.insertAdjacentHTML('beforeend', tooltipHTML);
  }
}

function clearAllToolTips(){
  const tooltips = document.querySelectorAll('.tooltip');
  tooltips.forEach((tooltip) => {
    tooltip.remove();
  });
}

function createTooltip(element) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  const newElm = element.querySelector('ul').cloneNode(true);
  newElm.style.display = 'block';
  tooltip.appendChild(newElm);
  return tooltip.outerHTML;
}


function handleCenterSummaryClick(event) {
  const section = event.currentTarget.closest('.section');
  showHiddenFields(section);
  event.currentTarget.remove();
}

function createSummary(sectionId, sectionFields, last=false, width=100, height=100) {
  const summaryContainer = createSummaryContainer(sectionId);
  const fieldValuesList = summaryContainer.querySelector('.field-values-list');
  const padding = 10;
  const titlesOnlyMode = document.querySelector('#titlesOnlyOn').checked;
  clearAllToolTips();

  if (titlesOnlyMode) {
    addTitlesOnly(sectionFields, fieldValuesList, sectionId);
  }

  if (fieldValuesList && !titlesOnlyMode) {
    const mode = last ? 'list' : 'mini';
    addFieldValues(sectionFields, fieldValuesList, sectionId, mode);
  }
  if(!last){
    updateSummaryImage(summaryContainer, width, height);
    attachSummaryEventListeners(summaryContainer);
  }

  return summaryContainer;
}

function updateLastSummarySection(){
  const sectionFields = document.querySelectorAll('.section input:not(input[type="checkbox"]), .section select, .section textarea');
  const fieldValuesListElm = document.querySelector('.section-summary-last .'+classNames.fieldValuesList);
  console.log("  fieldValuesListElm",fieldValuesListElm)
  fieldValuesListElm.innerHTML = '';
  addFieldValues(sectionFields, fieldValuesListElm, classNames.sectionSummaryLastId, 'list');
}

function appendLastSummarySection(){
  const existsCheck = document.querySelector('.section-summary-last');
  if(existsCheck){
    return;
  }
  const sectionFields = document.querySelectorAll('.section input:not(input[type="checkbox"]), .section select, .section textarea');
  const summaryElm = createSummary(classNames.sectionSummaryLastId, sectionFields, true);
  summaryElm.dataset.anchor = 'last-summary-fullpage';
  const wrapper = document.querySelector('#fullpage'); 
  summaryElm.classList.add('section-summary-last', 'section');
  summaryElm.classList.remove('summary-container');
  
  wrapper.appendChild(summaryElm);
  reloadFullPage();
  setTimeout(() => {
      fullpage_api.moveSectionDown();
  }, 250);
}

function checkLastSummaryListItem() {
  const sections = Array.from(document.querySelectorAll('.section'));
  const summaryItems = Array.from(document.querySelectorAll('.summary-list > .summary-container'));
    
  if (sections.length === summaryItems.length) {
    appendLastSummaryItem();
    appendLastSummarySection();
  }
}

function createLastSummaryItem() {
  const div = document.createElement('div');
  div.classList.add('summary-container', 'summary-last');
  div.innerHTML = '<h2>Finished</h2><p>Click here to review answers.</p>';
  div.addEventListener('click', function(){
      fullpage_api.moveTo(`last-summary-fullpage`);
  });
  return div;
}

function appendLastSummaryItem() {
  const summaryList = document.querySelector('.summary-list');
  const lastSummaryItem = createLastSummaryItem();
  setTimeout(() => {
    summaryList.appendChild(lastSummaryItem);
  }, 0);
}

function showHiddenFields(section) {
  const fields = section.querySelectorAll('.field-container');
  fields.forEach((container) => {
    container.classList.remove('fade-out');
  });
}

function hideVisibleFields(section) {
  const fields = section.querySelectorAll('.field-container');
  fields.forEach((container) => {
    container.classList.add('fade-out');
  });
}

function getRandomImageURL(width, height) {
  const randomNum = Math.floor(Math.random() * 1000);
  const timestamp = Date.now();
  return `https://source.unsplash.com/random/${width}x${height}?sig=${randomNum}`;
}

function clearSummaries() {
  const summaryList = document.querySelector('.summary-list');
  if (summaryList) {
    summaryList.remove();
  } else {
    const inputs = document.querySelectorAll('.field-container');
    inputs.forEach((elm) => {
      elm.classList.remove('fade-out');
    });
    const summaryContainers = document.querySelectorAll('.summary-container');
    summaryContainers.forEach((elm) => {
      elm.remove();
    });
  }
}
