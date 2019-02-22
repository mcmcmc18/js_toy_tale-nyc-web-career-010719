const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector('#toy-collection')
const toyFormDiv = document.querySelector('.add-toy-form')
let toys = []
let addToy = false

// YOUR CODE HERE

fetch('http:localhost:3000/toys')
  .then(function(response) {
  return response.json();
})
  .then(function(myJson) {
  console.log(JSON.stringify(myJson)); // all toys here
  toys = myJson
  showToys(toys);

  // call another function that will add the div
});

function showToys(array) {
  array.forEach(function(e){
    toyCollection.innerHTML += `<div class="card">
      <h2>${e.name}</h2>
      <img src=${e.image} class="toy-avatar" />
      <p>${e.likes} Likes </p>
      <button class="like-btn" data-id=${e.id} data-action="like">Like <3</button>
      </div>`
  })
}


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    //select toyform
    toyForm.addEventListener('submit', function(e){
      e.preventDefault();
      const toyName = toyForm.querySelector('#name').value
      const toyImage = toyForm.querySelector('#image').value
      fetch('http:localhost:3000/toys', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "name": toyName,
          "image": toyImage,
          "likes": 0
          })
        })
        .then(function(response){
          return response.json()
        })
        .then(function(response){
          toys.push(response)
          console.log(toys)
          toyCollection.innerHTML = ""
          showToys(toys)
          toyFormDiv.reset()
          })
        })
  } else {
    toyForm.style.display = 'none'
  }
})
//add the new toy to toys and re-display the data
//end of event listener
//add event listener on form
// submit listener here

toyCollection.addEventListener("click", function(e){
  e.preventDefault()
  if (e.target.dataset.action == "like") {
  let toy = toys.find(t => t.id == e.target.dataset.id)
  toy.likes = toy.likes + 1

  fetch(`http:localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers:{
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
    })
    .then(response => response.json())
    .then(updatedToyLike => {
      toys.map(function(toy){
      if (toy.id ===updatedToyLike.id) {
      return updatedToyLike
    } else {
      return toy
    }
  })
    toyCollection.innerHTML = ""
    showToys(toys)
    })
  }
})
