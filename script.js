const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");
const icon = toggle.querySelector(".icon");
const trackName = toggle.querySelector(".track-name");

const tracks = [
  { name: "Dreamscape", url: "https://cdn.pixabay.com/audio/2025/03/04/audio_e324cc3c20.mp3" },
  { name: "Cyberflow", url: "https://cdn.pixabay.com/audio/2023/01/22/audio_a5fdfeaaab.mp3" },
  { name: "Pixel Drift", url: "https://cdn.pixabay.com/audio/2023/03/27/audio_d1b2e0c76d.mp3" }
];

let currentTrack = 0;

function playTrack(index) {
  const { name, url } = tracks[index];
  music.src = url;
  music.play().catch(() => {});
  showNowPlaying(name);
}

function showNowPlaying(name) {
  const fullText = `Now Playing "${name}"`;
  trackName.textContent = "";
  toggle.classList.add("expanded");

  let i = 0;
  const interval = setInterval(() => {
    trackName.textContent += fullText[i];
    i++;
    if (i >= fullText.length) {
      clearInterval(interval);
      setTimeout(() => {
        toggle.classList.remove("expanded");
        trackName.textContent = "";
      }, 2000);
    }
  }, 50);
}

toggle.onclick = () => {
  if (music.muted) {
    music.muted = false;
    icon.textContent = "🔊";
  } else {
    music.muted = true;
    icon.textContent = "🔇";
  }
};

document.body.addEventListener("click", () => {
  if (!music.src) playTrack(currentTrack);
}, { once: true });

music.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack(currentTrack);
});

music.volume = 0.15;

