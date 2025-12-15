// Global variables
let backgroundPhotos = [];
let currentBgIndex = 0;
let nextBgIndex = 1;
let transitionProgress = 0;
let transitionSpeed = 0.00075;
let isTransitioning = true;

let icons = [];
let factImages = [];
let dropletImage;
let smallPoint, largePoint;
let itc;
let facts = [];

let pointsPerFrame = 800;
let baseSize = 2.5;

// Control variables
let showIcons = false;
let firstHover = true;

// References button variables
let refsButton;
let refsModal;
let isModalOpen = false;

// Icon class definition must come BEFORE any code that uses it
class Icon {
  constructor(x, y, size, fact, factImage, dropletImg) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.fact = fact;
    this.factImage = factImage;
    this.dropletImg = dropletImg;
    this.isHovered = false;
    this.pulse = random(0, TWO_PI);
    this.activationDistance = size * 2;
  }
  
  update() {
    let distance = dist(mouseX, mouseY, this.x, this.y);
    this.isHovered = distance < this.activationDistance;
    this.pulse += 0.1;
  }
  
  display() {
    let distanceToMouse = dist(mouseX, mouseY, this.x, this.y);
    if (distanceToMouse < 150) {
      let pulseSize = this.size * (1 + 0.1 * sin(this.pulse));
      
      if (!this.isHovered) {
        if (this.dropletImg) {
          imageMode(CENTER);
          tint(100, 150, 255, 150);
          image(
            this.dropletImg,
            this.x,
            this.y,
            pulseSize,
            pulseSize
          );
          noTint();
        } else {
          fill(30, 144, 255, 100);
          noStroke();
          ellipse(this.x, this.y, pulseSize, pulseSize);
        }
      } else {
        if (this.dropletImg) {
          imageMode(CENTER);
          tint(30, 144, 255, 255);
          image(
            this.dropletImg,
            this.x,
            this.y,
            this.size * 1.5,
            this.size * 1.5
          );
          noTint();
        } else {
          fill(30, 144, 255, 200);
          stroke(255);
          strokeWeight(2);
          ellipse(this.x, this.y, this.size * 1.5, this.size * 1.5);
        }
        
        fill(30, 144, 255, 50);
        noStroke();
        ellipse(this.x, this.y, this.size * 3, this.size * 3);
        
        this.drawFactPopup();
      }
    }
  }
  
  drawFactPopup() {
    fill(255, 245);
    noStroke();
    rectMode(CENTER);
    
    let popupX = this.x + 180;
    let popupY = this.y + 50;
    let popupWidth = 340;
    let popupHeight = 340;
    
    // Check edges of sketch
    if (popupX + popupWidth / 2 > width) {
      popupX = this.x - 180;
    }
    if (popupY + popupHeight / 2 > height) {
      popupY = height - popupHeight / 2;
    }
    if (popupY - popupHeight / 2 < 0) {
      popupY = popupHeight / 2;
    }
    
    //draw background
    fill(0);
    rect(popupX, popupY, popupWidth, popupHeight);
    
    //draw image
    if (this.factImage && this.factImage.width > 0) {
      imageMode(CENTER);
      let imgWidth = min(this.factImage.width, 340);
      let imgHeight = (imgWidth / this.factImage.width) * this.factImage.height;
      image(this.factImage, popupX, popupY - 70, imgWidth, imgHeight);
    } else {
      fill(240);
      rect(popupX, popupY - 40, 140, 90, 5);
      fill(150);
      textAlign(LEFT, BOTTOM);
      textSize(10);
      text("Fact Image", popupX, popupY - 40);
    }
    
    //draw text lower to avoid overlap
    fill(255);
    textAlign(LEFT, TOP);
    if (itc) {
      textFont(itc);
    }
    textSize(17);
    textLeading(19);
    text(this.fact, popupX, popupY + 110, popupWidth - 30, 100);
  }
}

// Preload function
function preload() {
  itc = loadFont("data/fonts/itc.otf");
  
  // Load all background images
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-03.png"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-04.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-05.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-06.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-07.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-08.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-02.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-09.jpg"));
  backgroundPhotos.push(loadImage("data/backgroundImages/bg-10.jpg"));
  
  // Load droplet image
  dropletImage = loadImage("data/icons/drop.png");
  
  // Load all fact images
  for (let i = 1; i <= 15; i++) {
    let num = i < 10 ? '0' + i : i;
    factImages.push(loadImage("data/fact_images/fact_" + num + ".png"));
  }
}

