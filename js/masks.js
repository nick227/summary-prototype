const masks = {
    phone: {
      mask: '(999) 999-9999', 
      placeholder: '_', 
    },
    income: { alias: "currency", rightAlign: false }
}

function initializeMasks(keys){
	keys.forEach((key) => {
		if(masks[key]){
			const targetElm = document.getElementById(key);
			Inputmask(masks[key]).mask(targetElm);
		}
	});
}