let cart = [];

const loadCategories = async () => {
    isLoading(true);
    const url = "https://openapi.programming-hero.com/api/categories";

    const result = await fetch(url);
    const data = await result.json();

    displayCategory(data.categories);
    isLoading(false)

}

const displayCategory = (data) => {
    data.unshift({
        "category_name": "All Tree",
        "id": 0,
        "small_description": "Explore all types of trees including fruit, flowering, and ornamental varieties in one place."
    })
    const categoriesContainer = document.querySelectorAll(".categories-container");
    categoriesContainer.forEach((container) => {
        container.innerHTML = "";
        data.forEach((cat, index) => {
            const button = document.createElement("button");
            button.onclick = () => loadCategoryData(cat.id);
            button.className = `${index === 0 ? "bg-success text-white" : "hover:bg-success hover:text-white"} w-full text-left px-2 py-1 rounded font-semibold cursor-pointer border border-gray-400`;
            button.innerText = cat?.category_name;

            container.appendChild(button);
        })
    })
}

const loadCategoryData = async (cat_id = 0) => {
    isCardLoading(true)
    let url = "";

    if (cat_id === 0) {
        url = "https://openapi.programming-hero.com/api/plants";
    } else {
        url = `https://openapi.programming-hero.com/api/category/${cat_id}`;
    }

    const result = await fetch(url);
    const data = await result.json();

    displayTrees(data?.plants);
    isCardLoading(false)
}

const displayTrees = (data) => {
    const plantContainer = document.getElementById("plant-container");
    plantContainer.innerHTML = "";

    data.forEach((plant) => {
        const card = document.createElement("div");
        card.className = "card shadow-sm p-4 bg-slate-50"
        card.innerHTML = `
            <figure>
                <img src="${plant.image}" alt="Tree"
                    class="h-60 w-full object-cover" />
            </figure>
            <div class="mt-5 space-y-3">
                <h2 class="text-xl font-bold">${plant.name}</h2>
                <p class="line-clamp-2 text-gray-500 text-sm">${plant.description}
                </p>
                <div class="flex justify-between items-center">
                    <p class="badge badge-success text-xs text-white font-bold rounded-xl px-3">${plant.category}
                    </p>
                    <p class="font-bold">৳ ${plant.price}</p>
                </div>

                <button onclick="addToCart('${plant?.name}', ${plant.price})"  class="btn btn-success text-white font-bold w-full rounded-4xl">Add to cart</button>
            </div>
            `
        plantContainer.appendChild(card);
    })

}

const addToCart = (plantName, price) => {
    const plant = cart.find((p) => p.name === plantName);

    if (plant) {
        plant.quantity++;
    } else {
        const plantInfo = {
            name: plantName,
            price: price,
            quantity: 1
        };

        cart.push(plantInfo);
    }

    updateCart();
};

const updateCart = () => {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = "";

    cart.forEach((item) => {
        const divEl = document.createElement("div")
        divEl.className = "flex justify-between items-center px-2 py-2 rounded bg-green-50";
        divEl.innerHTML = `
                        <div class="space-y-1">
                            <h2 class="text-sm font-bold">${item.name}</h2>
                            <p class="text-sm text-gray-600">৳ <span>${item.price}</span> x <span>${item.quantity}</span></p>
                        </div>
                        <h1 onclick="deleteFromCart('${item.name}')" class="text-error font-bold cursor-pointer text-xl">X</h1>
        `
        cartItemsContainer.appendChild(divEl);
    })

    const total = cart.reduce((total, plant) => {
        return total + (plant.price * plant.quantity)
    }, 0)

    document.getElementById("total-count").innerText = `${total}`;
    document.getElementById("cart-item-count").innerText = `${cart.length}`;

    if (cart.length > 0) {
        cartItemsContainer.classList.remove("hidden");
        document.getElementById("cart-total").classList.remove("hidden");
        document.getElementById("cart-empty").classList.add("hidden");
    } else {
        cartItemsContainer.classList.add("hidden");
        document.getElementById("cart-total").classList.add("hidden");
        document.getElementById("cart-empty").classList.remove("hidden");
    }

}

const deleteFromCart = (plantName) => {
    const filterResult = cart.filter((plant) => plant.name !== plantName);
    cart = filterResult;

    updateCart();
}

const isLoading = (status) => {
    // const loadingContainer = document.getElementById("loading-container");

    // if (status) {
    //     loadingContainer.classList.remove("hidden")
    // } else {
    //     loadingContainer.classList.add("hidden")
    // }
}

const isCardLoading = (status) => {
    const loadingContainer = document.getElementById("card-loading-container");

    if (status) {
        loadingContainer.classList.remove("hidden")
    } else {
        loadingContainer.classList.add("hidden")
    }
}

loadCategories();
loadCategoryData();