// Setup function
function setup() {
  createCanvas(1450, 850);
  
  // Define facts array
  facts = [
    "It is estimated that by 2030, data centers are projected to require $6.7 trillion worldwide to keep pace with the demand for compute power.",
    "88% of Nvidias revenue comes from data centers.",
    "In the USA, there is no regulatory requirement to register data centers, meaning site-specific power and water use data is often not published.",
    "Water withdrawal of global AI is projected to reach 4.2 – 6.6 billion cubic meters by 2027, which is more than the total annual water withdrawal of 4-6 Denmarks or half of the United Kingdom.",
    "Data center cooling can account for up to 40% of data center energy usage overall.",
    "Google's hyperscale data centers, powering Gmail, Drive, and YouTube, used an average of 2.1 million liters of water daily over the past year. This amount of water can fill an olympic sized pool every 1.2 days.",
    "Data centers consume water both to produce the electricity they run on and to cool the heat their servers generate.",
    "A data center's water footprint includes on-site use, the water used by the power plants that supply its electricity, and the water consumed in making its processor chips.",
    "Data centers use large amounts of water for their cooling systems, which include cooling towers, chillers, pumps, pipes, heat exchangers, condensers, and computer room air handler (CRAH) units.",
    "Data centers are already responsible for around 0.6% of global greenhouse gas emissions and 1% of electricity use.",
    "Globally, data centers use 1.7 Billion gallons of water per day",
    "Data centers are typically connected to municipal water systems, meaning they consume potable water—the same resource allocated for human consumption.",
    "Alternative water sources (rainwater, reclaimed wastewater, graywater, desalinated) contribute less than 5% of a data center's total water supply.",
    "Each cooling cycle concentrates scale-forming minerals (calcium, magnesium, and silica) in datacenter water, ultimately forcing a full water change.",
    "Large data centers can consume up to 5 million gallons per day, equivalent to the water use of a town populated by 10,000 to 50,000 people."
  ];
  
  // RESIZE ALL BACKGROUND IMAGES TO SKETCH SIZE
  for (let i = 0; i < backgroundPhotos.length; i++) {
    if (backgroundPhotos[i]) {
      backgroundPhotos[i].resize(width, height);
    }
  }
  
  // pointSizes
  smallPoint = 1;
  largePoint = 40;
  
  // Create icons array
  icons = [];
  
  // Create icons distributed across the image with minimum distance
  let minDistance = 900; // Minimum distance between icons

  for (let i = 0; i < 15; i++) {
    let positionValid = false;
    let attempts = 0;
    let x = 0, y = 0;

    // Keep trying until we find a valid position or max out attempts
    while (!positionValid && attempts < 400) {
      x = random(50, width - 50);
      y = random(50, height - 50);
      positionValid = true;
      
      // Check distance to all previously placed icons
      for (let j = 0; j < i; j++) {
        let distance = dist(x, y, icons[j].x, icons[j].y);
        if (distance < minDistance) {
          positionValid = false;
          break;
        }
      }
      attempts++;
    }
    
    // Assign specific fact and matching image (fact 0 gets image 0, fact 1 gets image 1, etc.)
    let factIndex = i % facts.length;
    let imageIndex = factIndex; // Same index for direct matching
    
    icons.push(new Icon(
      x, 
      y, 
      25,
      facts[factIndex], 
      factImages[imageIndex],
      dropletImage
    ));
  }
  
  // Create references button and modal
  createReferencesButton();
  createReferencesModal();
}

// Create references button
function createReferencesButton() {
  // Check if p5.dom is available
  if (typeof createButton !== 'undefined') {
    refsButton = createButton('References');
    refsButton.position(width - 160, height - 60);
    refsButton.style('padding', '12px 24px');
    refsButton.style('background-color', 'black');
    refsButton.style('color', 'white');
    refsButton.style('border', 'none');
    //refsButton.style('border-radius', '25px');
    refsButton.style('cursor', 'pointer');
    refsButton.style('font-family', 'sans-serif');
    refsButton.style('font-size', '16px');
    refsButton.style('font-weight', 'bold');
    refsButton.style('box-shadow', '0 4px 15px rgba(0,0,0,0.2)');
    refsButton.style('z-index', '100');
    
    refsButton.mousePressed(toggleReferencesModal);
  } else {
    console.warn("p5.dom library not loaded. References button will not be created.");
  }
}

