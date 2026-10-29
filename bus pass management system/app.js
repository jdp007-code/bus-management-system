const auth = firebase.auth();
const statusElement = document.getElementById('status');

// Sign Up Function
function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      statusElement.textContent = `Signed Up: ${user.email}`;
    })
    .catch((error) => {
      statusElement.textContent = error.message;
    });
}

// Sign In Function
function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      statusElement.textContent = `Logged In: ${user.email}`;
    })
    .catch((error) => {
      statusElement.textContent = error.message;
    });
}

// Sign Out Function
function signOut() {
  auth.signOut()
    .then(() => {
      statusElement.textContent = "User signed out";
    })
    .catch((error) => {
      statusElement.textContent = error.message;
    });
}
