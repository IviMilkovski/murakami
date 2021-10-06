$(document).ready(function () {
        cartDataForTheTable();
});

function cartDataForTheTable(){
    let books = booksInCart();

    $.ajax({
        url : "json/books.json",
        success: (data) => {
        data = data.filter(b => {
        for(let book of books)
        {
        if(b.id == book.id) {
        b.quantity = book.quantity;
        return true;
        }
        }
        return false;
        });
        getTheTable(data)
        }
        });   
}

function getTheTable(books) {
    let ispis = `
    <table class="table table-bordered" id="cartItems">
    <thead>
    <tr>
   <th class="text-center">Book</th>
   <th class="text-center">Price</th>
   <th class="text-center">Quantity</th>
    <th class="text-center">Remove</th>
    </tr>
    </thead>`;
    for(let b of books) {
    ispis +=`
    <tr class="cartRow">
    <td><img src="${b.image.src}" alt="${b.image.alt}" style="width:100px";/> ${b.name}</td>
    <td class="text-center">$${b.price.new}</td>
    <td class="text-center">${b.quantity}</td>
    <td class="text-center"><button type="button" class="btn btn-secondary" onclick='removeBook(${b.id})'
   >remove</button></td>
    </tr>
    `;
    };
    ispis+=`</table>`;
    document.getElementsByClassName('cart')[0].innerHTML = ispis;
    return ispis;
   }


   function booksInCart() {
    return JSON.parse(localStorage.getItem("booksCart"));
   }


   function removeBook(id) {
    let books = booksInCart();
    let filtered = books.filter(b => b.id != id);
    localStorage.setItem("booksCart", JSON.stringify(filtered));
    cartDataForTheTable();
   }
   