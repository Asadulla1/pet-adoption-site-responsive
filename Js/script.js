// Categories Load
const fetchCategories = async () => {
  const url = `https://openapi.programming-hero.com/api/peddy/categories`;
  const res = await fetch(url);
  const data = await res.json();
  displayCategories(data.categories);
};

const displayCategories = (data) => {
  const categoryButtonContainer = document.getElementById(
    "category-btn-container"
  );
  data.map((item) => {
    const category = item.category;
    const categoryIcon = item.category_icon;
    const div = document.createElement("div");
    div.innerHTML = `
    <button class="btn btn-lg px-10 my-4"  id="btn-${item.id}" onclick="fetchByCategories('${item.id},${item.category}')">
    <img src="${categoryIcon}" alt="" class="mr-3" />
    <p>${category}</p>
    </button>
    `;
    categoryButtonContainer.appendChild(div);
  });
};
fetchCategories();
//Fetch CategoriesWise
const fetchByCategories = async (data) => {
  const spinner = document.getElementById("spinner-container");
  spinner.classList.remove("hidden");
  const allPetsContainer = document.getElementById("all-pets-container");
  allPetsContainer.innerHTML = "";
  const favPetsGallery = document.getElementById("fav-pets-container");
  favPetsGallery.classList.add("hidden");
  const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));
  await minimumDelay;
  favPetsGallery.classList.remove("hidden");
  spinner.classList.add("hidden");
  console.log(spinner);
  const categoryButtonContainer = document.getElementById(
    "category-btn-container"
  ).children;
  for (let item of categoryButtonContainer) {
    const btn = item.children[0];
    btn.classList.remove("bg-[#0E7A811A]");
    btn.classList.remove("border", "border-green-500", "rounded-full");
  }
  const dataStringSplit = data.split(",");
  const btnId = dataStringSplit[0];
  const categoryBtn = document.getElementById(`btn-${btnId}`);
  categoryBtn.classList.add("bg-[#0E7A811A]");
  categoryBtn.classList.add("border", "border-green-500", "rounded-full");
  const categoryName = dataStringSplit[1];
  const url = `https://openapi.programming-hero.com/api/peddy/category/${categoryName}`;
  const res = await fetch(url);
  const responsedData = await res.json();
  // console.log(responsedData.data);

  loadAllPetsData(responsedData.data);
};
//All Data Fetch
const allPetsFetch = async () => {
  const spinner = document.getElementById("spinner-container");
  const favPetsGallery = document.getElementById("fav-pets-container");
  favPetsGallery.classList.add("hidden");
  const minimumDelay = new Promise((resolve) => setTimeout(resolve, 2000));
  await minimumDelay;
  favPetsGallery.classList.remove("hidden");
  const url = `https://openapi.programming-hero.com/api/peddy/pets`;
  const res = await fetch(url);
  spinner.classList.add("hidden");
  const data = await res.json();
  loadAllPetsData(data.pets);
};

