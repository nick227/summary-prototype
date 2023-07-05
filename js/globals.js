const classNames = {
  section: 'section',
  fieldContainer: 'field-container',
  summaryContainer: 'summary-container',
  picsumImage: 'picsum-image',
  fieldValuesList: 'field-values-list',
  fadeOut: 'fade-out',
  fadeIn: 'fade-in',
  summaryList: 'summary-list'
};

const lastSummaryDelay = 2000;
const toasterShowLength = 300550;
let fullpage_api = null;
let toasterTimer = null;
let summaryMinWidth = 145;
let summaryThumbWidth = 100;

const formSections = [
  { title: 'Contact Info', sectionId: 'section1', fields: ['name', 'phone', 'city'], values: ['Nick Rios', '(345) 333-4221', 'Austin'] },
  { title: 'Employment Status', sectionId: 'section2', fields: [/*'dob', 'income', */'employer'], values: [/*'02/27/78', '10 billion', */'NASA'] },
  { title: 'Personal Details', sectionId: 'section0', fields: ['firstName', 'middleName', 'lastName', 'favoriteFood', 'age', 'vacation'], values: ['Dikembe', 'Mutombo', 'Mpolondo', 'Hamburgers', '54', 'Cannes'] },
  { title: 'Physical Location', sectionId: 'section3', fields: ['address', 'zip', 'reference'], values: ['123 Fake Street', '727170', 'Lucky Joe'] },
  { title: 'Lorem Ipsum', sectionId: 'section4', fields: ['lorem', 'ipsum', 'dolor'], values: ['abrac dabra', 'peanut farm', '20 years'] }
];
