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
          ctx.lineWidth = 2;
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

// Status Page Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize metric charts
  const metricCharts = document.querySelectorAll('.metric-chart');
  metricCharts.forEach(chart => {
    const value = parseFloat(chart.getAttribute('data-value'));
    chart.style.width = '0%';
    setTimeout(() => {
      chart.style.width = value + '%';
    }, 500);
  });

  // Simulate status updates
  function updateServiceStatus() {
    const services = document.querySelectorAll('.service-status');
    services.forEach(service => {
      // Random status updates for demo
      const random = Math.random();
      if (random > 0.95) {
        service.className = 'service-status partial';
        service.innerHTML = '<span class="status-dot"></span>Degraded';
      } else if (random > 0.98) {
        service.className = 'service-status down';
        service.innerHTML = '<span class="status-dot"></span>Down';
      }
    });

    // Update main status indicator
    const mainStatus = document.querySelector('.status-indicator');
    const downServices = document.querySelectorAll('.service-status.down').length;
    const partialServices = document.querySelectorAll('.service-status.partial').length;

    if (downServices > 0) {
      mainStatus.className = 'status-indicator down';
      mainStatus.innerHTML = '<span class="status-dot"></span><span class="status-text">Service Disruption</span>';
    } else if (partialServices > 0) {
      mainStatus.className = 'status-indicator partial';
      mainStatus.innerHTML = '<span class="status-dot"></span><span class="status-text">Partial Outage</span>';
    } else {
      mainStatus.className = 'status-indicator operational';
      mainStatus.innerHTML = '<span class="status-dot"></span><span class="status-text">All Systems Operational</span>';
    }
  }

  // Update metrics periodically
  function updateMetrics() {
    const metrics = document.querySelectorAll('.metric-item');
    metrics.forEach(metric => {
      const value = metric.querySelector('.metric-value');
      const chart = metric.querySelector('.metric-chart');
      if (!value || !chart) return; // Skip if elements don't exist
      
      const currentValue = parseInt(value.textContent);
      const newValue = Math.max(0, Math.min(100, currentValue + (Math.random() * 20 - 10)));
      
      if (value) {
        value.textContent = Math.round(newValue) + 'ms';
      }
      
      // Update chart width only if chart exists
      if (chart) {
        chart.style.width = (newValue) + '%';
      }
    });
  }

  // Update timestamps
  function updateTimestamps() {
    const times = document.querySelectorAll('.update-time');
    times.forEach(time => {
      const text = time.textContent;
      const number = parseInt(text);
      if (text.includes('hours')) {
        time.textContent = (number + 1) + ' hours ago';
      } else if (text.includes('day')) {
        time.textContent = (number + 1) + ' days ago';
      }
    });
  }

  // Set update intervals
  setInterval(updateServiceStatus, 30000); // Every 30 seconds
  setInterval(updateMetrics, 5000);        // Every 5 seconds
  setInterval(updateTimestamps, 3600000);  // Every hour
});

// Animate comparison chart progress bars
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const progressFill = progressBar.querySelector('.progress-fill');
        const value = progressBar.getAttribute('data-value');
        
        progressFill.style.width = `${value}%`;
        progressBar.classList.add('animated');
      }
    });
  }, {
    threshold: 0.5
  });

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

// Initialize the comparison chart animation
document.addEventListener('DOMContentLoaded', () => {
  animateProgressBars();
});
