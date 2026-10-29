
const photos = [
  {
    title: "Mountain Escape", category: "Nature",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Ocean Dreams", category: "Nature",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Forest Whispers", category: "Nature",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "The Open Road", category: "Travel",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Beautiful Portrait", category: "People",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Friends Forever", category: "People",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "A Happy Moment", category: "People",
    url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Curious Cat", category: "Animals",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Golden Retriever", category: "Animals",
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Modern Building", category: "Architecture",
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "City at Sunset", category: "Architecture",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Beachside Escape", category: "Travel",
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Mountain Lake", category: "Nature",
    url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85"
  },
  {
    title: "Desert Journey", category: "Travel",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85"
  }
];

const grid = document.getElementById("galleryGrid");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");
const caption = document.getElementById("caption");
const counter = document.getElementById("counter");

let category = "All";
let shownPhotos = [...photos];
let currentIndex = 0;
const favourites = new Set();

function renderGallery() {
  const query = search.value.trim().toLowerCase();

  shownPhotos = photos.filter(photo =>
    (category === "All" || photo.category === category) &&
    (photo.title.toLowerCase().includes(query) ||
     photo.category.toLowerCase().includes(query))
  );

  grid.innerHTML = "";
  empty.hidden = shownPhotos.length !== 0;

  shownPhotos.forEach((photo, index) => {
    const originalIndex = photos.indexOf(photo);
    const card = document.createElement("article");
    card.className = "photo-card";
    card.tabIndex = 0;

    const img = document.createElement("img");
    img.src = photo.url;
    img.alt = photo.title;
    img.loading = "lazy";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = photo.category;

    const info = document.createElement("div");
    info.className = "photo-info";

    const title = document.createElement("h3");
    title.textContent = photo.title;

    const heart = document.createElement("button");
    heart.className = "heart" + (favourites.has(originalIndex) ? " saved" : "");
    heart.textContent = favourites.has(originalIndex) ? "♥" : "♡";
    heart.setAttribute("aria-label", "Toggle favourite");

    heart.addEventListener("click", event => {
      event.stopPropagation();
      if (favourites.has(originalIndex)) favourites.delete(originalIndex);
      else favourites.add(originalIndex);
      renderGallery();
    });

    info.append(title, heart);
    card.append(img, tag, info);

    card.addEventListener("click", () => openLightbox(index));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });

    grid.append(card);
  });
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    category = button.dataset.category;
    renderGallery();
  });
});

search.addEventListener("input", renderGallery);

function openLightbox(index) {
  currentIndex = index;
  updateLightbox();
  lightbox.hidden = false;
}

function updateLightbox() {
  const photo = shownPhotos[currentIndex];
  if (!photo) return;

  largeImage.src = photo.url;
  largeImage.alt = photo.title;
  caption.textContent = photo.title + " — " + photo.category;
  counter.textContent = `${currentIndex + 1} / ${shownPhotos.length}`;
}

function movePhoto(step) {
  currentIndex = (currentIndex + step + shownPhotos.length) % shownPhotos.length;
  updateLightbox();
}

function closeLightbox() {
  lightbox.hidden = true;
  largeImage.src = "";
}

document.getElementById("next").addEventListener("click", () => movePhoto(1));
document.getElementById("prev").addEventListener("click", () => movePhoto(-1));
document.getElementById("close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") movePhoto(1);
  if (event.key === "ArrowLeft") movePhoto(-1);
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderGallery();
