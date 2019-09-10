//variables

const carBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
var r = document.getElementById("result");
var flag = false;
// voice recogition

localStorage.clear();

function startConverting() {
    if ('webkitSpeechRecognition' in window) {
        var speechRecognizer = new webkitSpeechRecognition();
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = "en-IN";
        speechRecognizer.start();

        var finalTranscripts = "";

        speechRecognizer.onresult = function(event) {
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                console.log(transcript);
                if (event.results[i].isFinal) {
                    finalTranscripts += transcript;
                } else {
                    interimTranscripts += transcript;
                }
                //console.log("interm" + interimTranscripts);
            }
            console.log("intermmmmm" + interimTranscripts);

            let k = finalTranscripts + interimTranscripts;
            r.value = k;
        };
        if (flag) {
            console.log("ending");
            speechRecognizer.stop();
            flag = false;
        }
        speechRecognizer.onerror = function(event) {
            console.log("error");
        };
    } else {
        r.value = "Your Browser is not supported\n";
    }

}

function ssearch() {
    var formBtn = document.getElementById("form-btn");
    flag = true;
    formBtn.click();

}

// end of speechRecoginition
//var formBtn = document.getElementById("form-btn");
//formBtn.click();
//cart
let cart = [];
//buttons
let buttonsDOM = [];

// getting products
class Products {
    async getProducts() {
        try {
            let result = await fetch("static/json/products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products;

        } catch (error) {
            console.log(error);
        }

    }

}
// displaying products
class UI {
    displayProducts(products) {

        console.log("khaliq");
        console.log(products);
        let result = '';
        products.forEach(product => {
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img" />
                    <button class="bag-btn" data-id=${product.id}>
                         <i class="fas fa-shopping-cart"></i>
                         add to cart
                     </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>

            <!-- end of single product -->
`
        })
        productsDOM.innerHTML = result;

    }
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        console.log(buttons);
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } else {
                button.addEventListener('click', (event) => {
                    console.log(event);
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;

                    // get product from froduct from local storage
                    let cartItem = {...Storage.getProducts(id), amount: 1 };
                    console.log(cartItem);
                    // add product to the cart 
                    cart = [...cart, cartItem];
                    console.log(cart);
                    // save cart in local storage
                    Storage.saveCart(cart);
                    // set cart values
                    this.setCartValues(cart);
                    // display cart-items
                    this.addCartItem(cartItem);
                    // show the cart 
                    this.showCart();

                })
            }
        })

    }
    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        console.log("khaliq");
        console.log(cartTotal, cartItems);
    }
    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<img src=${item.image} alt="product1">
        <div>
            <h4>${item.title} </h4>
            <h5>$${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>

        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
        console.log(cartContent);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');

    }
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        carBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);

    }

    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }

    cartLogic() {

        // clear cart Logic
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });

        // cart functionality
        cartContent.addEventListener('click', event => {
            //console.log(event.target);
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmt = event.target;
                let id = addAmt.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmt.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let lowAmt = event.target;
                let id = lowAmt.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowAmt.previousElementSibling.innerText = tempItem.amount;

                } else {
                    cartContent.removeChild(lowAmt.parentElement.parentElement);
                    this.removeItem(id);

                }

            }
        })


    }
    clearCart() {
        let cartItems = cart.map(item => item.id);
        console.log(cartItems);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();

    }
    removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class ="fas fa-shopping-cart"></i>add to cart`;

    }
    getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
    }

}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
        return (products);

    }
    static getProducts(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }

}

document.addEventListener("DOMContentLoaded", () => {

    const ui = new UI();
    const products = new Products();
    console.log("going to store the products");

    //setUp app
    ui.setupAPP();
    products.getProducts().then(data => console.log(data));
    products.getProducts().then(product => Storage.saveProducts(product)).then(product => ui.displayProducts(product)).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
    });

    console.log("products stored");
})