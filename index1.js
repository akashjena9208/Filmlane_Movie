// Import initializeApp from firebase/app
import { initializeApp } from "firebase/app";

// Import other necessary modules from firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARE-fcf_NHbxdRaSFQBOtsSx7gSyeqNsQ",
  authDomain: "movie-website-e6578.firebaseapp.com",
  projectId: "movie-website-e6578",
  storageBucket: "movie-website-e6578.appspot.com",
  messagingSenderId: "184432324787",
  appId: "1:184432324787:web:89695ad6db9ddb139c80c6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Set up our register function
function register() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const full_name = document.getElementById('full_name').value;
  const favourite_song = document.getElementById('favourite_song').value;
  const milk_before_cereal = document.getElementById('milk_before_cereal').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }
  if (!validate_field(full_name) || !validate_field(favourite_song) || !validate_field(milk_before_cereal)) {
    alert('One or More Extra Fields is Outta Line!!');
    return;
  }

  // Move on with Auth
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Declare user variable
      const user = userCredential.user;

      // Add this user to Firebase Database
      const databaseRef = ref(database);

      // Create User data
      const user_data = {
        email: email,
        full_name: full_name,
        favourite_song: favourite_song,
        milk_before_cereal: milk_before_cereal,
        last_login: Date.now()
      };

      // Push to Firebase Database
      set(ref(database, 'users/' + user.uid), user_data);

      // Done
      alert('User Created!!');
    })
    .catch((error) => {
      // Firebase will use this to alert of its errors
      const error_code = error.code;
      const error_message = error.message;

      alert(error_message);
    });
}

// Set up our login function
function login() {
  // Get all our input fields
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Validate input fields
  if (!validate_email(email) || !validate_password(password)) {
    alert('Email or Password is Outta Line!!');
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Declare user variable
      const user = userCredential.user;

      // Add this user to Firebase Database
      const databaseRef = ref(database);

      // Create User data
      const user_data = {
        last_login: Date.now()
      };

      // Push to Firebase Database
      update(ref(database, 'users/' + user.uid), user_data);

      // Done
      alert('User Logged In!!');
    })
    .catch((error) => {
      // Firebase will use this to alert of its errors
      const error_code = error.code;
      const error_message = error.message;

      alert(error_message);
    });
}

// Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+\w$/;
  return expression.test(email);
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  return password.length >= 6;
}

function validate_field(field) {
  return field !== null && field.length > 0;
}
