//Global variable
let currentSong = new Audio();
let playPauseBtn = document.querySelector(".play-pause-btn");
let songsInfo;
let currFolder;

function formatSecondsToMMSS(seconds) {
    // Remove decimal part by rounding down
    const totalSeconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;

    // Pad with leading zeros to ensure two-digit format
    const formattedMins = String(mins).padStart(2, '0');
    const formattedSecs = String(secs).padStart(2, '0');

    return `${formattedMins}:${formattedSecs}`;
}

//Getting songs from the songs folder
async function getSongs(folder) {
    const response = await fetch("songs/data.json");
    const data = await response.json();

    if (!data[folder]) {
        console.error(`No data found for folder: ${folder}`);
        return { 0: [], 1: [] };
    }

    const songs = data[folder].songs;
    const songsLinks = songs.map(song => `songs/${folder}/${song}`);

    return { 0: songs, 1: songsLinks };
}


// Displaying all songs in the side bar
async function displayingSongsInSidebar() {
    const response = await fetch("songs/data.json");
    const data = await response.json();
    const firstArtist = Object.keys(data)[0]; // First folder from data.json

    songsInfo = await getSongs(firstArtist);
    playMusic(songsInfo[1][0], true);

    const songs = songsInfo[0];
    const songsLinks = songsInfo[1];

    let ul = document.getElementsByClassName("song-list")[0].getElementsByTagName("ul")[0];

    for (const element of songs) {
        ul.innerHTML = ul.innerHTML + `<li class="cursor-pointer">
                        <div class="icon-song-name">
                            <img class="music-icon color-invert" src="images/musical-note.png" alt="music-icon">
                            <div>
                                <p>
                                    ${element}
                                </p>
                            </div>
                        </div>
                        <img class="play-icon color-invert cursor-pointer" src="images/play-button.svg" alt="play-button">
                    </li>`;
    }
    eventOnSongs();
}

//Playing songs which song is clicked
function playMusic(track, pause = false) {
    currentSong.src = track;

    if (!pause) {
        currentSong.play();
        playPauseBtn.src = "images/pause-button.svg";
    } else {
        playPauseBtn.src = "images/play-button.svg";
    }

let songInfoText = decodeURIComponent(track.split("/").pop().replace(".mp3", ""));
document.querySelector(".song-info").textContent = songInfoText;

}

//Adding event listner on the songs in the side bar
function eventOnSongs() {
    const array = document.querySelectorAll(".song-list ul li");

    array.forEach((element) => {
        let songName = element.querySelector("p").innerText.trim();

        // Find full URL by matching song name to its index in songsInfo[0]
        let index = songsInfo[0].indexOf(songName);
        let track = songsInfo[1][index];

        // Click handler for the play icon
        element.querySelectorAll("img")[1].addEventListener("click", () => {
            playMusic(track); // Now this works correctly
        });
    });
}

//Adding event listner to the Previous, Play and Next Button 
function playNextPrevious() {
    playPauseBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playPauseBtn.src = "images/pause-button.svg";
        }
        else {
            currentSong.pause();
            playPauseBtn.src = "images/play-button.svg";
        }
    });
    durationDisplay(); //for displaying current song duration
}

//for displaying current song duration
function durationDisplay() {
    currentSong.addEventListener("timeupdate", () => {
        if (!isNaN(currentSong.duration)) {
            document.querySelector(".song-duration").innerHTML =
                `${formatSecondsToMMSS(currentSong.currentTime)} / ${formatSecondsToMMSS(currentSong.duration)}`
        }

        //Moving circle of the seekbar
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
}

//Adding seekbar functionality
function seekbarFunctionality() {
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });
}

//Hamburger and cross btn functionality
function hamburgerAndCrossBtnFunctionality() {
    //Hamburger-icon functionality
    document.querySelector(".hamburger-icon").addEventListener("click", () => {
        document.querySelector(".left-main").style.left = "0" + "%";
    });
    //Cross-icon functionality
    document.querySelector(".cross-icon").addEventListener("click", () => {
        document.querySelector(".left-main").style.left = "-100" + "%";
    });
}

//Adding Previous nad Next Btn Functionality
function previousAndNextBtnFunctionality() {
    let previousBtn = document.querySelector(".previous-btn");
    let nextBtn = document.querySelector(".next-btn");

    previousBtn.addEventListener("click", () => {
        let index = songsInfo[1].indexOf(currentSong.src)

        if ((index - 1) >= 0) {
            playMusic(songsInfo[1][index - 1]);
        }
    });

    nextBtn.addEventListener("click", () => {
        let index = songsInfo[1].indexOf(currentSong.src)

        if ((index + 1) < songsInfo[1].length) {
            playMusic(songsInfo[1][index + 1]);
        }
    });
}

