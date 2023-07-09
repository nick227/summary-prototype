function makeEditable(liElement) {
  var span = liElement.querySelector('span');
  var textNode = span.nextSibling;
console.log("span", span);
console.log("textNode", textNode);
//  textNode.addEventListener('dblclick', function() {
    var currentValue = textNode.nodeValue.trim();

    // Create an input element
    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentValue;

    // Replace the text node with the input element
    liElement.replaceChild(input, textNode);

    input.addEventListener('blur', function() {
      var newValue = input.value.trim();

      // Call reverseUpdateFields if the value has changed
      if (newValue !== currentValue) {
        var name = span.textContent.trim();
        reverseUpdateFields(name, newValue);
        span.textContent = name; // Update the span text with the new value
      }

      // Replace the input element with the original text node
      liElement.replaceChild(textNode, input);
    });

    input.focus();
  //});
}

// The reverseUpdateFields function
function reverseUpdateFields(name, value) {
  console.log('Name:', name);
  console.log('Value:', value);
}

function setupInlineEdit() {
  document.addEventListener('dblclick', function(event) {
    console.log("clickck", event.target.tagName, event.target.closest('.page-summary'));
    if (event.target.tagName === 'LI' && event.target.closest('.page-summary')) {
      console.log("here go");
      makeEditable(event.target);
    }
  });
}
