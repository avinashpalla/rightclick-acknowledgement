alert("Script.js loaded");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = { /* your config - keep same */ };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const customerName = document.getElementById("customerName").value.trim();
      const mobile = document.getElementById("mobile").value.trim();
      const item = document.getElementById("item").value;
      const problem = document.getElementById("problem").value.trim();
      const signature = document.getElementById("signature").value.trim();

      const accessories = {
        adapter: document.getElementById("accAdapter").checked,
        cable: document.getElementById("accCable").checked,
        hdmiVga: document.getElementById("accHdmiVga").checked,
        other: document.getElementById("accOther").value.trim()
      };

      const jobId = "RC-" + Date.now();

      await addDoc(collection(db, "jobs"), {
        jobId,
        customerName,
        mobile,
        item,
        accessories,
        problem,
        status: "Received",
        receivedDate: serverTimestamp(),
        signature
      });

      // Build accessories string for print & WA
      let accList = [];
      if (accessories.adapter) accList.push("Adapter");
      if (accessories.cable) accList.push("Power Cable");
      if (accessories.hdmiVga) accList.push("HDMI/VGA Cable");
      if (accessories.other) accList.push(accessories.other);
      const accString = accList.length ? accList.join(", ") : "None";

      // Printable slip
      const printContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Acknowledgement - ${jobId}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 30px; max-width: 800px; margin: auto; line-height: 1.6; }
    h2 { text-align: center; color: #003366; }
    .label { font-weight: bold; }
    hr { margin: 20px 0; }
    ul { margin-left: 20px; }
    @media print { button { display: none; } }
  </style>
</head>
<body>
  <h2>RightClick Computer Sales & Service Center</h2>
  <p style="text-align:center;">[Shop Address, Visakhapatnam]<br>Mobile: [Your Number]<br>Email: [email]</p>
  <hr>
  <h3>Customer Acknowledgement Receipt</h3>
  <p><span class="label">Job ID:</span> ${jobId}</p>
  <p><span class="label">Date:</span> ${new Date().toLocaleDateString('en-IN')}</p>
  <p><span class="label">Customer:</span> ${customerName}</p>
  <p><span class="label">Mobile:</span> ${mobile}</p>
  <p><span class="label">Item:</span> ${item}</p>
  <p><span class="label">Accessories:</span> ${accString}</p>
  <p><span class="label">Problem:</span> ${problem}</p>
  <p><span class="label">Received By:</span> ${signature}</p>
  <hr>
  <p><strong>Terms & Conditions:</strong></p>
  <ul>
    <li>Backup your data - we are not responsible for data loss.</li>
    <li>Estimated time will be informed later.</li>
    <li>Warranty on repairs as per policy.</li>
    <li>Please quote Job ID for enquiries.</li>
  </ul>
  <p style="text-align:center; margin-top:30px;">Thank you for choosing RightClick!</p>
  <div style="text-align:center; margin-top:30px;">
    <button onclick="window.print()" style="padding:15px 30px; font-size:18px; background:#003366; color:white; border:none;">Print Receipt</button>
  </div>
</body>
</html>`;
      const printWin = window.open('', '_blank');
      printWin.document.write(printContent);
      printWin.document.close();
      printWin.focus();

      // WhatsApp to customer
      let customerNumber = mobile;
      if (!customerNumber.startsWith("91")) customerNumber = "91" + customerNumber;
      const waMessage = encodeURIComponent(
`RightClick Computer Sales & Service Center

Thank you ${customerName}!
Your ${item} has been received.

Job ID: ${jobId}
Problem: ${problem}

We will update you soon.`);
      window.open(`https://wa.me/${customerNumber}?text=${waMessage}`, "_blank");

      alert(`Success! Job ID: ${jobId}\nPrint window opened.`);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Error - check console.");
    }
  });
});
