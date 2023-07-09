const classNames = {
  section: 'section',
  fieldContainer: 'field-container',
  summaryContainer: 'summary-container',
  picsumImage: 'picsum-image',
  fieldValuesList: 'field-values-list',
  fadeOut: 'fade-out',
  fadeIn: 'fade-in',
  summaryList: 'summary-list',
  summaryLast: 'summary-last',
  autofillOn: 'autofillOn',
  toggle: 'toggle',
  topbar: 'topbar',
  stats: 'stats',
  confirmCheckbox: 'confirmCheckbox',
  sectionSummaryLastId: 'sectionSummaryLastId',
  lastSummaryFullpage: 'last-summary-fullpage',
  summaryListWrapper: 'summary-list-wrapper'
};

const lastSummaryDelay = 2000;
const toasterShowLength = 3000;
let fullpage_api = null;
let toasterTimer = null;
let summaryMinWidth = 145;
let summaryThumbWidth = 25;
let lastScrollTop = 0;
let currentStats = '0/0 sections complete';

const formSections = [
  { title: 'Contact Info', sectionId: 'section1', fields: ['name', 'phone', 'city'], values: ['Nick Rios', '(345) 333-4221', 'Austin'] },
  { title: 'Employment Status', sectionId: 'section2', fields: [/*'dob', 'income', */'employer'], values: [/*'02/27/78', '10 billion', */'NASA'] },
  { title: 'Personal Details', sectionId: 'section0', fields: ['firstName', 'middleName', 'lastName', 'favoriteFood', 'age'], values: ['Dikembe', 'Mutombo', 'Mpolondo', 'Hamburgers', '54'] },
  { title: 'Physical Location', sectionId: 'section3', fields: ['address', 'zip', 'reference'], values: ['123 Fake Street', '727170', 'Lucky Joe'] },
  { title: 'Lorem Ipsum', sectionId: 'section4', fields: ['lorem', 'ipsum', 'dolor'], values: ['abrac dabra', 'peanut farm', '20 years'] }
];

const summaryTemplates = {
  basic: `
    <div class="${classNames.picsumImage} row">
      <img src="https://source.unsplash.com/random/100x100?sig=7" alt="">
      <ul class="${classNames.fieldValuesList}"></ul>
    </div>
  `,
  sectionSummaryLastId: `<div class="page-summary"><h1>Review</h1>
                       <p>Please take a moment to review the summary of your page results to ensure accuracy and completeness. Your satisfaction is important to us, and we encourage you to verify the information before proceeding.</p>
                       <div class="row"><img src="./images/222.png" alt="Picsum Image">
                       <ul class="${classNames.fieldValuesList}"></ul></div>
                       </div>`
};