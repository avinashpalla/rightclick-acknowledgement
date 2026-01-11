alert("Script.js loaded");
// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB8uRXxvOyZeCUzPEt-pUytXj_R8N_JLww",
  authDomain: "rightclick-service-center.firebaseapp.com",
  projectId: "rightclick-service-center",
  storageBucket: "rightclick-service-center.firebasestorage.app",
  messagingSenderId: "558210394752",
  appId: "1:558210394752:web:a3f8663d7c6dc8cc88d465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait for page load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      // Collect form values
      const customerName = document.getElementById("customerName").value;
      const mobile = document.getElementById("mobile").value;
      const item = document.getElementById("item").value;
      const problem = document.getElementById("problem").value;
      const signature = document.getElementById("signature").value;

      // Accessories (checkboxes)
      const accessories = {
        adapter: document.getElementById("accAdapter")?.checked || false,
        cable: document.getElementById("accCable")?.checked || false,
        bag: document.getElementById("accBag")?.checked || false,
        other: document.getElementById("accOther")?.value || ""
      };

      // Generate Job ID
      const jobId = "RC-" + Date.now();

      // Save to Firestore
      await addDoc(collection(db, "jobs"), {
        jobId: jobId,
        customerName: customerName,
        mobile: mobile,
        item: item,
        accessories: accessories,
        problem: problem,
        status: "Received",
        receivedDate: serverTimestamp(),
        signature: signature
      });

      // Confirmation popup
      alert(`Job Saved Successfully!\nJob ID: ${jobId}`);

      form.reset();

      // ---------------- WhatsApp Free Click-to-Chat ----------------
      const message = encodeURIComponent(
`RightClick Computer Sales & Service Center

Your device has been received successfully.
Job ID: ${jobId}
Thank you for choosing us!`
      );

      // Your WhatsApp number (personal)
      const whatsappNumber = "919059895427"; // 91 + your number

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      // Open WhatsApp in new tab
      window.open(whatsappUrl, "_blank");
      // ----------------------------------------------------------------

    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job. Check console.");
    }
  });
});
