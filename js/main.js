$(document).ready(function() {
    social()
});


//sort and fillter
document.getElementById("search").addEventListener("keyup", filterSearch);
document.getElementById("apply").addEventListener("click", sortAndFilter);


function sortAndFilter(){
    let allCats = document.getElementsByClassName("checks");
    idOfTheChecked=[];
    for (let oneCat of allCats) {
        if (oneCat.checked) {
        idOfTheChecked.push(parseInt(oneCat.dataset.id))
        }
    }
    let sortItBy = $("#sortItBy").val(); 

    ajaxBooks((books) => {
        var filter = books.filter(b => {
        let cats = b.category.map(b => b.id);
        let bool = true;
        for (let categori of idOfTheChecked) {
        if (!(cats.indexOf(categori) !== -1)) {
        bool = false;
        break;
            }
        }
        return bool;
        });
        if (sortItBy == "LtH")
         { priceLToH(filter); }
        else if (sortItBy == "HtL")
         { priceHToL(filter); }
        else if (sortItBy == "AZ")
         { aToZ(filter); }
        else if (sortItBy == "ZA")
         { zToA(filter); }
        else if (sortItBy == "0")
         { getBooks(filter) }
         getBooks(filter);
         addTooCartForAll(filter);
    });
}
//price low to high
function priceLToH(books) {
    let sorted = books.sort((a, b) => {
    let price1 = a.price.new;
    let price2 = b.price.new;
    return price1 - price2;
    });
    getBooks(sorted);
    addTooCartForAll(sorted);
   }
   
//price high to low
function priceHToL(books) {
    let sorted = books.sort((a, b) => {
    let price1 = a.price.new;
    let price2 = b.price.new;
    return price2 - price1;
    });
    getBooks(sorted);
    addTooCartForAll(sorted);
   }


//od A do Z
   function aToZ(books) {
    let sorted = books.sort((a, b) => {
    let name1 = a.name;
    let name2 = b.name;
    return name1 > name2 ? 1 : -1;
    });
    getBooks(sorted);
    addTooCartForAll(sorted);
   }

//od Z do A

function zToA(books) {
    let sorted = books.sort((a, b) => {
    let name1 = a.name;
    let name2 = b.name;
    return name1 < name2 ? 1 : -1;
    });
    getBooks(sorted);
    addTooCartForAll(sorted);
   }




   
 //dohvatanje knjiga pomocu ajaxa(da ne bih pozivala ajax vise puta)
 function ajaxBooks(callBack) {
    $.ajax({
    url: "json/books.json",
    method: "GET",
    dataType: "json",
    success: callBack
    });
   }  




//ispis knjiga

const getBooks = (bs) => {
    var ispisi = "";
    for(var b of bs){
        ispisi += `<div class="card m-3 bg-white  text-center" style="width: 10rem;" class="kartice">
        <div id="ex${b.id}" class="modal">
        <h4 class="card-title">${b.name}</h4>
        <p>${b.description}</p>
        </div>
        <a href="#ex${b.id}" rel="modal:open"><img src="${b.image.src}" class="card-img-top" alt="${b.image.alt}"></a>
        <div class="card-body p-3">
        <h6 class="card-title">${b.name}</h6>
      </div>
      <p class="card-text w-100"><span class="rec">${ifRecommended(b.recommend)}</span></p>
      <p class="card-text">Price: <span class="newPrice">$${b.price.new} </span><del class="oldPrice">${isThereOldP(b.price.old)}</del>
        </p>
      <button class="btn btn-secondary m-3 addItToCart" data-idbook="${b.id}">Add to cart</button>
      </div>`;
      function isThereOldP(price){
        if(price == undefined || price == null){
        return "";
        }else{
        return "$"+price;
        }
        };

        function ifRecommended(recommend){
            if(!recommend){
                return"";
            }else{
                return "⛧ Recommended ⛧";
            }
        };
    document.getElementById('cardbook').innerHTML = ispisi;
    
    }
}


function allBooks(){
    $.ajax({
        url : 'json/books.json',
        method: 'GET',
        dataType: 'json',
        success: (books) => {
            getBooks(books);
        },
        error: (xlr, status, error) => {
            console.log(error);
        }
    });
}
allBooks();
//ispis kategorija
function writeCategories(){
    $.ajax({
        url: "json/categories.json",
        method: "GET",
        dataType: "json",
        success: function (categories) {
        let ispis = ``;
        for (let cat of categories) {
       ispis += `  <li class="position-relative checkbox_holder"><input type="checkbox" data-id="${cat.id}" value="${cat.name}" class="checkboxType checks">${cat.name}</li>`;
    }
    $("#category").html(ispis);
    }
    });
}

writeCategories();


//search

