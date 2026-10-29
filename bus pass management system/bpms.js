// Import Firebase modules
import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -----------------------------
// Registration (User/Admin)
// -----------------------------
const registrationForm = document.getElementById("registration-form");
registrationForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullName = document.getElementById("full-name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("user-role").value;

  if (!role) {
    alert("Please select a role.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const collectionName = role === "admin" ? "admins" : "users";

    await setDoc(doc(db, collectionName, user.uid), {
      fullName,
      email,
      role,
    });

    alert(`${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully!`);
    window.location.href = "bpms.html";
  } catch (error) {
    console.error("Registration Error:", error.message);
    alert(error.message);
  }
});

// -----------------------------
// Logout Button (Optional)
// -----------------------------
const logoutBtn = document.getElementById("logout-btn");
logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  alert("Logged out!");
  window.location.href = "index.html";
});

// -----------------------------
// Bus Pass - Create & Renew
// -----------------------------
const formType = document.getElementById("form-type");
const createFields = document.getElementById("create-fields");
const renewFields = document.getElementById("renew-fields");
const busPassForm = document.getElementById("bus-pass-form");

formType?.addEventListener("change", () => {
  const selected = formType.value;
  createFields.style.display = selected === "create" ? "block" : "none";
  renewFields.style.display = selected === "renew" ? "block" : "none";
});

busPassForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selectedType = formType.value;

  try {
    if (selectedType === "create") {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const duration = parseInt(document.getElementById("create-duration").value);

      const docRef = await addDoc(collection(db, "bus_passes"), {
        name,
        email,
        duration,
        createdAt: serverTimestamp(),
      });

      alert(`Bus pass created! ID: ${docRef.id}`);
    } else if (selectedType === "renew") {
      const passId = document.getElementById("pass-id").value;
      const newDuration = parseInt(document.getElementById("renew-duration").value);

      await addDoc(collection(db, "renewals"), {
        passId,
        newDuration,
        renewedAt: serverTimestamp(),
      });

      alert(`Bus pass ${passId} renewed for ${newDuration} days.`);
    }

    busPassForm.reset();
    createFields.style.display = "none";
    renewFields.style.display = "none";
  } catch (error) {
    console.error("Bus Pass Error:", error.message);
    alert("An error occurred. Please try again.");
  }
});