// Create references modal
function createReferencesModal() {
  if (typeof createDiv !== 'undefined') {
    // Create modal
    refsModal = createDiv();
    refsModal.position(width/2 - 350, height/2 - 250);
    refsModal.size(700, 250);
    refsModal.style('background-color', 'black');
    refsModal.style('color', 'white');
    refsModal.style('padding', '20px');
    refsModal.style('border-radius', '10px');
    refsModal.style('box-shadow', '0 5px 30px rgba(0,0,0,0.3)');
    refsModal.style('z-index', '1000');
    refsModal.style('overflow-y', 'auto');
    refsModal.style('display', 'none');
    
    // Modal content
    refsModal.html(`
      <h2 style="color: #e7e7e7ff; margin-top: 0; margin-left: 2rem; font-family:sans-serif;">References</h2>
      <div style="columns: 2; column-gap: 40px;">
        <ol style="margin-top: 0; color:white;">
          <li><a href="https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-cost-of-compute-a-7-trillion-dollar-race-to-scale-data-centers" target="_blank">Data center investment projection</a></li>
          <li><a href="https://seekingalpha.com/article/4845016-nvidia-4-trillion-plus-data-center-opportunity" target="_blank">NVIDIA revenue breakdown</a></li>
          <li><a href="https://westwaterresearch.com/wp-content/uploads/2025/03/2025-Q2-Water-Market-Insider-Data-Centers.pdf" target="_blank">US data center regulation</a></li>
          <li><a href="https://arxiv.org/pdf/2304.03271" target="_blank">AI water withdrawal projection</a></li>
          <li><a href="https://www.energy.gov/articles/doe-announces-40-million-more-efficient-cooling-data-centers" target="_blank">Cooling energy usage</a></li>
          <li><a href="https://dgtlinfra.com/data-center-water-usage/" target="_blank">Google data center water usage</a></li>
          <li><a href="https://www.nature.com/articles/s41545-021-00101-w" target="_blank">Data center water footprint</a></li>
          <li><a href="https://www.iea.org/energy-system/buildings/data-centres-and-data-transmission-networks" target="_blank">Water footprint components</a></li>
          <li><a href="https://www.nature.com/articles/s41545-021-00101-w" target="_blank">Global Gallon usage per day</a></li>
          <li><a href="https://www.cloudcomputing-news.net/news/data-centre-water-consumption-crisis/" target="_blank">Alternative water sources</a></li>
          <li><a href="https://www.eesi.org/articles/view/data-centers-and-water-consumption" target="_blank">5 million gallons per day figure</a></li>
        </ol>
      </div>
      <div style="text-align: left; margin-top: 20px; margin-left:2rem;">
        <button id="close-modal" style="
          padding: 10px 30px;
          background-color: #0024efff;
          color: white;
          border: none;
          cursor: pointer;
        ">Close</button>
      </div>
    `);
    
    // Close button functionality
    if (typeof select !== 'undefined') {
      select('#close-modal').mousePressed(() => {
        refsModal.style('display', 'none');
        isModalOpen = false;
      });
    }
  } else {
    console.warn("p5.dom library not loaded. References modal will not be created.");
  }
}

function toggleReferencesModal() {
  if (refsModal) {
    if (isModalOpen) {
      refsModal.style('display', 'none');
    } else {
      refsModal.style('display', 'block');
    }
    isModalOpen = !isModalOpen;
  }
}

// Rest of your functions (draw, handleBackgroundTransition, etc.) remain the same...
function draw() {
  // Handle background transitions
  handleBackgroundTransition();
  
  // Draw a water droplet at mouse position when hovering
  if (showIcons && dropletImage) {
    drawDropletTrail();
  }
  
  // Only show icons when user is hovering over the photo
  if (showIcons) {
    for (let icon of icons) {
      icon.update();
      icon.display();
    }
  }
  
  // Show instructions initially
  if (firstHover === true) {
    drawInstructions();
  }
  
  // Update button position if window is resized
  if (refsButton && !firstHover) {
    refsButton.position(width - 160, height - 60);
  }
  if (refsModal && isModalOpen) {
    refsModal.position(width/2 - 350, height/2 - 250);
  }
}

