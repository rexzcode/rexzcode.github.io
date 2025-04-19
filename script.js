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
