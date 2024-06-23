const input = document.getElementById('album-cover');
const image = document.getElementById('output');

input.addEventListener('change', (e) => {
    const src = URL.createObjectURL(e.target.files[0]);
    image.src = src;
});

// const input1 = document.getElementById('song-name-0');
// input1.addEventListener('keyup', function (e) {
//     document.getElementById('songinfo1').innerHTML = input1.value;
// });
const input1 = document.getElementById('album-name');
input1.addEventListener('keyup', function (e) {
    document.getElementById('songinfo1').innerHTML = input1.value;
});
const input2 = document.getElementById('artist-name');
input2.addEventListener('keyup', function (e) {
    document.getElementById('songinfo2').innerHTML = input2.value;
});

const songInput = document.getElementById('song-data');
const moreSong = document.getElementById('moresong');
let i = 1;
moreSong.addEventListener('click', (e) => {
    const temp=document.createElement('div');
    temp.className='text-file';
    temp.innerHTML=`
        <input type="number" id="track-num-${i}" placeholder="Track No" value=${i+1} required />
        <input type="text" id="song-name-${i}" placeholder="Song name" />
        <input type="file" accept="audio/*" id="song-file-${i}" />
        `;
    songInput.appendChild(temp);
    i += 1;
    // document.getElementById(`track-num-${i}`).=`${i}`;
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyAXRNiM5ghLYBqAsvL58y1oQnLOCcIHPV0",
    authDomain: "music-app-427b5.firebaseapp.com",
    databaseURL: "https://music-app-427b5-default-rtdb.firebaseio.com",
    projectId: "music-app-427b5",
    storageBucket: "music-app-427b5.appspot.com",
    messagingSenderId: "60437371142",
    appId: "1:60437371142:web:793338a49b8f1d6e83e687"
};
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
var db = getFirestore(app);

async function uploadData() {
    alert("Uploading data to Firestore...");
    for (let j = 0; j < i; j++) {
        var trackNum=document.getElementById(`track-num-${j}`).value;
        var songName = document.getElementById(`song-name-${j}`).value;
        var artistName = document.getElementById('artist-name').value;
        var albumName = document.getElementById('album-name').value;
        var artistProfile = document.getElementById('artist-profile').files[0];
        var songFile = document.getElementById(`song-file-${j}`).files[0];
        var albumCover = document.getElementById('album-cover').files[0];
        var yearRelease=document.getElementById('year-release').value;

        try {
            const songfileRef = ref(storage, `song_files/${artistName}/${albumName}/` + songFile.name);
            await uploadBytes(songfileRef, songFile);
            const songfileURL = await getDownloadURL(songfileRef);

            const albumcoverRef = ref(storage, `album_covers/${artistName}/${albumName}/` + albumCover.name);
            await uploadBytes(albumcoverRef, albumCover);
            const albumcoverURL = await getDownloadURL(albumcoverRef);

            const artistprofileRef = ref(storage, `artist_profile_pics/${artistName}/` + albumCover.name);
            await uploadBytes(artistprofileRef, artistProfile);
            const artistprofileURL = await getDownloadURL(artistprofileRef);

            await setDoc(doc(db, 'songs', `song_${artistName}_${albumName}_${songName}`),{
                artistID:`artist_${artistName}`,
                albumID:`album_${artistName}_${albumName}`,
                artistName:artistName,
                trackNum:trackNum.toString(),
                songName:songName,
                songFile:songfileURL,
                albumName:albumName,
                albumCover:albumcoverURL,
                
            });

            await setDoc(doc(db, 'all', `song_${artistName}_${albumName}_${songName}`),{
                artistID:`artist_${artistName}`,
                albumID:`album_${artistName}_${albumName}`,
                artistName:artistName,
                trackNum:trackNum.toString(),
                name:songName,
                songFile:songfileURL,
                albumName:albumName,
                albumCover:albumcoverURL,
                
            });

            await setDoc(doc(db, 'albums', `album_${artistName}_${albumName}`), {
                artistID:`artist_${artistName}`,
                artistName:artistName,
                albumName: albumName,
                albumCover: albumcoverURL,
                yearRelease:yearRelease,
            });

            await setDoc(doc(db, 'all', `album_${artistName}_${albumName}`), {
                artistID:`artist_${artistName}`,
                artistName:artistName,
                name: albumName,
                albumCover: albumcoverURL,
                yearRelease:yearRelease,
            });
            await setDoc(doc(db, 'artists', `artist_${artistName}`), {
                artistName:artistName,
                artistProfile:artistprofileURL,
            });

            await setDoc(doc(db, 'all', `artist_${artistName}`), {
                name:artistName,
                artistProfile:artistprofileURL,
            });

            // await setDoc(doc(collection(db, artistName, albumName, 'List Song'), songName), {
            //     songName: songName,
            //     songFile: songfileURL
            // });

            console.log('Uploaded ',songName);
            
        } catch (e) {
            console.log('Error: ', e);
            alert("Error occurred while uploading data to Firestore!");
        }
    }
    alert("Data successfully uploaded to Firestore!");
    reset()
}
const addDataBtn = document.getElementById('load');
addDataBtn.addEventListener('click', uploadData);

function reset(){
    document.getElementById("uploadform").reset();
    document.getElementById('song-data').innerHTML=`
        <div class="text-file">
            <input type="text" id="song-name-0" placeholder="Song name" required />
            <input type="file" accept="audio/*" id="song-file-0" required />
        </div>`;
    document.getElementById('musiccard').innerHTML=`
        <img id="output" class="canv" />
        <div class="songinfo">
            <div class="album-card">
            <h1 id="songinfo1">Album</h1>
            </div>
            <div>by <span id="songinfo2">By artist</span></div>
        </div>`;
}