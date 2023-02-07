const list = document.getElementById('list');
const desc = document.getElementById('desc');
const mas = []

function getMas(item) {  //получение массива отображаемых элементов в списке
    mas.push(item)
}

function clearListnDesk() {  //очистка элементов list и desk
    list.innerHTML = ''
    desc.innerHTML = ''
}

function changeCount() {  //функция, реагирующая на событие onClick у кнопки ChangeCount и изменяющая количество отображаемых элементов в списке
    let count = parseInt(document.getElementById(`changecount_input`).value)
    if (!isNaN(count)) {
        clearListnDesk()
        getElem(count)
        mas.length = 0
        document.getElementById(`changecount_input`).value = ''
    }
    else {
        alert('Введите целое число')
        document.getElementById(`changecount_input`).value = ''
    }
}

function sort() {  //функция, реагирующая на событие onClick у кнопки Sort и передающая значение select элемента для дальнейшей обработки в функии sortPrice или sortRating
    let selectValue = document.getElementById('sortelem_select').value
    if (selectValue == 0 || selectValue == 1) {
        sortRating(selectValue)
    }
    else if (selectValue == 2 || selectValue == 3) {
        sortPrice(selectValue)
    }
    else {
        alert('Укажите параметры сортировки')
    }
}

function sortPrice(selectValue) {  //функция сортирующая элементы по цене
    clearListnDesk()
    if (selectValue == 2) {
        mas.sort(function (a, b) {
            return a.price - b.price
        })
    }
    else {
        mas.sort(function (a, b) {
            return b.price - a.price
        })
    }
    mas.forEach(function (item, i) {
        renderList(item, i)
    });
}

function sortRating(selectValue) {  //функция сортирующая элементы по рейтингу
    console.log(selectValue)
    clearListnDesk()
    if (selectValue == 0) {
        mas.sort(function (a, b) {
            return a.rating - b.rating
        })
    }
    else {
        mas.sort(function (a, b) {
            return b.rating - a.rating
        })
    }
    mas.forEach(function (item, i) {
        renderList(item, i)
    });
}

function dragnDrop() {  //реализация перетаскивания элементов
    const listElement = document.getElementById(`list`);
    const elements = listElement.querySelectorAll(`.title`);

    for (const task of elements) {
        task.draggable = true;
    }

    listElement.addEventListener(`dragstart`, (evt) => {
        evt.target.classList.add(`selected`);
    });

    listElement.addEventListener(`dragend`, (evt) => {
        evt.target.classList.remove(`selected`);
    });

    const getNextElement = (cursorPosition, currentElement) => {
        const currentElementCoord = currentElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

        const nextElement = (cursorPosition < currentElementCenter) ?
            currentElement :
            currentElement.nextElementSibling;

        return nextElement;
    };

    listElement.addEventListener(`dragover`, (evt) => {
        evt.preventDefault();

        const activeElement = listElement.querySelector(`.selected`);
        const currentElement = evt.target;
        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains(`title`);

        if (!isMoveable) {
            return;
        }

        const nextElement = getNextElement(evt.clientY, currentElement);

        if (
            nextElement &&
            activeElement === nextElement.previousElementSibling ||
            activeElement === nextElement
        ) {
            return;
        }

        listElement.insertBefore(activeElement, nextElement);
    });

}

function createNode(element) {  //создание html-элемента
    return document.createElement(element);
}

function append(parent, el) {  //добавление элемента в блок-родитель
    return parent.appendChild(el);
}

function addClass(element) { //добавление класса элементу
    return element.classList.add("title");
}

function addId(element, id) {  //присвоение Id элементу
    return element.setAttribute('id', `${id}`);
}

function addStyle(divElemList, idElemDesc) {  //добавление стилей и методов списку элементов и их описанию
    const elemList = document.getElementById(`${divElemList}`)
    const elemDesk = document.getElementById(`${idElemDesc}`)
    elemList.style.maxWidth = '227px'
    elemList.style.textAlign = 'center'
    elemDesk.style.display = 'none'
    elemList.addEventListener('mouseenter', () => {
        elemDesk.style.display = 'flex', elemDesk.style.flexDirection = 'column',
            elemDesk.style.border = '2px solid gray', elemDesk.style.backgroundColor = '#87CEFA',
            elemDesk.style.width = '100%', elemDesk.style.height = '93.5%',
            elemList.style.backgroundColor = '#87CEFA'
    })
    elemList.addEventListener('mouseleave', () => {
        elemDesk.style.display = 'none', elemList.style.backgroundColor = 'white'
    })
}

function renderList(item, i) {  //рендер списка названий элементов и описание элементов
    const divElemList = createNode('div');
    const divElemDesc = createNode('div');
    const idElemDesc = `${i}_desc`
    const idElemList = `${i}_title`
    divElemList.innerHTML = `<h3>${item.title}</h3>`;
    divElemDesc.innerHTML =
        `<div class="desc_text">
           <h2>${item.title}</h2><br>
           <p>Description: ${item.description}</p><br>
           <p>Price: ${item.price}</p><br>
           <p>Discount percentage: ${item.discountPercentage}</p><br>
           <p>Raiting: ${item.rating}</p><br>
           <p>Stock: ${item.stock}</p><br>
           <p>Brand: ${item.brand}</p><br>
           <p>Category: ${item.category}</p><br>
         </div>
         <img id="${i}img" src="${item.thumbnail}" alt="" class="desc_img">`
    append(list, divElemList)
    append(desc, divElemDesc)
    addClass(divElemList)
    addId(divElemList, idElemList)
    addId(divElemDesc, idElemDesc)
    addStyle(idElemList, idElemDesc)
    dragnDrop()
}

function getElem(count) {  // получение элементов с fake api
    for (let i = 1; i <= count; i++) {

        let url = `https://dummyjson.com/products/${i}`;

        fetch(url)
            .then((resp) => resp.json())
            .then(function (data) {
                const mas = []
                let items = data;
                mas.push(items)
                return mas.map(function (item) {
                    renderList(item, i)
                    getMas(item)
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}


getElem(10)






