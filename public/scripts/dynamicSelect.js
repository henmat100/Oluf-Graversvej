HTMLElement.prototype.clear = function () {
    while(this.firstChild) {
        this.removeChild(this.firstChild);
    }
    return this;
};

//Her bygger vi en dropdownlisten
const buildCategoryList = function (data, entity, id) {
	let select = document.createElement('select');
	select.setAttribute('name', entity);
	let defaultOption = document.createElement('option');
	defaultOption.setAttribute('value', '');
	defaultOption.textContent = 'Vælg'
	select.appendChild(defaultOption);
	data.forEach(element => {
		let option = document.createElement('option');
		option.setAttribute('value', element.id);
		if (element.id == id) {
			option.setAttribute('selected', '');
		}
		option.textContent = element.name;
		select.appendChild(option);

	});
	return select;
};

//Her indsætter vi databasen
const getList = function (type,entity) {
	fetch(`http://localhost:3010/api/${type}`)
      .then(response => response.json())
      .then(data => { 
        
        document.querySelectorAll( '.' + entity).forEach(element => {
			let id = element.dataset['id'];
            element.clear()
			element.appendChild(buildCategoryList(data, entity, id));
		});
	});
};

//Her vælger vi fra et API, og indsætter et valgt html element (id)
getList('categories', 'categoryUpdate');
getList('roles', 'roleUpdate');


	
