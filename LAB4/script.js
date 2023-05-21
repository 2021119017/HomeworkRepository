fetch('products.json')
    .then( response => {
        if (!response.ok) {
            throw new Error (`HTTP error: ${response.status}`);
        }
        return response.json();
        })
        .then(json => initialize(json))
        .catch(err => console.error(`Fetch problem: ${err.message}`));

function initialize(products) {
    const category = document.querySelector('#category');
    const searchTerm = document.querySelector('#searchTerm');
    const sort = document.querySelector('#sort')
    const searchBtn = document.querySelector('button');
    const main = document.querySelector('main');

    let lastCategory = category.value;
    let lastSearch = '';
    let lastSort = sort.value;

    let categoryGroup;
    let finalGroup;

    finalGroup = products;
    updateDisplay();

    categoryGroup = [];
    finalGroup = [];

    searchBtn.addEventListener('click', selectCategory);

    function selectCategory(event) {
        event.preventDefault();

        categoryGroup = [];
        finalGroup = [];

        if (category.value === lastCategory && searchTerm.value.trim() === lastSearch && sort.value === lastSort) {
            return;
        } else {
            lastCategory = category.value;
            lastSearch = searchTerm.value.trim();
            lastSort = sort.value;

            if (category.value === 'all') {
                categoryGroup = products;
                selectProducts();
            } else {
                const lowerCaseType = category.value.toLowerCase();
                categoryGroup = products.filter(product => product.type === lowerCaseType);
                selectProducts();
            }
        }
    }

    function selectProducts() {
        if (searchTerm.value.trim() === '') {
            finalGroup = categoryGroup;
        } else {
            const lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
            finalGroup = categoryGroup.filter(product => product.name.includes(lowerCaseSearchTerm));
        }
        updateDisplay();
    }


    function updateDisplay() {
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        if (finalGroup.length === 0) {
            const para = document.createElement('p')
            para.textContent = 'No resluts to display!';
            main.appendChild(para);
        } else {
            for (const product of finalGroup) {
                fetchBlob(product);
            }
        }
    }

    function fetchBlob(product) {
        const url = `images/${product.image}`;
        fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.blob();
        })
        .then(blob => showProduct(blob, product))
        .catch(err => console.error(`Fetch problem: ${err.message}`));
    }

    function showProduct(blob, product) {
        const objectURL = URL.createObjectURL(blob);
        const section = document.createElement('section');
        const image = document.createElement('img');

        section.setAttribute('class', product.type);

        image.src = objectURL;
        image.alt = product.name;

        main.appendChild(section);
        section.appendChild(image)

        image.addEventListener('click', () => {
            clickItem(image, product);
        })
        function clickItem(clickedImage, product) {
            const para = document.createElement('p');
            para.innerHTML = `${clickedImage.alt}<br>${product.price}원`;
            clickedImage.parentNode.appendChild(para);
        }

    }

    
}