function handleBackgroundTransition() {
  if (!backgroundPhotos[currentBgIndex]) return;
  
  if (!isTransitioning) {
    // Just draw the current background
    drawBackgroundWithPoints(backgroundPhotos[currentBgIndex], 255);
  } else {
    // Draw both images with luma-based blending
    drawTransitionBackgrounds();
    
    // Update transition progress
    transitionProgress += transitionSpeed;
    
    // Check if transition is complete
    if (transitionProgress >= 1.0) {
      transitionProgress = 0;
      currentBgIndex = nextBgIndex;
      nextBgIndex = (nextBgIndex + 1) % backgroundPhotos.length;
    }
  }
}

function drawTransitionBackgrounds() {
  let currentBg = backgroundPhotos[currentBgIndex];
  let nextBg = backgroundPhotos[nextBgIndex];
  
  if (!currentBg || !nextBg) return;
  
  // Draw points from both images with luma-based blending
  for (let i = 0; i < pointsPerFrame; i++) {
    let x = int(random(width));
    let y = int(random(height));
    
    // Ensure coordinates are within bounds
    x = constrain(x, 0, width - 1);
    y = constrain(y, 0, height - 1);
    
    // Get colors from both images - get() returns an array [R, G, B, A]
    let currentColorArray = currentBg.get(x, y);
    let nextColorArray = nextBg.get(x, y);
    
    // Calculate brightness manually from RGB values
    // brightness = (R + G + B) / 3 / 255
    let brightnessValue = (currentColorArray[0] + currentColorArray[1] + currentColorArray[2]) / 3 / 255;
    
    // Use brightness to determine blend factor with transition progress
    let blendFactor = transitionProgress * (1.0 - brightnessValue * 0.7);
    
    // Manually blend the colors
    let r = lerp(currentColorArray[0], nextColorArray[0], blendFactor);
    let g = lerp(currentColorArray[1], nextColorArray[1], blendFactor);
    let b = lerp(currentColorArray[2], nextColorArray[2], blendFactor);
    
    // Draw the point
    fill(r, g, b, 220);
    noStroke();
    ellipse(x, y, baseSize, baseSize);
  }
}

function drawBackgroundWithPoints(bg, alpha) {
  if (!bg) return;
  
  for (let i = 0; i < pointsPerFrame; i++) {
    let x = int(random(bg.width));
    let y = int(random(bg.height));
    
    // get() returns an array [R, G, B, A]
    let pixArray = bg.get(x, y);
    
    // Use the array directly with fill()
    fill(pixArray[0], pixArray[1], pixArray[2], alpha);
    noStroke();
    ellipse(x, y, baseSize, baseSize);
  }
}

function drawDropletTrail() {
  if (dropletImage) {
    imageMode(CENTER);
    tint(255, 200);
    image(dropletImage, mouseX, mouseY, 30, 30);
    noTint();
  }
  
  noFill();
  stroke(100, 150, 255, 100);
  strokeWeight(1);
  ellipse(
    mouseX,
    mouseY,
    40 + sin(frameCount * 0.1) * 5,
    40 + sin(frameCount * 0.1) * 5
  );
}

function drawInstructions() {
  fill(0);
  rectMode(CENTER);
  rect(width / 2, height / 2, 450, 110);
  fill(255);
  textAlign(CENTER, CENTER);
  if (itc) {
    textFont(itc);
  }
  textSize(26);
  text(
    "Hover to reveal water consumption facts",
    width / 2,
    height / 2 - 8
  );
  textSize(17);
  text("Move mouse around to explore", width / 2, height / 2 + 20);
}

function mouseMoved() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    showIcons = true;
    if (firstHover) {
      firstHover = false;
      // Show references button
      if (refsButton) {
        refsButton.show();
      }
    }
  }
}

function mouseExited() {
  showIcons = false;
}

function keyPressed() {
  if (key === " ") {
    // Space bar to force transition
    isTransitioning = true;
    transitionProgress = 0;
    currentBgIndex = nextBgIndex;
    nextBgIndex = (nextBgIndex + 1) % backgroundPhotos.length;
  } else if (key === "p" || key === "P") {
    // P to pause/resume automatic transitions
    isTransitioning = !isTransitioning;
  } else if (keyCode === ESCAPE && isModalOpen) {
    // ESC key to close modal
    toggleReferencesModal();
    return false;
  }
}