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
  new LoadingAnimation();
});
