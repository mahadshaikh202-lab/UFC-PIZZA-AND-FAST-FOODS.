document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // UFC PIZZA - CART SYSTEM
    // ==========================================

    let cart = JSON.parse(localStorage.getItem("ufcCart")) || [];


    // ==========================================
    // SAVE CART
    // ==========================================

    function saveCart() {

        localStorage.setItem(
            "ufcCart",
            JSON.stringify(cart)
        );

        updateCartCount();
    }


    // ==========================================
    // UPDATE CART COUNT
    // ==========================================

    function updateCartCount() {

        const count = cart.reduce(function(total, item) {

            return total + item.quantity;

        }, 0);


        document.querySelectorAll(".cart-count").forEach(function(element) {

            element.textContent = count;

        });

    }


    // ==========================================
    // ADD TO ORDER
    // ==========================================

    document.querySelectorAll(".add-btn").forEach(function(button) {

        button.addEventListener("click", function() {

            const card =
                button.closest(".food-card");

            if (!card) return;


            const name =
                card.querySelector("h3").textContent.trim();


            const priceText =
                card.querySelector(".food-title span").textContent;


            const price =
                parseInt(
                    priceText.replace(/\D/g, "")
                );


            const image =
                card.querySelector("img").getAttribute("src");


            const existingItem =
                cart.find(function(item) {

                    return item.name === name;

                });


            if (existingItem) {

                existingItem.quantity++;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    image: image,

                    quantity: 1

                });

            }


            saveCart();


            // Button animation

            const oldText =
                button.innerHTML;


            button.innerHTML =
                "✓ Added";


            setTimeout(function() {

                button.innerHTML =
                    oldText;

            }, 1000);

        });

    });


    // ==========================================
    // CART BUTTON
    // ==========================================

    const cartButton =
        document.getElementById("cartBtn");


    if (cartButton) {

        cartButton.addEventListener("click", function() {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty! 🍕\n\nPlease add something from our menu."
                );

            } else {

                window.location.href =
                    "order.html";

            }

        });

    }


    // ==========================================
    // MOBILE MENU
    // ==========================================

    const menuToggle =
        document.getElementById("menuToggle");


    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function() {

            navLinks.classList.toggle(
                "mobile-open"
            );

        });

    }


    // ==========================================
    // ACCOUNT BUTTON
    // ==========================================

    const accountButton =
        document.getElementById("accountBtn");


    if (accountButton) {

        accountButton.addEventListener("click", function() {

            alert(
                "👤 UFC Account\n\nLogin & Signup system coming soon!"
            );

        });

    }



    


    // ==========================================
    // ORDER PAGE
    // ==========================================

    function loadOrderPage() {

        const orderItems =
            document.getElementById(
                "orderItems"
            );


        if (!orderItems) return;


        cart =
            JSON.parse(
                localStorage.getItem("ufcCart")
            ) || [];


        // Empty cart

        if (cart.length === 0) {

            orderItems.innerHTML = `
                <div style="
                    text-align:center;
                    padding:40px;
                ">

                    <h3>
                        Your cart is empty 🍕
                    </h3>

                    <p>
                        Please add something
                        from our menu.
                    </p>

                </div>
            `;

            calculateTotal();

            return;

        }


        orderItems.innerHTML = "";


        cart.forEach(
            function(item, index) {

                const itemTotal =
                    item.price *
                    item.quantity;


                const itemHTML =
                    document.createElement("div");


                itemHTML.className =
                    "cart-item";


                itemHTML.innerHTML = `

                    <div class="cart-item-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>


                        <p>
                            Rs.
                            ${item.price.toLocaleString()}
                        </p>


                        <div class="quantity-controls">

                            <button
                                class="qty-btn"
                                data-index="${index}"
                                data-change="-1"
                            >
                                −
                            </button>


                            <span>
                                ${item.quantity}
                            </span>


                            <button
                                class="qty-btn"
                                data-index="${index}"
                                data-change="1"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div class="cart-item-price">

                        <strong>
                            Rs.
                            ${itemTotal.toLocaleString()}
                        </strong>

                    </div>


                    <button
                        class="remove-item"
                        data-index="${index}"
                    >
                        ×
                    </button>

                `;


                orderItems.appendChild(
                    itemHTML
                );

            }
        );


        calculateTotal();

    }


    // ==========================================
    // QUANTITY BUTTONS
    // ==========================================

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".qty-btn"
                );


            if (!button) return;


            const index =
                Number(
                    button.dataset.index
                );


            const change =
                Number(
                    button.dataset.change
                );


            if (!cart[index]) return;


            cart[index].quantity +=
                change;


            if (
                cart[index].quantity <= 0
            ) {

                cart.splice(
                    index,
                    1
                );

            }


            saveCart();

            loadOrderPage();

        }
    );


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    document.addEventListener(
        "click",
        function(event) {

            const button =
                event.target.closest(
                    ".remove-item"
                );


            if (!button) return;


            const index =
                Number(
                    button.dataset.index
                );


            cart.splice(
                index,
                1
            );


            saveCart();

            loadOrderPage();

        }
    );


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    function calculateTotal() {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "ufcCart"
                )
            ) || [];


        let subtotal = 0;


        cart.forEach(
            function(item) {

                subtotal +=
                    item.price *
                    item.quantity;

            }
        );


        const selectedType =
            document.querySelector(
                'input[name="orderType"]:checked'
            );


        let deliveryFee = 0;


        if (
            selectedType &&
            selectedType.value ===
            "delivery" &&
            subtotal > 0
        ) {

            deliveryFee = 150;

        }


        const grandTotal =
            subtotal +
            deliveryFee;


        const subtotalElement =
            document.getElementById(
                "subtotal"
            );


        const deliveryElement =
            document.getElementById(
                "deliveryFee"
            );


        const grandTotalElement =
            document.getElementById(
                "grandTotal"
            );


        if (subtotalElement) {

            subtotalElement.textContent =
                "Rs. " +
                subtotal.toLocaleString();

        }


        if (deliveryElement) {

            deliveryElement.textContent =
                deliveryFee === 0
                    ? "FREE"
                    : "Rs. " +
                      deliveryFee.toLocaleString();

        }


        if (grandTotalElement) {

            grandTotalElement.textContent =
                "Rs. " +
                grandTotal.toLocaleString();

        }

    }


    // ==========================================
    // DELIVERY / PICKUP
    // ==========================================

    document.querySelectorAll(
        'input[name="orderType"]'
    ).forEach(function(radio) {

        radio.addEventListener(
            "change",
            function() {

                calculateTotal();

            }
        );

    });


    // ==========================================
    // INITIALIZE
    // ==========================================

    updateCartCount();

    loadOrderPage();

});

