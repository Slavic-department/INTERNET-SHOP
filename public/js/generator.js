//#region DATA
let data = {
    "1" : {
        "name" : "Rocher",
        "brand" : "Raffaello",
        "cost" : "130",
        "percent" : "15",
        "src" : "img/item_1.png",
        "available" : "true",
        "sum_rating" : "4",
        "voted" : "3"
    },
    "2" : {
        "name" : "Купальник  n'Buffalo выфвфывыфвыфвыфвыфвф",
        "brand" : "Puma",
        "cost" : "3200",
        "percent" : "15",
        "src" : "img/item_2.png",
        "available" : "false",
        "rating" : "4",
        "voted" : "2"
    },
    "3" : {
        "name" : "Туральник  man'Buffalo",
        "brand" : "Lassie by Reima",
        "cost" : "4000",
        "percent" : "0",
        "src" : "img/item_3.png",
        "available" : "true",
        "rating" : "4",
        "voted" : "5"
    },
    "4" : {
        "name" : "Туральник  man'Buffalo",
        "brand" : "item_4.png",
        "cost" : "4000",
        "percent" : "0",
        "src" : "img/item_4.png",
        "available" : "false",
        "rating" : "4",
        "voted" : "9"
    },
    "5" : {
        "name" : "Туральник  man'Buffalo",
        "brand" : "Lassie by Reima",
        "cost" : "4000",
        "percent" : "0",
        "src" : "img/item_1.png",
        "available" : "true",
        "rating" : "4",
        "voted" : "12"
    }
};
//#endregion

//#region createElement
//Создаем элемент, даем ему класс и если потребуется какой-то текст илл id
let createElement = function(tagName, className,  id, text, brand)
{
  let element = document.createElement(tagName);
  //добавляем классы
  if(className){
    for(let i = 0; i < className.length; i++) 
        element.classList.add(className[i]);
  }
  //добавляем текст
  if(text){
        element.innerText  = text;  
    }
  //добавляем id
  if(id){
    element.id = id;
  }
  //возращаем
  return element;
}
//#endregion

//#region Тут происходит создание элементов, добавление им свойств и текста
let renderCards = function(data, id){
    let listItem = createElement('div', ['col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'item'], id);

    //фотографии
    let img_wr = createElement('div', ['img_wr', 'd-flex', 'justify-content-center']);
        listItem.appendChild(img_wr);
    if(data.available == 'false'){
        var image = createElement('img', ['unavailable_filter']);
    }else{
        var image = createElement('img');
    }
    image.alt = data.name;
    image.src = data.src;
    img_wr.appendChild(image);
   
    if(data.available == 'false'){
        let unavailable = createElement('div', ['unavailable']);
        img_wr.appendChild(unavailable);
        let text = createElement('div', ['text'], false, 'Распродано');
        unavailable.appendChild(text);
    }
    if(data.available == 'true' && data.percent>0){
        let unavailable = createElement('div', ['sale']);
        img_wr.appendChild(unavailable);
        let text = createElement('div', ['text'], false, data.percent + '%');
        unavailable.appendChild(text);
    }

    //Цена и корзина
    let block_price = createElement('div', ['block_price', 'd-flex', 'justify-content-between']);
        listItem.appendChild(block_price);
    let price_wr = createElement('div', ['price_wr']);
        block_price.appendChild(price_wr);
        if(data.percent == 0){
            let price = createElement('span', ['price'], false, (data.cost + ' грн'));
            price_wr.appendChild(price);
        }else{
            let promotional_price = createElement('span', ['promotional_price'], false, data.cost * (data.percent/100) + ' грн');
            price_wr.appendChild(promotional_price);
            let line_through_price = createElement('span', ['line-through_price'], false, data.cost + ' грн');
            price_wr.appendChild(line_through_price);
        }
   

    let btn_basket = createElement('button', ['btn', 'btn-secondary', 'btn-primary'], id, 'В корзину');
        btn_basket.setAttribute('type', 'button');
        btn_basket.onclick = function(){
            toBasket(btn_basket.id);
        }
        block_price.appendChild(btn_basket);

    //Название товара
    let title_wr = createElement('div', ['title_wr']);
        listItem.appendChild(title_wr);
    if(data.brand){
        let title_item = createElement('span', ['font-weight-bold'], false, data.brand + ' • ');
            title_wr.appendChild(title_item);
        let name_item = createElement('span', false, false, data.name);
            title_wr.appendChild(name_item);
    }
    else{
        let name_item = createElement('div',false, false, data.name);
            title_wr.appendChild(name_item);
    }
 
    //Система оценок
    let stars_container = createElement('div', ['stars_container']);
        listItem.appendChild(stars_container);
    for(let i = 1; i < 6; i++){
        let star = createElement('button', ['star', 'far', 'fa-star', 'star_btn']);
        star.setAttribute('value', i);
        star.setAttribute('item_id', id);
        star.onmouseover = function(){
            setRating(star);
        }
        stars_container.appendChild(star);
    }
    let star_rating = createElement('span', ['number_ratings'], false, data.voted);
        stars_container.appendChild(star_rating);
//#endregion

    //Тут мы можем узнать какая оценка была выставлена и какому товару она пренадлежит.
    let setRating = function(star){
        let star_collection = document.querySelectorAll('[item_id = "'+ star.getAttribute('item_id') +'"]');
        let z = star.getAttribute('value') - 1; 
       
            if(star_collection[z].classList.contains('fas')){
                for(let i = 0; i < 5; i++)
                    star_collection[i].classList.remove('fas');

                 for(let i = 0; i < star.getAttribute('value'); i++)
                    star_collection[i].classList.add('fas');

            }else {
                for(let i = 0; i < star.getAttribute('value'); i++)
                    star_collection[i].classList.add('fas');
            }
    }

    console.log(listItem);
    return listItem;

}



//Место, куда будут вылаживаться карточки
let cardList = document.getElementById('items_container');

//Вызываем функцию заполнения карточки информацией
for(let key in data){
    let cardItem = renderCards(data[key], key)
    cardList.appendChild(cardItem)
}

