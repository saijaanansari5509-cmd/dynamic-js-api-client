const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const sortSelect = document.getElementById("sort");
const postsContainer = document.getElementById("posts");
const statusMessage = document.getElementById("status");
const loadMoreButton = document.getElementById("loadMore");

let allPosts = [];
let visibleCount = 9;

function renderPosts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value;
  const sortOrder = sortSelect.value;

  let filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm) ||
      post.body.toLowerCase().includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      String(post.userId) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  filteredPosts.sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const displayedPosts = filteredPosts.slice(0, visibleCount);

  postsContainer.replaceChildren();

  if (displayedPosts.length === 0) {
    statusMessage.textContent = "No posts found. Try another search.";
  } else {
    statusMessage.textContent =
      `Showing ${displayedPosts.length} of ${filteredPosts.length} posts`;
  }

  displayedPosts.forEach((post) => {
    const card = document.createElement("article");
    card.className = "card";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `Category ${post.userId}`;

    const heading = document.createElement("h2");
    heading.textContent = post.title;

    const description = document.createElement("p");
    description.textContent = post.body;

    card.append(badge, heading, description);
    postsContainer.appendChild(card);
  });

  loadMoreButton.hidden = displayedPosts.length >= filteredPosts.length;
}

async function initializeApp() {
  statusMessage.textContent = "Loading posts...";
  postsContainer.replaceChildren();
  loadMoreButton.hidden = true;

  try {
    allPosts = await fetchPosts();
    renderPosts();
  } catch (error) {
    statusMessage.textContent =
      "Could not load posts. Check your internet connection and try again.";

    const retryButton = document.createElement("button");
    retryButton.textContent = "Retry";
    retryButton.addEventListener("click", initializeApp);

    postsContainer.replaceChildren(retryButton);
  }
}

searchInput.addEventListener("input", () => {
  visibleCount = 9;
  renderPosts();
});

categorySelect.addEventListener("change", () => {
  visibleCount = 9;
  renderPosts();
});

sortSelect.addEventListener("change", renderPosts);

loadMoreButton.addEventListener("click", () => {
  visibleCount += 9;
  renderPosts();
});

initializeApp();