// ==========================================
// UFC PREMIUM CHATBOT
// ==========================================

const chatOpen =
    document.getElementById("chatOpen");

const ufcChatbot =
    document.getElementById("ufcChatbot");

const chatClose =
    document.getElementById("chatClose");

const chatBody =
    document.getElementById("chatBody");

const chatOptions =
    document.getElementById("chatOptions");


// ==========================================
// OPEN CHAT
// ==========================================

if (chatOpen && ufcChatbot) {

    chatOpen.addEventListener("click", function () {

        ufcChatbot.classList.toggle("open");

    });

}


// ==========================================
// CLOSE CHAT
// ==========================================

if (chatClose && ufcChatbot) {

    chatClose.addEventListener("click", function () {

        ufcChatbot.classList.remove("open");

    });

}


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function addBotMessage(message) {

    const botMessage =
        document.createElement("div");

    botMessage.className =
        "bot-message";

    botMessage.innerHTML = `

        <div class="message-avatar">
            🍕
        </div>

        <div class="message-text">
            ${message}
        </div>

    `;

    chatBody.appendChild(botMessage);

    chatBody.scrollTop =
        chatBody.scrollHeight;

}


// ==========================================
// USER MESSAGE
// ==========================================

function addUserMessage(message) {

    const userMessage =
        document.createElement("div");

    userMessage.className =
        "chat-user-message";

    userMessage.textContent =
        message;

    chatBody.appendChild(userMessage);

    chatBody.scrollTop =
        chatBody.scrollHeight;

}