function filterSearch() {
    $.ajax('json/books.json', {
    method : "GET",
    type : "json",
    success : (data) => {
    var vrednost = document.getElementById("search").value;
    var books = data.filter(b=> b.name.toUpperCase().indexOf(vrednost.trim(
   ).toUpperCase()) != -1);
    getBooks(books);
    },
    error: (xlr, status, error) => {
    console.log(error);
    }
    });
    }

//ispis sorta
function sortBy(){
    let niz = ["Price Low to High","Price High to Low","Title A-Z","Title Z-A"];
    let values = ["LtH","HtL","AZ","ZA"];
    let ispis =``;
    for (let n in niz) {
    ispis+=`<option value="${values[n]}">${niz[n]}</option>`;
    }
    $("#sortItBy").append(ispis);
   };

sortBy();


//local storage,cart

function putTheBooksInLS(book) {
    localStorage.setItem("booksCart", JSON.stringify(book));
   }
function getTheBooksFromTheLS() {
    return JSON.parse(localStorage.getItem("booksCart"));
   }

ajaxBooks((books)=> {
    addTooCartForAll(books);
});
function addTooCartForAll(books) {
    var allAddItToCart = document.getElementsByClassName("addItToCart");
    for (let b of allAddItToCart) {
    b.addEventListener("click", addToCart);
    }
    function addToCart(){
        var id = this.dataset.idbook;
        var arrayOfBooks = [];
        var booksFromLS = getTheBooksFromTheLS();

        if (booksFromLS!==null){
            if (booksFromLS.filter(p => p.id == id).length) {
                let booksFromLS = getTheBooksFromTheLS();
                for (let i in booksFromLS) {
                if (booksFromLS[i].id == id) {
                    booksFromLS[i].quantity++;
                break;
                }
                }
                putTheBooksInLS(booksFromLS);
                } else {
                for (let b of booksFromLS) {
                arrayOfBooks.push(b);
                }
                let newBook = books.find(b => b.id == id);
                arrayOfBooks.push({
                id: newBook.id,
                quantity: 1
                });
                putTheBooksInLS(arrayOfBooks);
                }
                } else {
                let book = books.find(b => {
                return b.id == id;
                });
                arrayOfBooks[0] = {
                id: book.id,
                quantity: 1
                };
                putTheBooksInLS(arrayOfBooks)
                }
                alert("You Added The Book To Your Cart!");
                }
               }
//forma


$(document).ready(function() {
    $('#dugme').click(proveri);
   });

function proveri(e) {
    var provera = true;
    e.preventDefault();
    var fullName = document.getElementById('name').value;
    var fullLast = document.getElementById('lastname').value;
    var mail = document.getElementById('email').value;
    var area = document.getElementById('message').value;
    var fullNameErrorr = document.getElementById('fullNameError');
    var fullLastErrorr = document.getElementById('fullLastError');
    var mailErrorr = document.getElementById('mailError');
    var areaErrorr = document.getElementById('areaError');
   
    var regName = /^[A-Z][a-z]{2,14}$/
    var regLast = /^[A-Z][a-z]{2,14}$/
    var regMail = /^[a-z][a-z\-\d-\.\_]+\@[a-z]+(\.[a-z]{2,11}){1,2}$/
    var regArea = /^([A-z\d\.\-\_\,\/\@\"\'\s\n\!\?])+$/

    function ispisi(reg, tester, errorName, errorText) {
    if(!reg.test(tester)) {
    errorName.innerHTML = String(errorText);
    provera = false;
    }
    else {
    errorName.innerHTML = '';
    }
    };
    ispisi(regName, fullName, fullNameErrorr, `You didn't enter your first name correctly !`);
    ispisi(regLast, fullLast, fullLastErrorr, `You didn't enter your last name correctly !`);
    ispisi(regMail, mail, mailErrorr, `You didn't enter your email correctly !`);
    ispisi(regArea, area, areaErrorr, `You didn't enter anything !`);

    if(provera) {
        document.getElementById('uspeh').innerHTML = `You did it ! Message has been sent.`
        } else document.getElementById('uspeh').innerHTML = ``;
       }
       $('a.open-modal').click(function(event) {
        $(this).modal({
          fadeDuration: 250
        });
        return false;
      });





//scroll to top

$("#scrollToTop").click(function(){

    $("html").animate({
        scrollTop: 0
    }, 1000);
});

$("#scrollToTop").hide();

$(window).scroll(function(){
    let top = $(this)[0].scrollY;
    
    if(top > 500){
        $("#scrollToTop").show();
    } else {
        $("#scrollToTop").hide();
    }
});

//Futer - mreze
function social(){
    var asocijala=document.querySelector("#mreze");
    var mreze=["facebook","instagram","twitter","tumblr"];
    for(let i=0;i<mreze.length;i++){
            asocijala.innerHTML+=`<a href="#" class="text-white"><i class="fa fa-${mreze[i]} mx-2" aria-hidden="true"></i></a>`;
    }
}

$("#fade").modal({
    fadeDuration: 1000,
    fadeDelay: 0.50
  });