//Adding volume btn controls
function volumeBtnFunctionality() {
    const volumeInput = document.querySelector(".timevol input[type='range']");
    const volumeImg = document.querySelector(".volume-img");

    let previousVolume = 1; // Default volume before muting

    // When slider is moved
    volumeInput.addEventListener("input", (e) => {
        const volumeValue = parseInt(e.target.value);
        currentSong.volume = volumeValue / 100;

        // Update previousVolume if not muted
        if (volumeValue > 0) {
            previousVolume = currentSong.volume;
        }

        updateVolumeIcon(volumeValue);
    });

    // When volume icon is clicked (toggle mute/unmute)
    volumeImg.addEventListener("click", () => {
        if (currentSong.volume === 0) {
            // Unmute
            currentSong.volume = previousVolume;
            volumeInput.value = previousVolume * 100;
        } else {
            // Mute
            previousVolume = currentSong.volume;
            currentSong.volume = 0;
            volumeInput.value = 0;
        }

        updateVolumeIcon(volumeInput.value);
    });

    // Initialize volume icon
    updateVolumeIcon(Math.round(currentSong.volume * 100));

    function updateVolumeIcon(volumeValue) {
        if (volumeValue == 0) {
            volumeImg.src = "images/mute.svg";
        } else if (volumeValue <= 50) {
            volumeImg.src = "images/less-volume.svg";
        } else {
            volumeImg.src = "images/volume.svg";
        }
    }
}

//load the playlist when the card is clicked
function cardClicked() {
    Array.from(document.getElementsByClassName("card")).forEach(card => {
        card.addEventListener("click", async () => {
            const folder = card.dataset.folder;

            // Get songs
            songsInfo = await getSongs(folder);

            // Update currFolder before anything else
            currFolder = folder;

            // Clear old song list safely
const ul = document.querySelector(".song-list ul");
if (!ul) {
    console.warn("No .song-list <ul> found in DOM");
    return;
}
ul.innerHTML = "";

// Add new songs to sidebar
songsInfo[0].forEach(songName => {
    ul.innerHTML += `<li class="cursor-pointer">
        <div class="icon-song-name">
            <img class="music-icon color-invert" src="images/musical-note.png" alt="music-icon">
            <div><p>${songName}</p></div>
        </div>
        <img class="play-icon color-invert cursor-pointer" src="images/play-button.svg" alt="play-button">
    </li>`;
});


            // Auto-play the first song
            playMusic(songsInfo[1][0]); // autoplay

            // Reset seekbar and duration display
            document.querySelector(".circle").style.left = "0%";
            document.querySelector(".song-duration").innerText = "00:00 / 00:00";

            // Rebind events for new songs
            eventOnSongs();
        });
    });
}

// Display all the albums on the page
async function displayAlbums() {
    const response = await fetch("songs/data.json");
    const data = await response.json();
    const cardContainer = document.querySelector(".card-container");

    cardContainer.innerHTML = ""; // Clear previous cards

    for (const folderName in data) {
        try {
            const infoRes = await fetch(`songs/${folderName}/info.json`);
            const info = await infoRes.json();

            cardContainer.innerHTML += `
                <div data-folder="${folderName}" class="card cursor-pointer">
                    <img src="songs/${folderName}/cover.png" alt="card-img">
                    <h3>${info.title}</h3>
                    <p>${info.description}</p>
                    <div class="circle-box cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>`;
        } catch (error) {
            console.warn(`Could not load info.json for ${folderName}`, error);
        }
    }

    // Rebind card click events
    cardClicked();
}

async function main() {
    await displayingSongsInSidebar(); // Initial default playlist
    playNextPrevious();
    seekbarFunctionality();
    hamburgerAndCrossBtnFunctionality();
    previousAndNextBtnFunctionality();
    volumeBtnFunctionality();
    displayAlbums();

    currentSong.addEventListener("ended", () => {
        let index = songsInfo[1].indexOf(currentSong.src);

        if ((index + 1) < songsInfo[1].length) {
            // Play next song automatically
            playMusic(songsInfo[1][index + 1]);
        } else {
            // Last song finished
            // Reset to first song (but do not autoplay)
            playMusic(songsInfo[1][0], true); // true = don't autoplay

            // Reset UI elements
            playPauseBtn.src = "images/play-button.svg";
            document.querySelector(".circle").style.left = "0%";
            document.querySelector(".song-duration").innerText = "00:00 / 00:00";
        }
    });

    // Reset left-main position on screen resize (from mobile to larger screens)
    window.addEventListener("resize", () => {
        const leftMain = document.querySelector(".left-main");
        if (window.innerWidth > 600) {
            leftMain.style.left = "unset"; // Reset manually set inline style
        }
    });

}


document.addEventListener("DOMContentLoaded", main);