// ==========================================
// MAIN MENU
// ==========================================

function showMainMenu() {

    chatOptions.innerHTML = `

        <button data-chat="menu">
            🍕 Menu
        </button>

        <button data-chat="deals">
            🔥 Deals
        </button>

        <button data-chat="delivery">
            🚚 Delivery
        </button>

        <button data-chat="order">
            🛒 Order Now
        </button>

        <button data-chat="location">
            📍 Location
        </button>

        <button data-chat="contact">
            ☎️ Contact
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// MENU
// ==========================================

function showMenu() {

    chatOptions.innerHTML = `

        <button class="chat-menu-button"
                data-menu="pizza">
            🍕 Pizza
        </button>

        <button class="chat-menu-button"
                data-menu="fastfood">
            🍔 Fast Food
        </button>

        <button class="chat-menu-button"
                data-menu="sides">
            🍟 Sides & Drinks
        </button>

        <button class="chat-back"
                data-back="main">
            ← Back
        </button>

    `;

    attachMenuButtons();

}


// ==========================================
// PIZZA MENU
// ==========================================

function showPizza() {

    addBotMessage(`
        🍕 <strong>Pizza Menu</strong>
        <br><br>

        Available pizza sizes:
        <br><br>

        🍕 Small Pizza
        <br>
        🍕 Regular Pizza
        <br>
        🍕 Large Pizza
        <br>
        🍕 Jumbo Pizza
        <br><br>

        Pizza selection is available
        with our different UFC deals.
    `);

    chatOptions.innerHTML = `

        <button class="chat-back"
                data-back="menu">
            ← Back to Menu
        </button>

        <button data-chat="deals">
            🔥 View Pizza Deals
        </button>

        <button data-chat="order">
            🛒 Order Now
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// FAST FOOD
// ==========================================

function showFastFood() {

    addBotMessage(`
        🍔 <strong>Fast Food</strong>
        <br><br>

        🍔 Zinger
        <br>
        🍗 Broast
        <br>
        🌯 Twister Roll
        <br>
        🥟 Spring Roll
        <br><br>

        Available through our UFC deals.
    `);

    chatOptions.innerHTML = `

        <button class="chat-back"
                data-back="menu">
            ← Back to Menu
        </button>

        <button data-chat="deals">
            🔥 View Deals
        </button>

        <button data-chat="order">
            🛒 Order Now
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// SIDES & DRINKS
// ==========================================

function showSides() {

    addBotMessage(`
        🍟 <strong>Sides & Drinks</strong>
        <br><br>

        🍝 Half Pasta
        <br>
        🥤 375ml Drink
        <br>
        🥤 500ml Drink
        <br>
        🥤 1 Liter Drink
        <br>
        🥤 1.5 Liter Drink
    `);

    chatOptions.innerHTML = `

        <button class="chat-back"
                data-back="menu">
            ← Back to Menu
        </button>

        <button data-chat="deals">
            🔥 View Deals
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// UFC DEALS
// ==========================================

const ufcDeals = [

    {
        name: "Deal 1",
        price: "Rs. 399",
        details:
        "1 Small Pizza + 1 × 375ml Drink + 1 Spring Roll"
    },

    {
        name: "Deal 2",
        price: "Rs. 799",
        details:
        "1 Regular Pizza + 1 Twister Roll + 1 × 500ml Drink"
    },

    {
        name: "Deal 3",
        price: "Rs. 699",
        details:
        "2 Small Pizza + 1 × 500ml Drink"
    },

    {
        name: "Deal 4",
        price: "Rs. 1,299",
        details:
        "1 Large Pizza + Half Pasta + 1 Liter Drink"
    },

    {
        name: "Deal 5",
        price: "Rs. 1,450",
        details:
        "4 Zinger + 1 Liter Cold Drink"
    },

    {
        name: "Deal 6",
        price: "Rs. 1,199",
        details:
        "4 Small Pizza + 1 Liter Drink"
    },

    {
        name: "Deal 7",
        price: "Rs. 1,250",
        details:
        "2 Regular Pizza + Half Pasta + 1 Liter Drink"
    },

    {
        name: "Deal 8",
        price: "Rs. 1,199",
        details:
        "1 Large Pizza + 1 Regular Pizza + 1 Liter Drink"
    },

    {
        name: "Deal 9",
        price: "Rs. 1,570",
        details:
        "2 Large Pizza + 1 Liter Drink"
    },

    {
        name: "Deal 10",
        price: "Rs. 1,999",
        details:
        "1 Large Pizza + 1 Regular Pizza + 3 Spring Rolls + 1 Liter Drink"
    },

    {
        name: "Deal 11",
        price: "Rs. 1,499",
        details:
        "1 Jumbo Pizza + 1 Broast + 1 Liter Drink"
    },

    {
        name: "Family Deal",
        price: "Rs. 2,999",
        details:
        "2 Large Pizza + 2 Twister Roll + 1 × 1.5L Drink + 2 Zinger + 1 Broast"
    }

];


// ==========================================
// SHOW DEALS
// ==========================================

function showDeals() {

    let html = "";

    ufcDeals.forEach(function(deal, index) {

        html += `

            <div class="chat-deal">

                <strong>
                    🔥 ${deal.name}
                </strong>

                <div class="chat-deal-price">
                    ${deal.price}
                </div>

                <div class="chat-deal-details">
                    ${deal.details}
                </div>

                <button
                    class="chat-deal-order"
                    data-deal="${index}"
                >
                    🛒 Order This Deal
                </button>

            </div>

        `;

    });


    addBotMessage(`
        🔥 <strong>UFC Deals</strong>
        <br><br>
        Choose your favorite deal below 👇
    `);


    chatOptions.innerHTML = `

        <button class="chat-back"
                data-back="main">
            ← Back to Main Menu
        </button>

        ${html}

    `;


    attachDealButtons();

}


// ==========================================
// DELIVERY
// ==========================================

function showDelivery() {

    addBotMessage(`
        🚚 <strong>Home Delivery</strong>
        <br><br>

        UFC provides home delivery.
        <br><br>

        📍 Delivery charges are
        <strong>area-wise</strong>.
        <br><br>

        🏪 Take Away is also available.
        <br><br>

        For exact delivery charges,
        contact UFC.
    `);

    chatOptions.innerHTML = `

        <button data-chat="contact">
            ☎️ Contact UFC
        </button>

        <button data-chat="location">
            📍 Location
        </button>

        <button class="chat-back"
                data-back="main">
            ← Back
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// LOCATION
// ==========================================

function showLocation() {

    addBotMessage(`
        📍 <strong>UFC Pizza & Fast Food</strong>
        <br><br>

        Jail Road,
        <br>
        Hirabad,
        <br>
        Hyderabad.
        <br><br>

        🛵 Take Away & Home Delivery
        available.
    `);

    chatOptions.innerHTML = `

        <button data-chat="contact">
            ☎️ Contact Us
        </button>

        <button class="chat-back"
                data-back="main">
            ← Back
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// CONTACT
// ==========================================

function showContact() {
    addBotMessage(`
        ☎️ <strong>Contact UFC</strong>
        <br><br>
        📱 WhatsApp:
        <strong>0311-3186867</strong>
        <br><br>
        ☎️ Phone:
        <strong>0301-2068533</strong>
        <br><br>
        📍 Main Citizen Colony,
        <br>
        Near Sindh Bank.
    `);

    chatOptions.innerHTML = `
        <button onclick="window.location.href='tel:03012068533'">
            ☎️ Call Now
        </button>

        <button onclick="window.open('https://wa.me/923113186867','_blank')">
            💬 WhatsApp
        </button>

        <button class="chat-back" data-back="main">
            ← Back
        </button>
    `;

    attachChatButtons();
}



// ==========================================
// ORDER NOW
// ==========================================

function showOrder() {

    addBotMessage(`
        🛒 <strong>Ready to order?</strong>
        <br><br>

        Click below to open the
        UFC order page.
    `);

    chatOptions.innerHTML = `

        <button
            onclick="window.location.href='order.html'"
        >
            🛒 Start Order
        </button>

        <button data-chat="deals">
            🔥 View Deals
        </button>

        <button class="chat-back"
                data-back="main">
            ← Back
        </button>

    `;

    attachChatButtons();

}


// ==========================================
// MAIN CHAT BUTTON HANDLER
// ==========================================

function attachChatButtons() {

    document.querySelectorAll(
        "#chatOptions [data-chat]"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const type =
                    button.dataset.chat;


                addUserMessage(
                    button.textContent.trim()
                );


                setTimeout(function() {

                    if (type === "menu") {
                        showMenu();
                    }

                    else if (type === "deals") {
                        showDeals();
                    }

                    else if (type === "delivery") {
                        showDelivery();
                    }

                    else if (type === "order") {
                        showOrder();
                    }

                    else if (type === "location") {
                        showLocation();
                    }

                    else if (type === "contact") {
                        showContact();
                    }

                }, 250);

            }
        );

    });


    // BACK BUTTON

    document.querySelectorAll(
        "#chatOptions [data-back]"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const back =
                    button.dataset.back;


                if (back === "main") {

                    showMainMenu();

                }

                else if (back === "menu") {

                    showMenu();

                }

            }
        );

    });

}