// ✅ Lanyard API: Live Discord Status Fetch
async function updateDiscordStatus() {
  try {
    const response = await fetch('https://api.lanyard.rest/v1/users/1252741219038265437');
    const data = await response.json();
    
    if (data.success) {
      const { discord_user, activities } = data.data;
      
      // Update profile picture
      const profilePic = document.querySelector('.profile-pic');
      profilePic.src = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`;
      
      // Update status indicator
      const statusIndicator = document.querySelector('.status-indicator');
      const statusText = document.querySelector('.status-text');
      const thoughtBubble = document.querySelector('.thought-bubble-content');
      
      // Get custom status if it exists
      const customStatus = activities.find(activity => activity.type === 4);
      
      if (customStatus) {
        thoughtBubble.textContent = customStatus.state;
        thoughtBubble.parentElement.style.display = 'block';
      } else {
        thoughtBubble.parentElement.style.display = 'none';
      }
      
      // Update availability status
      statusIndicator.className = 'status-indicator';
      statusText.textContent = data.data.discord_status;
      
      switch (data.data.discord_status) {
        case 'online':
          statusIndicator.classList.add('online');
          break;
        case 'idle':
          statusIndicator.classList.add('idle');
          break;
        case 'dnd':
          statusIndicator.classList.add('dnd');
          break;
        default:
          statusIndicator.classList.add('offline');
      }
    }
  } catch (error) {
    console.error('Error fetching Discord status:', error);
  }
}

// Update status every 30 seconds
setInterval(updateDiscordStatus, 30000);
updateDiscordStatus();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTop');
const terminalBox = document.querySelector('.terminal-box');

function toggleScrollToTop() {
  const terminalPosition = terminalBox.getBoundingClientRect().bottom;
  if (window.scrollY > terminalPosition) {
    scrollToTopBtn.style.display = 'block';
  } else {
    scrollToTopBtn.style.display = 'none';
  }
}

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', toggleScrollToTop);

// Loading Screen Animation
class EnergyLine {
  constructor(canvas, startX, startY, finalPosition) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = startX;
    this.y = startY;
    this.points = [{ x: startX, y: startY }];
    this.maxPoints = 20;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.maxSpeed = 2;
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.alpha = 0;
    this.state = 'entering';
    this.delay = Math.random() * 1000;
    this.startTime = Date.now() + this.delay;
    this.finalX = finalPosition.x;
    this.finalY = finalPosition.y;
    this.settled = false;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.lineWidth = 3;
    this.glowSize = 20;
  }

  update(time) {
    if (Date.now() < this.startTime) return;

    if (this.state === 'entering') {
      // Wander around screen with smooth motion
      this.wanderAngle += (Math.random() - 0.5) * 0.3;
      const wanderForce = {
        x: Math.cos(this.wanderAngle) * 0.1,
        y: Math.sin(this.wanderAngle) * 0.1
      };

      // Add slight attraction to center
      const dx = this.centerX - this.x;
      const dy = this.centerY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const centerForce = {
        x: (dx / dist) * 0.05,
        y: (dy / dist) * 0.05
      };

      this.acceleration.x = wanderForce.x + centerForce.x;
      this.acceleration.y = wanderForce.y + centerForce.y;

    } else if (this.state === 'converging' && !this.settled) {
      // Move towards final position with physics
      const dx = this.finalX - this.x;
      const dy = this.finalY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 1) {
        this.settled = true;
        this.x = this.finalX;
        this.y = this.finalY;
        this.velocity = { x: 0, y: 0 };
        return;
      }

      // Calculate spring force
      const springForce = 0.1;
      this.acceleration.x = (dx / dist) * springForce;
      this.acceleration.y = (dy / dist) * springForce;

      // Add damping
      const damping = 0.95;
      this.velocity.x *= damping;
      this.velocity.y *= damping;
    }

    if (!this.settled) {
      // Update velocity
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;

      // Limit speed
      const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
      if (speed > this.maxSpeed) {
        this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
        this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
      }

      // Update position
      this.x += this.velocity.x;
      this.y += this.velocity.y;

      // Reset acceleration
      this.acceleration = { x: 0, y: 0 };
    }

    // Update trail points
    this.points.push({ x: this.x, y: this.y });
    if (this.points.length > this.maxPoints) {
      this.points.shift();
    }

    // Update alpha
    if (this.state === 'dispersing') {
      this.alpha = Math.max(0, this.alpha - 0.05);
    } else {
      this.alpha = Math.min(1, this.alpha + 0.05);
    }
  }

  draw() {
    if (Date.now() < this.startTime) return;

    this.ctx.strokeStyle = '#ae00ff';
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.globalCompositeOperation = 'lighter';

    // Draw trail with thicker lines
    for (let i = 1; i < this.points.length; i++) {
      const gradient = this.ctx.createLinearGradient(
        this.points[i-1].x, this.points[i-1].y,
        this.points[i].x, this.points[i].y
      );
      
      gradient.addColorStop(0, `rgba(174, 0, 255, ${this.alpha * 0.15})`);
      gradient.addColorStop(0.5, `rgba(174, 0, 255, ${this.alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(174, 0, 255, ${this.alpha * 0.15})`);

      this.ctx.beginPath();
      this.ctx.strokeStyle = gradient;
      this.ctx.moveTo(this.points[i-1].x, this.points[i-1].y);
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
      this.ctx.stroke();
    }

    // Draw bigger glow
    const gradient = this.ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.glowSize
    );
    gradient.addColorStop(0, `rgba(174, 0, 255, ${this.alpha * 0.5})`);
    gradient.addColorStop(1, 'rgba(174, 0, 255, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

class LoadingAnimation {
  constructor() {
    this.canvas = document.getElementById('loading-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.lines = [];
    this.startTime = Date.now();
    this.state = 'entering';
    this.loadingBar = document.querySelector('.loading-bar');
    this.loadingScreen = document.getElementById('loading-screen');
    this.centerGlow = 0;
    this.loadingComplete = false;
    
    // Initially pause the title animation
    const style = document.createElement('style');
    style.textContent = `
      body::-webkit-scrollbar {
        display: none;
      }
      body {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .title-layers {
        animation: none !important;
      }
      .title-layer.scan {
        animation: none !important;
      }
      .title-layer.particles::before,
      .title-layer.particles::after {
        animation: none !important;
      }
      .title-layer.glow {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
    
    document.body.style.overflow = 'hidden';
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.createFinalPositions();
    this.createLines();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createFinalPositions() {
    const scale = Math.min(this.canvas.width, this.canvas.height) * 0.25;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.finalPositions = [];
    
    // Helper function to create a circular node point
    const createNode = (xOffset, yOffset) => {
      const x = centerX + xOffset * scale;
      const y = centerY + yOffset * scale;
      this.finalPositions.push({ x, y });
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const glowRadius = scale * 0.02;
        this.finalPositions.push({
          x: x + Math.cos(angle) * glowRadius,
          y: y + Math.sin(angle) * glowRadius
        });
      }
    };

    // Create the outer S outline (flipped x-coordinates)
    const outlinePoints = [
      // Top curve (flipped)
      [0.3, -0.4], [0.15, -0.45], [0, -0.45], [-0.15, -0.4], [-0.3, -0.3],
      // Middle section (flipped)
      [-0.3, -0.15], [-0.15, 0], [0, 0], [0.15, 0], [0.3, 0.15],
      // Bottom curve (flipped)
      [0.3, 0.3], [0.15, 0.4], [0, 0.45], [-0.15, 0.45], [-0.3, 0.4]
    ];

    // Add outline points
    outlinePoints.forEach(([x, y]) => {
      const px = centerX + x * scale;
      const py = centerY + y * scale;
      this.finalPositions.push({ x: px, y: py });
      for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * scale * 0.02;
        this.finalPositions.push(
          { x: px + offset, y: py },
          { x: px, y: py + offset }
        );
      }
    });

    // Add inner parallel lines (flipped)
    const innerPoints = [
      // Top inner curve (flipped)
      [0.2, -0.35], [0.1, -0.38], [0, -0.38], [-0.1, -0.35], [-0.2, -0.25],
      // Middle inner section (flipped)
      [-0.2, -0.1], [-0.1, 0], [0, 0], [0.1, 0], [0.2, 0.1],
      // Bottom inner curve (flipped)
      [0.2, 0.25], [0.1, 0.35], [0, 0.38], [-0.1, 0.38], [-0.2, 0.35]
    ];

    innerPoints.forEach(([x, y]) => {
      this.finalPositions.push({
        x: centerX + x * scale,
        y: centerY + y * scale
      });
    });

    // Add connection nodes at specific points (flipped)
    const nodes = [
      // Top nodes
      [0.32, -0.42], [-0.32, -0.32],
      // Middle nodes
      [-0.32, -0.16], [0.32, 0.16],
      // Bottom nodes
      [0.32, 0.32], [-0.32, 0.42],
      // Extra detail nodes
      [0, -0.45], [0, 0], [0, 0.45]
    ];

    nodes.forEach(([x, y]) => createNode(x, y));

    // Add small decorative points
    const decorativePoints = 20;
    for (let i = 0; i < decorativePoints; i++) {
      const angle = (i / decorativePoints) * Math.PI * 2;
      const radius = scale * 0.5;
      this.finalPositions.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    }
  }

  createLines() {
    // Create a line for each final position
    this.finalPositions.forEach(pos => {
      const startX = this.canvas.width + Math.random() * 100;
      const startY = this.canvas.height + Math.random() * 100;
      this.lines.push(new EnergyLine(this.canvas, startX, startY, pos));
    });
  }

  drawCenterGlow() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const scale = Math.min(this.canvas.width, this.canvas.height) * 0.3;
    
    // Create a more intense purple glow
    const gradient = this.ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, scale
    );
    
    gradient.addColorStop(0, `rgba(255, 0, 255, ${this.centerGlow * 0.4})`);
    gradient.addColorStop(0.3, `rgba(174, 0, 255, ${this.centerGlow * 0.2})`);
    gradient.addColorStop(1, 'rgba(174, 0, 255, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, scale, 0, Math.PI * 2);
    this.ctx.fill();
  }

  startTitleAnimation() {
    // Remove the animation blocking styles
    const newStyle = document.createElement('style');
    newStyle.textContent = `
      .title-layers {
        animation: rotate3d 20s infinite linear !important;
      }
      .title-layer.scan {
        animation: scan 2s infinite linear !important;
      }
      .title-layer.particles::before {
        animation: particlePulse 4s infinite !important;
      }
      .title-layer.particles::after {
        animation: particlePulse 4s infinite reverse !important;
      }
      .title-layer.glow {
        animation: glowPulse 3s infinite !important;
      }
    `;
    document.head.appendChild(newStyle);
  }

  animate() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;

    // Only proceed with fade out if loading is complete
    if (this.loadingComplete) {
      document.body.style.overflow = '';
      this.loadingScreen.classList.add('hidden');
      
      // Wait for loading screen to fade out completely, then start title animation
      setTimeout(() => {
        this.startTitleAnimation();
      }, 3500); // 1.5 second delay after fade starts
      
      setTimeout(() => {
        this.loadingScreen.remove();
      }, 500);
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (elapsed > 3000 && this.state === 'entering') {
      this.state = 'converging';
      this.lines.forEach(line => line.state = 'converging');
    }

    const allSettled = this.state === 'converging' && 
                      this.lines.every(line => line.settled);

    if (allSettled && !this.loadingStarted && elapsed > 5000) {
      this.loadingStarted = true;
      this.loadingBar.style.transition = 'width 9s linear';
      this.loadingBar.style.width = '100%';
      
      this.loadingBar.addEventListener('transitionend', () => {
        setTimeout(() => {
          this.loadingComplete = true;
        }, 500);
      }, { once: true });
    }

    if (this.state === 'converging') {
      this.centerGlow = Math.min(1, this.centerGlow + 0.02);
    }

    this.drawCenterGlow();

    this.lines.forEach(line => {
      line.update(currentTime);
      line.draw();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize loading animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if this is a refresh
  const isRefresh = localStorage.getItem('hasLoaded');
  
  if (isRefresh) {
    // Skip loading animation
    const loadingScreen = document.getElementById('loading-screen');
    const loadingCanvas = document.getElementById('loading-canvas');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Hide loading elements immediately
    loadingScreen.style.display = 'none';
    loadingCanvas.style.display = 'none';
    loadingBar.style.display = 'none';
    
    // Start title animation immediately
    const style = document.createElement('style');
    style.textContent = `
      .title-layers {
        animation: rotate3d 20s infinite linear !important;
      }
      .title-layer.scan {
        animation: scan 2s infinite linear !important;
      }
      .title-layer.particles::before {
        animation: particlePulse 4s infinite !important;
      }
      .title-layer.particles::after {
        animation: particlePulse 4s infinite reverse !important;
      }
      .title-layer.glow {
        animation: glowPulse 3s infinite !important;
      }
    `;
    document.head.appendChild(style);
    
    // Enable scrolling
    document.body.style.overflow = '';
  } else {
    // First time visit - show loading animation
    new LoadingAnimation();
    localStorage.setItem('hasLoaded', 'true');
  }
});

// Section Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      sectionObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.section-container').forEach(section => {
  sectionObserver.observe(section);
});

// Copy Button Functionality
document.querySelectorAll('.copy-btn').forEach(button => {
  button.addEventListener('click', () => {
    const promptText = button.closest('.use-case-prompt').querySelector('.prompt-text').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.style.background = 'rgba(0, 255, 0, 0.3)';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    });
  });
});

// Terminal Typing Effect
function typeText(element, text, speed = 50) {
  let index = 0;
  element.textContent = '';
  
  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      element.classList.remove('typing');
    }
  }
  
  element.classList.add('typing');
  type();
}

