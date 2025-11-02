# 🎵 Melodify

**Melodify** is a Spotify-inspired **music streaming web app** built using **HTML, CSS, and JavaScript**.  
It features a clean UI, smooth animations, and a **fully responsive design** for all devices.

---

## 🚀 Features
- 🎧 Play, pause, and switch between songs  
- 📱 Fully responsive design (mobile, tablet, desktop)  
- 🧠 Dynamic album and song loading from JSON files  
- 💾 Lightweight frontend — no backend required  

---

## 🛠️ How to Add Your Own Songs

You can easily customize Melodify by adding your own songs.

### 1. Folder Structure
Inside the `songs` directory, each artist should have their own folder.  
Example:
```
songs/
├── Atif Aslam/
│ ├── Rafta Rafta.mp3
│ └── info.json
├── Eminem/
│ ├── The Real Slim Shady.mp3
│ └── info.json
└── data.json
```

### 2. `data.json` Format
Add your artists and their songs in the following format:
```json
{
  "Atif Aslam": {
    "songs": ["Rafta Rafta.mp3"]
  },
  "Eminem": {
    "songs": ["The Real Slim Shady.mp3"]
  }
}
```
3. info.json Format
Each artist folder must include an info.json file with:
```json
{
  "title": "Artist or Album Name",
  "description": "Short description about the album or artist."
}
```
## 📂 Notes
Only a few sample songs are included (GitHub 100MB limit).
You can add unlimited songs locally following the structure above.

##💡 Tech Stack
- HTML5
- CSS3
- JavaScript (ES6)