// ==========================================
// MENU CATEGORY BUTTONS
// ==========================================

function attachMenuButtons() {

    document.querySelectorAll(
        "#chatOptions [data-menu]"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const type =
                    button.dataset.menu;


                addUserMessage(
                    button.textContent.trim()
                );


                setTimeout(function() {

                    if (type === "pizza") {
                        showPizza();
                    }

                    else if (type === "fastfood") {
                        showFastFood();
                    }

                    else if (type === "sides") {
                        showSides();
                    }

                }, 250);

            }
        );

    });


    document.querySelectorAll(
        "#chatOptions [data-back]"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                showMainMenu();

            }
        );

    });

}


// ==========================================
// DEAL ORDER BUTTONS
// ==========================================

function attachDealButtons() {

    document.querySelectorAll(
        ".chat-deal-order"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const index =
                    Number(
                        button.dataset.deal
                    );


                const deal =
                    ufcDeals[index];


                addUserMessage(
                    "🛒 " + deal.name
                );


                setTimeout(function() {

                    addBotMessage(`
                        ✅ <strong>${deal.name}</strong>
                        selected!
                        <br><br>

                        💰 ${deal.price}
                        <br><br>

                        ${deal.details}
                        <br><br>

                        Click below to continue
                        your order.
                    `);


                    chatOptions.innerHTML = `

                        <button
                            onclick="window.location.href='order.html'"
                        >
                            🛒 Continue Order
                        </button>

                        <button
                            onclick="showDeals()"
                        >
                            🔥 Other Deals
                        </button>

                        <button
                            class="chat-back"
                            data-back="main"
                        >
                            ← Main Menu
                        </button>

                    `;


                    attachChatButtons();

                }, 350);

            }
        );

    });


    document.querySelectorAll(
        "#chatOptions [data-back]"
    ).forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                showMainMenu();

            }
        );

    });

}


// ==========================================
// INITIAL CHAT BUTTONS
// ==========================================

attachChatButtons();