const loadAllPetsData = (pets) => {
  const allPetsContainer = document.getElementById("all-pets-container");
  allPetsContainer.innerHTML = "";
  if (pets.length === 0) {
    allPetsContainer.classList = "flex justify-between h-[500px]";
    const div = document.createElement("div");
    div.innerHTML = `
    <img src="../images/error.webp" class="p-3 md:p-10"/>
    <h1 class="text-center text-2xl lg:text-4xl text-black font-extrabold">No Information Available</h1>
    <p class="w-full my-10  md:w-4/5 text-xl text-black text-center ">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a.</p>
    `;
    allPetsContainer.appendChild(div);
    div.classList = "bg-gray-100 flex flex-col items-center rounded-lg h-full";
  } else {
    allPetsContainer.classList =
      "grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5";
  }
  pets.forEach((pet) => {
    const div = document.createElement("div");
    div.innerHTML = `
    <div>
          <img
            src="${pet.image}"
            alt=""
            class="rounded-lg my-4 w-[500px] "
          />
        </div>
        <div>
          <h3 class="text-xl font-bold">${pet.pet_name}</h3>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon1.png" alt="" class="w-[25px]" />
            <p>Breed: ${pet.breed ? pet.breed : "Not Available"}</p>
          </div>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon2.png" alt="" class="w-[25px]" />
            <p>Birth: ${
              pet.date_of_birth ? pet.date_of_birth : "Not Available"
            }</p>
          </div>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon3.png" alt="" class="w-[25px]" />
            <p>Gender: ${pet?.gender ? pet?.gender : "Not Available"}</p>
          </div>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon4.png" alt="" class="w-[25px]" />
            <p>Price: ${pet?.price ? pet?.price : "Not Available"}$</p>
          </div>
        </div>
        <div class="border border-gray-200 my-2"></div>
        <div class="grid grid-cols-3 items-center gap-5">
        <button id='liked-pet-${pet.petId}' onclick="likeButtonClickHandler('${
      pet.petId
    },${pet.image}')">
        <img src="../images/like.png" class="hover:bg-gray-300 bg-gray-100 px-3 py-2
         border-gray-300 rounded-md"/>
         </button>
        <button class="btn btn-md text-[#0E7A81] font-bold" id='adopt-btn-${
          pet.petId
        }' onclick="showAdoptProcess('${pet.petId}')">Adopt</button>
      <dialog id="adopt-${
        pet.petId
      }" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <img src="../images/taxi-handshake-to-seal-a-deal-between-businessmen.gif"/>
            <p class="text-center text-2xl font-extrabold my-3">Please Wait! Your Adoption is processing</p>
            <div>
            <p id="countdown-display-${
              pet.petId
            }" class="text-center text-4xl font-bold my-3"></p>
            <div id="congo-image-${pet.petId}">
            </div>
        </div>
      </dialog>
        <button class="btn btn-md text-[#0E7A81] font-bold" id="details-btn-${
          pet.petId
        }"
        onclick="showPetDetails('${pet.petId}')">Details</button>
         <dialog id="details-${
           pet.petId
         }" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
        <img src="${pet.image}" class="w-full rounded-lg"/>
        <h2 class="text-xl font-extrabold my-3">${pet.pet_name}</h2>
        <div>
        <div class="grid grid-cols-2">
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon1.png" alt="" class="w-[25px]" />
            <p>Breed: ${pet.breed ? pet.breed : "Not Available"}</p>
          </div>
           <div class="flex items-center my-2 gap-3">
            <img src="./images/icon2.png" alt="" class="w-[25px]" />
            <p>Birth: ${
              pet.date_of_birth ? pet.date_of_birth : "Not Available"
            }</p>
          </div>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon3.png" alt="" class="w-[25px]" />
            <p>Gender: ${pet?.gender ? pet?.gender : "Not Available"}</p>
          </div>
          <div class="flex items-center my-2 gap-3">
            <img src="./images/icon4.png" alt="" class="w-[25px]" />
            <p>Price: ${pet?.price ? pet?.price : "Not Available"}$</p>
          </div>
        </div>
        <div>
          <div class="flex items-center my-2 gap-3">
            <img src="../images/syringe.png" alt="" class="w-[25px]" />
            <p>Vaccinated Status: ${
              pet?.vaccinated_status ? pet?.vaccinated_status : "Not Available"
            }</p>
          </div>
        </div>
        </div>
        <div>
        <h3 class="text-lg font-bold my-3">Details Information:</h3>
        <p class="font-medium">${pet.pet_details}</p>
        </div>
          <div class="modal-action ">
            <form method="dialog" class="w-[636px] ">
              <button class="btn w-full bg-[#0E7A811A] text-[#0E7A81]">Close</button>
            </form>
          </div>
        </div>
      </dialog>
        </div>
    `;
    div.classList = "bg-white shadow-lg p-5 rounded-lg";
    allPetsContainer.appendChild(div);
  });
};

const likeButtonClickHandler = (data) => {
  const split = data.split(",");
  const id = split[0];
  // const likeBtn = document.getElementById(`liked-pet-${id}`);
  const imgLink = split[1];
  console.log(id, imgLink);
  const favPetContainer = document.getElementById("fav-pet-container");
  const div = document.createElement("div");
  const h1 = document.getElementById("fav-pet-containerDummyText");
  h1.innerHTML = "";
  const h1Div = document.getElementById("h1-div");
  h1Div.classList = "";
  div.innerHTML = `
  <img src="${imgLink}" class="rounded-lg"/>
  `;
  favPetContainer.classList =
    "grid grid-cols-1 md:grid-cols-2 gap-5 bg-white shadow-lg p-5 shadow-black rounded-lg";
  favPetContainer.appendChild(div);
};
// Sort by Price
const sortPetByPrice = async () => {
  const url = `https://openapi.programming-hero.com/api/peddy/pets`;
  const res = await fetch(url);
  const data = await res.json();
  const sortedPets = data.pets.sort((a, b) => b.price - a.price);
  loadAllPetsData(sortedPets);
};

//ShowModal Pet Details
function showPetDetails(petId) {
  const modal = document.getElementById(`details-${petId}`);
  modal.showModal();
}
const counter = (petId) => {
  let count = 3;
  const btn = document.getElementById(`adopt-btn-${petId}`);
  const displayElement = document.getElementById(`countdown-display-${petId}`);
  const congoImage = document.getElementById(`congo-image-${petId}`);
  const interval = setInterval(() => {
    displayElement.innerText = count;
    count--;
    if (count < 0) {
      clearInterval(interval);
      displayElement.textContent = "Congratulations!!!";
      congoImage.innerHTML = `
      <div class="flex justify-center">
       <img src="../images/fabulous-big-firework.png" class="w-[100px]"/>
      </div>`;
    }
  }, 1000);
  btn.setAttribute("disabled", true);
  btn.innerText = "Adopted";
  displayElement.textContent = "";
  congoImage.innerHTML = "";
};
//Show Modal for Adopt btn
function showAdoptProcess(petId) {
  const modal = document.getElementById(`adopt-${petId}`);
  // console.log(petId);
  modal.showModal();
  counter(petId);
  setTimeout(() => {
    modal.close();
  }, 5500);
}

allPetsFetch();

// grid grid-cols-1 md:grid-cols-2 gap-5
