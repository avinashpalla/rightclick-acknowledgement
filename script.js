document.querySelector("form").addEventListener("submit", function (e) {
const firebaseConfig = {
    apiKey: "AIzaSyB8uRXxvOyZeCUzPEt-pUytXj_R8N_JLww",
    authDomain: "rightclick-service-center.firebaseapp.com",
    projectId: "rightclick-service-center",
    storageBucket: "rightclick-service-center.firebasestorage.app",
    messagingSenderId: "558210394752",
    appId: "1:558210394752:web:a3f8663d7c6dc8cc88d465"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();
 
  // Generate simple Job ID
  const jobId = "RC-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

  // Read form values
  const customerName = document.querySelector('input[placeholder="Customer Name"]').value;
  const mobile = document.querySelector('input[placeholder="Mobile Number"]').value;
  const item = document.querySelector('select').value;
  const problem = document.querySelector('textarea').value;

  // Accessories
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const accessories = {};
  checkboxes.forEach(cb => {
    accessories[cb.nextSibling.textContent.trim()] = cb.checked;
  });

  const otherItems = document.querySelector('input[placeholder="Other items"]').value;

  // Save to Firestore
  await db.collection("jobs").add({
    jobId,
    customerName,
    mobile,
    item,
    accessories: {...accessories, other: otherItems},
    problem,
    status: "Received",
    receivedDate: new Date(),
    signature: "RightClick Computer Sales & Service Center"
  });

  alert("Acknowledgement generated successfully!\nJob ID: " + jobId);
});
