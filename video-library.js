
(() => {
  const resources = [
    {
      id: "python",
      name: "Python",
      level: "BEGINNER",
      provider: "freeCodeCamp.org · 4h 26m",
      title: "Learn Python – Full Course for Beginners",
      topics: "Variables, data types, input, conditions, loops, functions, files and OOP.",
      videoId: "rfscVS0vtbw",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw"
    },
    {
      id: "c",
      name: "C Programming",
      level: "BEGINNER",
      provider: "freeCodeCamp.org · 3h 46m",
      title: "C Programming Tutorial for Beginners",
      topics: "Variables, arrays, functions, loops, pointers, memory and file handling.",
      videoId: "KJgsSFOSQv0",
      url: "https://www.youtube.com/watch?v=KJgsSFOSQv0"
    },
    {
      id: "cpp",
      name: "C++",
      level: "BEGINNER",
      provider: "freeCodeCamp.org · 4h 01m",
      title: "C++ Tutorial for Beginners – Full Course",
      topics: "Variables, functions, arrays, loops, pointers, classes and inheritance.",
      videoId: "vLnPwxZdW4Y",
      url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y"
    },
    {
      id: "javascript",
      name: "JavaScript",
      level: "BEGINNER",
      provider: "freeCodeCamp.org · 3h 26m",
      title: "Learn JavaScript – Full Course for Beginners",
      topics: "Variables, strings, arrays, functions, conditions, loops and objects.",
      videoId: "PkZNo7MFNFg",
      url: "https://www.youtube.com/watch?v=PkZNo7MFNFg"
    }
  ];

  const grid = document.getElementById("video-resource-grid");
  const filter = document.getElementById("video-language-filter");

  if (!grid || !filter) return;

  const render = () => {
    const items = resources.filter(
      resource =>
        filter.value === "all" ||
        resource.id === filter.value
    );

    grid.innerHTML = items.map(resource => `
      <article class="video-resource-card">
        <a
          class="video-card-top"
          href="${resource.url}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Watch ${resource.title}"
          style="
            height:150px;
            background-image:
              linear-gradient(0deg,rgba(3,10,24,.48),rgba(3,10,24,.08)),
              url('https://i.ytimg.com/vi/${resource.videoId}/hqdefault.jpg');
            background-size:cover;
            background-position:center;
          "
        >
          <span class="video-play-icon">▶</span>
          <span class="video-level">${resource.level}</span>
        </a>

        <div class="video-card-content">
          <div class="video-provider">${resource.provider}</div>
          <h3>${resource.name}</h3>
          <h4>${resource.title}</h4>
          <p>${resource.topics}</p>

          <a
            class="video-watch-link"
            href="${resource.url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch this course <span>↗</span>
          </a>
        </div>
      </article>
    `).join("");
  };

  filter.addEventListener("change", render);
  render();
})();
