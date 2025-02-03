// **À IMPLEMENTER**
// Devrait permettre de regarder si l'utilisateur est authentifié 
const isAuthenticated = () => {
  if (!localStorage.getItem("token")) {
    return false;
  } else {
    return true;
  }
};

// Affiche un message à l'utilisateur.
const displayMessage = (message) => {
  document.querySelector(".message").textContent = message; // Sélectionne l'élément de message et met à jour son texte.
};

// Gère l'affichage des éléments de l'interface en fonction de l'état d'authentification.
const handleInterfaceAuth = () => {
  const auth = isAuthenticated(); // Vérifie si l'utilisateur est authentifié.
  document
    .querySelectorAll(".requires-auth")
    .forEach((el) => el.classList.toggle("hidden", !auth)); // Cache ou montre les éléments nécessitant une authentification.
  document
    .querySelectorAll(".requires-unauth")
    .forEach((el) => el.classList.toggle("hidden", auth)); // Cache ou montre les éléments ne nécessitant pas d'authentification.
};

// Basculer entre les formulaires de connexion et d'inscription.
const toggleForm = (formName) => {
  document
    .querySelectorAll("form")
    .forEach((form) => form.classList.remove("active")); // Désactive tous les formulaires.
  document.querySelector(`form[name='${formName}']`).classList.add("active"); // Active le formulaire spécifié.

  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active")); // Désactive tous les onglets.
  document.querySelector(`.tab#${formName}`).classList.add("active"); // Active l'onglet spécifié.
};

// **À COMPLETER**
// Initialisation de la page
const initEventListeners = () => {
  document.querySelector(".tab-container").addEventListener("click", (e) => {
    // Gère les clics sur les onglets.
    if (e.target.classList.contains("tab")) {
      toggleForm(e.target.id); // Bascule le formulaire actif en fonction de l'onglet cliqué.
    }
  });
};

// **À COMPLETER**



const signUpButton = document.querySelector('form[name="signup"] button');
const signUpform = document.querySelector('form[name="signup"]');
const logInButton = document.querySelector('form[name="login"] button');
const logInForm = document.querySelector('form[name="login"]');
const logOutButton = document.querySelector('button[name="logout"]');
const ul = document.querySelector('ul');


signUpButton.addEventListener("click", async (event) => {

  event.preventDefault();

  const formData = new FormData(signUpform);
  const email = formData.get("email");
  const password = formData.get("password");

  if (password && email) {
    try {
      await signup(email, password);
    } catch (e) {
      console.log(e);
    }
  }
  signUpform.reset();

});


logInButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = new FormData(logInForm);
  const email = formData.get("email");
  const password = formData.get("password");

  try {

    let body = {
      "email": email,
      "password": password
    }

    const rep = await fetch('https://progweb-todo-api.onrender.com/users/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });
    const data = await rep.json();


    if (data.status == "success") {
      localStorage.setItem("token", data.token);
      handleInterfaceAuth();
      displayToDos();
    }

    displayMessage(data.status);



    return data;
  } catch (e) {
    console.log(e);
  }


})


logOutButton.addEventListener("click", (e) => {
  localStorage.clear();
  handleInterfaceAuth();
});



const signup = async (email, password) => {

  let body = {
    "email": email,
    "password": password
  }

  const rep = await fetch('https://progweb-todo-api.onrender.com/users/', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });


  const data = await rep.json();
  displayMessage(data.message);

  return data;

}

const getToDos = async () => {

  const token = localStorage.getItem("token");

  try {
    const rep = await fetch('https://progweb-todo-api.onrender.com/todos/', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await rep.json();

    return data;

  } catch (e) {
    console.log(e);
  }

}

const displayToDos = async () => {
  ul.innerHTML = "";
  const data = await getToDos();
  console.log(data);


  data.todos.forEach(element => {
    const li = document.createElement("li");
    li.id = element.id;

    const pBody = document.createElement("p");
    pBody.classList.add("body");
    pBody.textContent = element.body;

    const pTags = document.createElement("p");
    pTags.classList.add("tags");
    pTags.textContent = element.tags;

    const divDelete = document.createElement("div");
    divDelete.classList.add("delete");

    li.appendChild(pBody);
    li.appendChild(pTags);
    li.appendChild(divDelete);
    ul.appendChild(li);

  });

}

const todoButton = document.querySelector("form[name='todo'] button");
const todoForm = document.querySelector("form[name='todo']");

todoButton.addEventListener("click", async (e)=> {

  e.preventDefault();

  const formData = new FormData(todoForm);
  const token = localStorage.getItem("token");

  const bodyToDo = formData.get("body");
  const tags = formData.get("tags");


  const body = {
    "body" : bodyToDo,
    "tags" : tags
  }
  console.log(body);

  try {
    const rep = await fetch("https://progweb-todo-api.onrender.com/todos/", 
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })

    const data = await rep.json();
    displayMessage(data.message);
    await displayToDos();
    todoForm.reset();

  } catch (e) {
    console.log(e);
  }


})

ul.addEventListener("click", async (e)=> {

  if(e.target.outerHTML == '<div class="delete"></div>') {
    console.log("delete");
    const token = localStorage.getItem("token");
    const id = e.target.parentElement.id;
    console.log(id);


    try {
      const todoForm = document.querySelector("form[name='todo']");
      const rep = await fetch(`https://progweb-todo-api.onrender.com/todos/${id}`, 
      {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      const data = await rep.json();
      displayMessage(data.message);
      await displayToDos();


    } catch(e) {
      console.log(e);
    }

  }else {
    console.log("non");
  }

}) 


const pageLoad = async () => {
  handleInterfaceAuth();
  initEventListeners();
  await displayToDos();
};

pageLoad();