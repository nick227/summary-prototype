
const summaryTemplates = {
  basic: `
    <div class="${classNames.picsumImage} row">
      <img src="${getRandomImageURL(100, 100)}" alt="Picsum Image">
      <ul class="${classNames.fieldValuesList}"></ul>
    </div>
  `
};

function showSummary(section, sectionFields) {
  const selectedSummaryMode = document.querySelector('input[name="summaryMode"]:checked').value;

  if (selectedSummaryMode === 'none') return;

  const summaryElm = createSummary(sectionFields);
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

function realTimeUpdateSummary(sectionFields){
  console.log("realTimeUpdateSummary", sectionFields);
}

function syncSummary(sectionFields) {
  let summaryList = document.querySelector('.'+classNames.summaryList);
  if (summaryList) {
    
    const summaryElm = createSummary(sectionFields);
    const existingSummaryElm = summaryList.querySelector(`.summary-container[data-section-id="${summaryElm.dataset.sectionId}"]`);

    if (existingSummaryElm) {
      // Update the values in the existing summary container
      const existingFieldValuesList = existingSummaryElm.querySelector(`.${classNames.fieldValuesList}`);
      
      const newFieldValuesList = summaryElm.querySelector(`.${classNames.fieldValuesList}`);

      if (existingFieldValuesList && newFieldValuesList) {
        existingFieldValuesList.innerHTML = newFieldValuesList.innerHTML;
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

function shouldCheckElement(element) {
  return ['P', 'H2', 'LI'].includes(element.tagName);
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

function createSummary(sectionFields) {
  const section = sectionFields[0].closest('.section');
  const summaryContainer = createSummaryContainer(section.id);
  const fieldValuesList = summaryContainer.querySelector('.field-values-list');
  const padding = 10;
  const titlesOnlyMode = document.querySelector('#titlesOnlyOn').checked;
  updateSummaryImage(summaryContainer);
  clearAllToolTips();

  /*
  summaryContainer.style.width = getNewWidth(sectionFields, summaryThumbWidth + padding);
  fieldValuesList.style.width = getNewWidth(sectionFields);
  */

  if (titlesOnlyMode) {
    addTitlesOnly(sectionFields, fieldValuesList, section.id);
  }

  if (fieldValuesList && !titlesOnlyMode) {
    addFieldValues(sectionFields, fieldValuesList);
  }

  attachSummaryEventListeners(summaryContainer);

  return summaryContainer;
}

function addTitlesOnly(sectionFields, fieldValuesList, sectionId) {
  const titleElm = document.createElement('li');
  const summaryElm = document.createElement('li');
  const sectionTitle = formSections.find((o) => o.sectionId === sectionId)?.title;
  titleElm.textContent = sectionTitle;
  summaryElm.textContent = getFieldsSummary(sectionFields);
  fieldValuesList.appendChild(titleElm);
  fieldValuesList.appendChild(summaryElm);
}

function getFieldsSummary(nodeList) {
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


function addFieldValues(sectionFields, fieldValuesList) {
  sectionFields.forEach((field) => {
    const value = field.value;
    const key = field.id;
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${convertCamelCaseToTitleCase(key)}</strong>: ${value}`;
    fieldValuesList.appendChild(listItem);
  });
}

function updateSummaryImage(summaryContainer){
  const img = summaryContainer.querySelector('img');
  img.src = getRandomImageURL(100, 100);
}

function getNewWidth(sectionFields, extraWidth=0){
  const numFields = sectionFields.length;
  const newWidth = numFields < 4 ? summaryMinWidth : numFields < 6 ? summaryMinWidth * 2 : summaryMinWidth * 3;

  return `${extraWidth + newWidth}px`;
}

function createSummaryContainer(sectionId) {
  const summaryContainer = document.createElement('div');
  summaryContainer.classList.add('summary-container');
  summaryContainer.innerHTML = summaryTemplates[sectionId] ? summaryTemplates[sectionId] : summaryTemplates.basic;
  summaryContainer.dataset.sectionId = sectionId;

  return summaryContainer;
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
  console.log("summary", event.target);
  const summaryElm = event.currentTarget;
  const sectionId = summaryElm.dataset.sectionId;
  const styleSheetPickerVal = document.querySelector('#stylePicker').value;
  
  fullpage_api.moveTo(`${sectionId}-fullpage`);
  
  if(parseInt(styleSheetPickerVal) === 3){
    toggleTooltip(summaryElm);
  }
}

function handleSummaryListClick(event){
  console.log("list", event.target);
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

function checkLastSummaryListItem() {
  const sections = Array.from(document.querySelectorAll('.section'));
  const summaryItems = Array.from(document.querySelectorAll('.summary-list > .summary-container'));
  const summaryList = document.querySelector('.summary-list');

  if (sections.length === summaryItems.length) {
    const lastSummaryItem = createLastSummaryItem();
    appendLastSummaryItem(summaryList, lastSummaryItem);
  }
}

function createLastSummaryItem() {
  const div = document.createElement('div');
  div.classList.add('summary-container', 'summary-last');
  div.innerHTML = '<h2>Finished!</h2><p>Click to review all responses.</p>';
  return div;
}

function appendLastSummaryItem(summaryList, lastSummaryItem) {
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
