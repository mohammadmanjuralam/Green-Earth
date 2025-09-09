// -------------------- Variables --------------------
let cart = [];
let total = 0;

const categoriesDiv = document.getElementById("categories");
const cardContainer = document.getElementById("card-cont");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const modalContent = document.getElementById("modal-con");

// -------------------- Loader --------------------
const showLoader = () => {
  cardContainer.innerHTML = `
    <div class="col-span-full flex justify-center items-center w-full h-[200px]">
      <span class="loading loading-bars loading-xl"></span>
    </div>
  `;
};

// -------------------- Load Categories --------------------
const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/categories")
    .then((res) => res.json())
    .then((data) => {
      const cats = data.categories || [];
      categoriesDiv.innerHTML = `<h1 class="font-bold text-center lg:text-left mb-3">Categories</h1>`;

      const allBtn = document.createElement("p");
      allBtn.textContent = "All Trees";
      allBtn.className =
        "hover:bg-[#15803D] mt-2 rounded-md py-2 pl-5 text-center lg:text-left hover:text-white cursor-pointer";
      allBtn.onclick = () => loadCard();
      categoriesDiv.appendChild(allBtn);

      cats.forEach((cat) => {
        const p = document.createElement("p");
        p.textContent = cat.category_name;
        p.className =
          "hover:bg-[#15803D] mt-2 rounded-md py-2 pl-5 text-center lg:text-left hover:text-white cursor-pointer";
        p.onclick = () => loadCardsByCategory(cat.id);
        categoriesDiv.appendChild(p);
      });
    });
};

// -------------------- Load Cards --------------------
const loadCard = () => {
  showLoader();
  fetch("https://openapi.programming-hero.com/api/plants")
    .then((res) => res.json())
    .then((data) => displayCards(data.plants))
    .catch((err) => {
      cardContainer.innerHTML = `<p class="text-red-500 text-center">Error loading plants!</p>`;
      console.error(err);
    });
};

const loadCardsByCategory = (id) => {
  showLoader();
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then((res) => res.json())
    .then((data) => displayCards(data.plants))
    .catch((err) => {
      cardContainer.innerHTML = `<p class="text-red-500 text-center">Error loading category!</p>`;
      console.error(err);
    });
};

// -------------------- Display Cards --------------------
const displayCards = (plants) => {
  cardContainer.innerHTML = "";
  plants.forEach((plant) => {
    const card = document.createElement("div");
    card.classList.add("lg:w-[300px]", "w-[350px]");
    card.style.backgroundColor = "white";
    card.style.borderRadius = "15px";
    card.style.display = "flex";
    card.style.padding = "10px";
    card.style.flexDirection = "column";
    card.style.alignItems = "center";
    card.style.margin = "auto";

    card.innerHTML = `
      <img src="${
        plant.image
      }" style="border-radius:15px;margin-top:10px;width:90%;height:180px;object-fit:cover;">
      <div>
        <h2 class="mb-3">
          <button style="margin-left:15px;" class="font-bold mt-2 self-start cursor-pointer" onclick="openPlantModal('${
            plant.id
          }')">${plant.name}</button>
        </h2>
        <p style="padding-left:10px;" class="text-[10px] text-left mb-2 h-[70px] overflow-hidden">${
          plant.description || "No description"
        }</p>
        <div class="flex justify-between px-2  text-sm mb-2">
          <span class="bg-[#DCFCE7] text-[#15803D] rounded-lg px-3">${
            plant.category
          }</span>
          <span>Price: $${parseFloat(plant.price)}</span>
        </div>
        <button style="width:100%; margin-top:10px; margin-bottom:10px; background-color:#15803D; color:white; padding:5px 0; border-radius:50px;" 
          onclick='addToCart({id:"${plant.id}", name:"${
      plant.name
    }", price:${parseFloat(plant.price || 0)}})'>
          Add to Cart
        </button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
};

// -------------------- Modal --------------------
function openPlantModal(id) {
  fetch(`https://openapi.programming-hero.com/api/plant/${id}`)
    .then((res) => res.json())
    .then((data) => {
      const plant = data.plants;
      const div = document.createElement("div");
      div.innerHTML = `
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
          <div class="modal-box flex flex-col gap-5">
            <h3 class="text-lg font-bold ">${plant.name}</h3>
            <img class="rounded-[15px] w-[500px] h-[300px]" src="${
              plant.image
            }" />
            <p class="text-lg font-bold">Category: ${plant.category}</p>
            <p class="text-lg font-bold">Price: $${parseFloat(
              plant.price || 0
            ).toFixed(2)}</p>
            <p>${plant.description}</p>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      `;
      modalContent.innerHTML = "";
      modalContent.appendChild(div);
      setTimeout(() => {
        const modal = document.getElementById("my_modal_5");
        if (modal) modal.showModal();
      }, 0);
    })
    .catch((err) => console.error("Error loading plant:", err));
}

// -------------------- Cart --------------------
function addToCart(item) {
  cart.push(item);
  total += parseFloat(item.price || 0);
  updateCartUI();
}

function removeFromCart(index) {
  total -= parseFloat(cart[index].price || 0);
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartItems.innerHTML = "";
  cart.forEach((item, i) => {
    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-green-100 px-3 py-2 rounded-lg mb-2";
    li.innerHTML = `
      <div class="flex flex-col">
        <span class="font-medium">${item.name}</span>
        <span class="text-xs text-gray-600">৳${parseFloat(item.price).toFixed(
          2
        )} × 1</span>
      </div>
      <span class="cursor-pointer text-gray-500 hover:text-red-600 font-bold text-lg" onclick="removeFromCart(${i})">❌</span>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = `৳${total.toFixed(0)}`;
}

loadCategories();
loadCard();
s;
