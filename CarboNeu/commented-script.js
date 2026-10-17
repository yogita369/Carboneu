// <!-- <script>
// const steps = [
//   // ENERGY category
//   { title: "Energy - Page 1", fields: ["AC", "Heater(Gyser)","Refrigerator", "Washing Machine", "Fan"] },

//   // TRAVEL category
//   { title: "Travel - Page 1", fields: ["Air Travel (km)", "Train Travel (km)", "Metro Travel (km)"] },
//   { title: "Travel - Page 2", fields: ["Bus (km)", "Cab/Car (km)", "Electric Bus (km)", "Electric Car (km)"] },

//   // FUEL category
//   { title: "Fuel - Page 1", fields: ["LPG/CNG (kg)", "Wood (kg)", "Coal (kg)"] },
//   { title: "Fuel - Page 2", fields: ["Petrol (L)", "Diesel (L)", "LPG/CNG (L)"] },
// ];

// let currentStep = 0;
// const userData = {};

// const titleEl = document.getElementById("categoryTitle");
// const inputsContainer = document.getElementById("inputsContainer");
// const nextBtn = document.getElementById("nextBtn");
// const backBtn = document.getElementById("backBtn");

// // Render current step fields dynamically
// function renderStep() {
//   const step = steps[currentStep];
//   titleEl.textContent = step.title;

//   // Clear old inputs
//   inputsContainer.innerHTML = "";

//   // Add new inputs for this step
//   step.fields.forEach(field => {
//     // const group = document.createElement("div");
//     // group.classList.add("input-group");

//     // const label = document.createElement("label");
//     // label.textContent = field;

//     // const input = document.createElement("input");
//     // input.type = "number";
// //     const group = document.createElement("div");
// // group.classList.add("input-group");

// // const iconBox = document.createElement("div");
// // iconBox.classList.add("icon-box");
// // iconBox.textContent = "🖼️"; // temporary placeholder
// // group.appendChild(iconBox);

// // const label = document.createElement("label");
// // label.textContent = field;

// // const input = document.createElement("input");
// // input.type = "number";

// // ✅ Simple helper to create each input group
// function createInputGroup(field) {
//   const group = document.createElement("div");
//   group.classList.add("input-group");

//   // Create icon container
//   const iconBox = document.createElement("div");
//   iconBox.classList.add("icon-box");

//   // Simplify field name for file (remove spaces, parentheses, lowercase)
//   const cleanName = field.toLowerCase().replace(/[^a-z0-9]/g, "");

//   // Create <img> for SVG icon
//   const img = document.createElement("img");
//   img.src = `assets/${cleanName}.svg`;

//   // If SVG not found, fallback to default.svg
//   img.onerror = () => {
//     img.src = "assets/default.svg";
//   };

//   img.alt = `${field} icon`;
//   img.classList.add("icon");
//   iconBox.appendChild(img);
//   group.appendChild(iconBox);

//   // Label + Input
//   const label = document.createElement("label");
//   label.textContent = field;

//   const input = document.createElement("input");
//   input.type = "number";
//   input.placeholder = "Enter value";
//   input.value = userData[field] || "";

//   // Update data
//   input.oninput = () => {
//     userData[field] = parseFloat(input.value) || 0;
//     console.log("Updated userData:", userData);
//   };

//   group.appendChild(label);
//   group.appendChild(input);
//   inputsContainer.appendChild(group);
// }

//     input.value = userData[field] || "";
//     input.placeholder = "Enter value";

//     // Store input value into userData object
//     input.oninput = () => {
//       userData[field] = parseFloat(input.value) || 0;
//       console.log("Updated userData:", userData); // debug log
//     };

//     group.appendChild(label);
//     group.appendChild(input);
//     inputsContainer.appendChild(group);
//   });

//   backBtn.disabled = currentStep === 0;
//   nextBtn.textContent = currentStep === steps.length - 1 ? "Submit" : "Next";
// }

// // Handle "Next" button click
// nextBtn.addEventListener("click", () => {
//   if (currentStep < steps.length - 1) {
//     currentStep++;
//     renderStep();
//   } else {
//     // ✅ Final submission: send data to backend
//     console.log("Form submitted!", userData);

//     fetch("http://localhost:5000/input/submit-input", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         userId: "12345", // Optional: replace with logged-in user id
//         userData: userData
//       })
//     })
//     .then(response => response.json())
//     .then(data => {
//       console.log("Response from backend:", data);
//       alert("✅ Data successfully sent to backend!");
//     })
//     .catch(error => {
//       console.error("Error sending data:", error);
//       alert("❌ Something went wrong while submitting!");
//     });
//   }
// });

// // Handle "Back" button click
// backBtn.addEventListener("click", () => {
//   if (currentStep > 0) {
//     currentStep--;
//     renderStep();
//   }
// });

// // Initial render
// renderStep();
// </script> -->