document.querySelectorAll('.terminal-content').forEach(terminal => {
  const text = terminal.getAttribute('data-text');
  if (text) {
    typeText(terminal, text);
  }
});

// Timeline Animation
const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
  item.style.animationDelay = `${0.2 * index}s`;
});

// Hover Cards
document.querySelectorAll('.glow-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const content = card.querySelector('.card-hover-content');
    if (content) {
      content.style.height = `${content.scrollHeight}px`;
    }
  });
  
  card.addEventListener('mouseleave', () => {
    const content = card.querySelector('.card-hover-content');
    if (content) {
      content.style.height = '0';
    }
  });
});

// Security Features Animation
const securityFeatures = document.querySelectorAll('.security-feature');
securityFeatures.forEach((feature, index) => {
  feature.style.animationDelay = `${0.2 * index}s`;
});

// Neuron Background Animation
function createNeuronEffect(container) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);
  
  function resize() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const neurons = [];
  const connections = [];
  const numNeurons = 30;
  
  class Neuron {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(174, 0, 255, 0.5)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < numNeurons; i++) {
    neurons.push(new Neuron());
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    neurons.forEach(neuron => {
      neuron.update();
      neuron.draw();
    });
    
    neurons.forEach((n1, i) => {
      neurons.slice(i + 1).forEach(n2 => {
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(174, 0, 255, ${0.2 * (1 - distance / 100)})`;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

document.querySelectorAll('.neuron-bg').forEach(createNeuronEffect);

// Script Generation
const scriptExamples = {
  "teleport": `local player = game.Players.LocalPlayer
local character = player.Character
if character then
    character:SetPrimaryPartCFrame(
        CFrame.new(Vector3.new(0, 500, 0))
    )
end`,
  "fly": `local player = game.Players.LocalPlayer
local character = player.Character
local humanoid = character:FindFirstChild("Humanoid")
local rootPart = character:FindFirstChild("HumanoidRootPart")

if humanoid and rootPart then
    local flying = false
    local speed = 50
    
    local function fly()
        flying = not flying
        if flying then
            humanoid.PlatformStand = true
            local bodyGyro = Instance.new("BodyGyro")
            local bodyVelocity = Instance.new("BodyVelocity")
            
            bodyGyro.Parent = rootPart
            bodyVelocity.Parent = rootPart
            
            bodyGyro.P = 9e4
            bodyGyro.maxTorque = Vector3.new(9e9, 9e9, 9e9)
            bodyGyro.cf = rootPart.CFrame
            
            bodyVelocity.velocity = Vector3.new(0, 0, 0)
            bodyVelocity.maxForce = Vector3.new(9e9, 9e9, 9e9)
        else
            humanoid.PlatformStand = false
            for _, v in pairs(rootPart:GetChildren()) do
                if v:IsA("BodyGyro") or v:IsA("BodyVelocity") then
                    v:Destroy()
                end
            end
        end
    end
    
    local function onInputBegan(input)
        if input.KeyCode == Enum.KeyCode.F then
            fly()
        end
    end
    
    game:GetService("UserInputService").InputBegan:Connect(onInputBegan)
end`,
  "speed": `local player = game.Players.LocalPlayer
local character = player.Character
local humanoid = character:FindFirstChild("Humanoid")

if humanoid then
    humanoid.WalkSpeed = 32 -- Default is 16
end`,
  "jump": `local player = game.Players.LocalPlayer
local character = player.Character
local humanoid = character:FindFirstChild("Humanoid")

if humanoid then
    humanoid.JumpPower = 100 -- Default is 50
end`,
  "noclip": `local player = game.Players.LocalPlayer
local character = player.Character

if character then
    for _, part in pairs(character:GetDescendants()) do
        if part:IsA("BasePart") then
            part.CanCollide = false
        end
    end
end`
};

function generateScript(prompt) {
  const promptLower = prompt.toLowerCase();
  let script = "No script found for that request. Try something like:\n";
  script += "- 'teleport to the top'\n";
  script += "- 'make me fly'\n";
  script += "- 'increase my speed'\n";
  script += "- 'make me jump higher'\n";
  script += "- 'make me noclip'";
  
  for (const [key, value] of Object.entries(scriptExamples)) {
    if (promptLower.includes(key)) {
      script = value;
      break;
    }
  }
  
  return script;
}

document.querySelector('.generate-btn').addEventListener('click', () => {
  const input = document.querySelector('.prompt-input');
  const scriptContainer = document.querySelector('.generated-script');
  
  if (input.value.trim()) {
    const script = generateScript(input.value);
    scriptContainer.textContent = script;
    scriptContainer.style.display = 'block';
  }
});

document.querySelector('.prompt-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.querySelector('.generate-btn').click();
  }
});

// Executor Demo Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Line Numbers
  const editor = document.querySelector('.editor');
  const lineNumbers = document.querySelector('.line-numbers');
  
  function updateLineNumbers() {
    const lines = editor.innerText.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => `${i + 1}`).join('\n');
  }
  
  editor.addEventListener('input', updateLineNumbers);
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '    ');
    }
  });
  
  // Initial line number
  updateLineNumbers();
  
  // Control Buttons
  const executeBtn = document.querySelector('.execute-btn');
  const injectBtn = document.querySelector('.inject-btn');
  const terminalContent = document.querySelector('.terminal-content');
  
  executeBtn.addEventListener('click', () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `
      <span class="timestamp">[${timestamp}]</span>
      <span class="debug-tag">[info]</span>
      <span class="message">Executing script...</span>
    `;
    terminalContent.appendChild(newLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;
  });
  
  injectBtn.addEventListener('click', () => {
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, -5);
    const newLine = document.createElement('div');
    newLine.className = 'terminal-line';
    newLine.innerHTML = `
      <span class="timestamp">[${timestamp}]</span>
      <span class="debug-tag">[info]</span>
      <span class="message">Injecting into process...</span>
    `;
    terminalContent.appendChild(newLine);
    terminalContent.scrollTop = terminalContent.scrollHeight;
  });
  
  // Tab Management
  const newTabBtn = document.querySelector('.new-tab-btn');
  const tabsContainer = document.querySelector('.editor-tabs');
  let tabCount = 1;
  
  newTabBtn.addEventListener('click', () => {
    tabCount++;
    const newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.innerHTML = `
      <span>Untitled-${tabCount}</span>
      <button class="tab-close">×</button>
    `;
    tabsContainer.insertBefore(newTab, newTabBtn);
    
    // Remove active class from other tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    newTab.classList.add('active');
  });
  
  // Handle tab close
  tabsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-close')) {
      const tab = e.target.parentElement;
      if (!tab.classList.contains('active') || document.querySelectorAll('.tab').length > 1) {
        tab.remove();
      }
    }
  });
  
  // Handle tab selection
  tabsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.tab') && !e.target.classList.contains('tab-close')) {
      document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
      e.target.closest('.tab').classList.add('active');
    }
  });
});
