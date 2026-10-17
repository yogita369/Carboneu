document.addEventListener("DOMContentLoaded", function () {
  // Only run this script on the registration page
  if (document.getElementById("registrationForm")) {
    const foodPreferenceRadios = document.querySelectorAll(
      'input[name="food-preference"]'
    );
    const meatFrequencySection = document.getElementById("meat-frequency");
    const renewableEnergyRadios = document.querySelectorAll(
      'input[name="renewable-energy"]'
    );
    const renewablePercentageSection = document.getElementById(
      "renewable-percentage"
    );
    const applianceCheckboxes = document.querySelectorAll(
      'input[name="appliances"]'
    );

    // Show/hide meat frequency based on food preference
    foodPreferenceRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "meat-eater") {
          meatFrequencySection.classList.remove("hidden");
          setTimeout(() => {
            meatFrequencySection.classList.add("fade-in");
            meatFrequencySection.classList.add("pulse");
          }, 10);

          // Remove pulse animation after it completes
          setTimeout(() => {
            meatFrequencySection.classList.remove("pulse");
          }, 1500);
        } else {
          meatFrequencySection.classList.add("hidden");
          meatFrequencySection.classList.remove("fade-in");
          // Clear meat frequency selection
          document
            .querySelectorAll('input[name="meat-frequency"]')
            .forEach((radio) => {
              radio.checked = false;
            });
        }
      });
    });

    // Show/hide renewable energy percentage
    renewableEnergyRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "yes") {
          renewablePercentageSection.classList.remove("hidden");
          setTimeout(() => {
            renewablePercentageSection.classList.add("fade-in");
            renewablePercentageSection.classList.add("pulse");
          }, 10);

          // Remove pulse animation after it completes
          setTimeout(() => {
            renewablePercentageSection.classList.remove("pulse");
          }, 1500);
        } else {
          renewablePercentageSection.classList.add("hidden");
          renewablePercentageSection.classList.remove("fade-in");
          // Clear percentage selection
          document.getElementById("energy-percentage").value = "";
        }
      });
    });

    // Handle appliance selection
    applianceCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        const appliance = this.value;
        const detailsContainer = document.getElementById(
          `${appliance}-details`
        );

        if (this.checked) {
          detailsContainer.classList.remove("hidden");
          setTimeout(() => {
            detailsContainer.classList.add("fade-in");
          }, 10);

          // Create appliance details content
          createApplianceDetails(appliance);
        } else {
          detailsContainer.classList.add("hidden");
          detailsContainer.classList.remove("fade-in");
          detailsContainer.innerHTML = "";

          // Clear lighting type if it's lighting appliance
          if (appliance === "lighting") {
            const lightingTypeRadios = document.querySelectorAll(
              'input[name="lighting-type"]'
            );
            lightingTypeRadios.forEach((radio) => {
              radio.checked = false;
            });
          }
        }
      });
    });

    // Function to create appliance details content
    function createApplianceDetails(appliance) {
      const detailsContainer = document.getElementById(`${appliance}-details`);

      // Get appliance display name
      const displayName = getApplianceDisplayName(appliance);

      let detailsHTML = "";

      detailsHTML += `
        <div class="quantity-input-group">
          <div class="input-box">
            <input type="number" placeholder="Enter quantity of ${displayName}" min="1" max="20" 
                   id="${appliance}-quantity" class="quantity-input">
            <i class='bx bx-hash'></i>
          </div>
        </div>
        <div id="${appliance}-power-star" class="power-star-group hidden"></div>
      `;

      detailsContainer.innerHTML = detailsHTML;

      // Add event listener for quantity input
      const quantityInput = document.getElementById(`${appliance}-quantity`);
      quantityInput.addEventListener("input", function () {
        const quantity = parseInt(this.value) || 0;
        const powerStarContainer = document.getElementById(
          `${appliance}-power-star`
        );

        if (quantity > 0 && quantity <= 20) {
          powerStarContainer.classList.remove("hidden");
          setTimeout(() => {
            powerStarContainer.classList.add("fade-in");
          }, 10);
          generatePowerStarInputs(appliance, quantity);
        } else {
          powerStarContainer.classList.add("hidden");
          powerStarContainer.innerHTML = "";
        }
      });
    }

    // Function to generate power and star rating inputs based on quantity
    function generatePowerStarInputs(appliance, quantity) {
      const container = document.getElementById(`${appliance}-power-star`);

      // Get appliance display name
      const displayName = getApplianceDisplayName(appliance);

      let powerStarHTML = `
        <div class="power-star-grid">
          <div class="power-input-group">
            <h4>Power (Watts)</h4>
      `;

      // Create power inputs
      for (let i = 1; i <= quantity; i++) {
        powerStarHTML += `
          <div class="input-box">
            <input type="number" placeholder="${displayName} ${i} power" 
                     id="${appliance}-power-${i}" min="1" max="5000" class="power-input">
            <i class='bx bx-bolt'></i>
          </div>
        `;
      }

      powerStarHTML += `
          </div>
          <div class="star-input-group">
            <h4>Star Rating</h4>
      `;

      // Create star rating inputs
      for (let i = 1; i <= quantity; i++) {
        powerStarHTML += `
          <div class="input-box">
            <input type="number" placeholder="${displayName} ${i} stars" 
                   id="${appliance}-star-${i}" min="1" max="5" step="0.5" class="star-input">
            <i class='bx bx-star'></i>
          </div>
        `;
      }

      powerStarHTML += `
          </div>
        </div>
      `;

      container.innerHTML = powerStarHTML;
    }

    // Helper function to get display name for appliance
    function getApplianceDisplayName(appliance) {
      const names = {
        fan: "Fan",
        refrigerator: "Refrigerator",
        television: "Television",
        lighting: "Lighting",
        "washing-machine": "Washing Machine",
        ac: "AC/Cooler",
        geyser: "Geyser",
      };
      return names[appliance] || appliance;
    }

    // Add hover effects to all radio and appliance labels
    const allLabels = document.querySelectorAll(
      ".radio-label, .appliance-label"
    );
    allLabels.forEach((label) => {
      label.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-3px)";
      });

      label.addEventListener("mouseleave", function () {
        const input = this.previousElementSibling;
        if (input && !input.checked) {
          this.style.transform = "translateY(0)";
        }
      });
    });

    // Form submission
    document
      .getElementById("registrationForm")
      .addEventListener("submit", function (e) {
        const selectedAppliances = [];
        document
          .querySelectorAll('input[name="appliances"]:checked')
          .forEach((checkbox) => {
            const appliance = checkbox.value;
            const quantity = parseInt(
              document.getElementById(`${appliance}-quantity`).value
            );
            const details = [];
            for (let i = 1; i <= quantity; i++) {
              const power = parseInt(
                document.getElementById(`${appliance}-power-${i}`).value
              );
              const star = parseFloat(
                document.getElementById(`${appliance}-star-${i}`).value
              );
              details.push({ powerKWh: power, starRating: star });
            }
            selectedAppliances.push({
              name: appliance,
              count: quantity,
              details,
            });
          });

        // Add hidden input to form
        let hiddenInput = document.getElementById("appliancesData");
        if (!hiddenInput) {
          hiddenInput = document.createElement("input");
          hiddenInput.type = "hidden";
          hiddenInput.name = "appliancesData";
          hiddenInput.id = "appliancesData";
          this.appendChild(hiddenInput);
        }
        hiddenInput.value = JSON.stringify(selectedAppliances);
      });
  }
});
