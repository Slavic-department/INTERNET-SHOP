//Скрывает указанный блок
function show_hide(element_class) {
  let element = document.getElementById(element_class);

  if(element.classList.contains('on_hide')){
    element.classList.remove('on_hide');
  }else {
    element.classList.add('on_hide');
  } 
}

