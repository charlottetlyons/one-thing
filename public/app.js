const firebaseConfig = {
    apiKey: "AIzaSyCXJR9PqQQkua1XDp1Rcz78pFWaa-kqG7o",
    authDomain: "onething-fcefc.firebaseapp.com",
    projectId: "onething-fcefc",
    storageBucket: "onething-fcefc.appspot.com",
    messagingSenderId: "886064140436",
    appId: "1:886064140436:web:50b213ae1cf2a896ece481",
    measurementId: "G-FQ3R0GYJBW",
};

const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();

const newThingInput = document.getElementById("new-thing-input")
const newThingButton = document.getElementById("new-thing-button")
const thingList = document.getElementById("thing-list")

const loginView = document.getElementById("login-view")
const userView = document.getElementById("user-view")

const signInButton = document.getElementById("sign-in-button")
const signOutButton = document.getElementById("sign-out-button")

const details = document.getElementById("details")

const provider = new firebase.auth.GoogleAuthProvider();

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('things');
        newThingButton.onclick = () => {
            thingsRef.add({
                uid: user.uid,
                task: newThingInput.value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
        }

        unsubscribe = thingsRef.where('uid', '==', user.uid).onSnapshot(querySnapshot => {
            const items = querySnapshot.docs.map(doc => {
                return `<li>${doc.data().task}</li>`;
            });

            thingList.innerHTML = items.join('');
        });
        
        loginView.hidden = true
        userView.hidden = false
        details.innerHTML = `<h2>${user.displayName}</h2>`;
    } else {
        unsubscribe && unsubscribe();
        loginView.hidden = false
        userView.hidden = true
    }
});


signInButton.onclick = () => auth.signInWithPopup(provider);
signOutButton.onclick = () => auth.signOut();