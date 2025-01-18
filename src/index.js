let addToy = false; 
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form"); 

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetchToys(); 

  
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault(); 

    console.log("🚀 Form submitted!"); 

    const toyName = event.target.name.value.trim(); 
    const toyImage = event.target.image.value.trim();

    if (!toyName || !toyImage || !toyImage.startsWith("http")) {
      console.error("Name or Image URL is invalid!");
      alert("Please enter a valid toy name and image URL (must start with 'http').");
      return;
    }

    console.log(`Creating toy: ${toyName}, ${toyImage}`); 

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    createToy(newToy);
    toyForm.reset();
  });
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      console.log("Fetched Toys:", toys); 
      toys.forEach(toy => renderToyCard(toy));
    })
    .catch(error => console.error("Error fetching toys:", error));
}

function renderToyCard(toy) {
  console.log("Rendering Toy:", toy); 

  const toyCollection = document.getElementById("toy-collection");

  const toyCard = document.createElement("div");
  toyCard.classList.add("card");

  toyCard.innerHTML = `
    <h2>${toy.name || "Unnamed Toy"}</h2>
    <img src="${toy.image || "https://via.placeholder.com/150"}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  toyCard.querySelector(".like-btn").addEventListener("click", () => {
    likeToy(toy, toyCard);
  });

  toyCollection.appendChild(toyCard);
}

function createToy(toy) {
  console.log("📤 Sending POST request...", toy);

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to add toy!");
    }
    return response.json();
  })
  .then(newToy => {
    console.log("Toy added successfully!", newToy);
    renderToyCard(newToy); 
  })
  .catch(error => console.error("Error adding toy:", error));
}

function likeToy(toy, toyCard) {
  console.log(`Clicked like on: ${toy.name} (Current likes: ${toy.likes})`); 

  const updatedLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ likes: updatedLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    console.log(`Updated likes for ${updatedToy.name}: ${updatedToy.likes}`); 
    toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    toy.likes = updatedToy.likes; 
  })
  .catch(error => console.error("Error updating likes:", error));
}
