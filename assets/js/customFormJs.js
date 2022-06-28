{ // Drop Down Selector
function createDropDownItemListener(c,val,editable){
  k = document.createElement("C");
  k.innerHTML = val;
  c.appendChild(k);
  if(editable){ // add x if editable
    f = document.createElement("I");
    f.setAttribute("class", "fa-solid fa-xmark selectX");
    c.appendChild(f)
    f.addEventListener("click", function(e) {
      e.stopPropagation();
      if(this.parentNode.classList.contains("same-as-selected")){this.parentNode.parentNode.previousSibling.innerHTML="Select a Default"}
      this.parentNode.remove()
    });
  }
  c.editable = editable
  c.addEventListener("click", function(e) {
    /* When an item is clicked, update the original select box,
    and the selected item: */
    var y, k, h, yl;

    h = this.parentNode.previousSibling;
    innerhtmltext = this.getElementsByTagName("c")[0].innerHTML
    if(e.currentTarget.editable) innerhtmltext+="  - DEFAULT"
    h.innerHTML = innerhtmltext;
    y = this.parentNode.getElementsByClassName("same-as-selected");
    yl = y.length;
    for (k = 0; k < yl; k++) {
      y[k].removeAttribute("class");
    }
    this.setAttribute("class", "same-as-selected");
    h.click(); // click select box and to collaspe input

  });
}

function createDropDown(flexContainer,entries,editable,Title="Title"){

  var inBox
  if(editable){
    inBox = document.createElement("input");
    inBox.setAttribute("class","FormTitle"); inBox.setAttribute("placeholder",Title); inBox.setAttribute("type","text");
  }else{
    inBox = document.createElement("p");
    inBox.setAttribute("class","FormTitle");
    inBox.innerHTML = Title
  }

  flexContainer.appendChild(inBox)
  
  dom = document.createElement("DIV");
  dom.setAttribute("class", "customDropDown");

  flexContainer.appendChild(dom);


  if(editable){
    exitBtn =  document.createElement("i"); // exit button
    exitBtn.setAttribute("class","fa fa-minus-circle removebtn")
    dom.parentNode.appendChild(exitBtn)
    exitBtn.addEventListener("click", function(e) {
      this.parentNode.remove()
    })
  }

  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  if(entries.length == 0){
    a.innerHTML = "Add Selections"
  }
  dom.appendChild(a);

  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  
  
  for(i=0; i<entries.length; ++i){
    c = document.createElement("DIV");
    createDropDownItemListener(c,entries[i],editable);
    b.appendChild(c);
  }
  
  if(editable){
    i = document.createElement("section");
    i1 = document.createElement("input")
    i1.setAttribute("type", "text");
    i1.setAttribute("placeholder", "Add To List");
    $(i1).bind("keypress", function(event) {
      if(event.which == 13) {
      event.preventDefault();
          $(this).next().click()
      }
    });

    i2 = document.createElement("btn")
    i2.setAttribute("class", "inlinebtn");
    i2.innerHTML = "Add"
    i2.addEventListener("click", function(e) {
      if(this.previousSibling.value!=""){
      c = document.createElement("DIV");
      createDropDownItemListener(c,this.previousSibling.value,true);
      this.previousSibling.value = ""

      
      this.parentNode.parentNode.insertBefore(c,this.parentNode.parentNode.lastChild)
      }
    });
    i.addEventListener("click", function(e) {e.stopPropagation();})
    i.appendChild(i1);
    i.appendChild(i2);
    b.appendChild(i);
  }


  dom.appendChild(b);

  if(entries.length!=0)b.getElementsByTagName('div')[0].click() // set first element to initially selected

  a.addEventListener("click", function(e) { // when select box is clicked close
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
  
}

function closeAllSelect(elmnt) {
  /* A function that will close all select boxes in the document,
  except the current select box: */
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}

document.addEventListener("click", closeAllSelect);
}