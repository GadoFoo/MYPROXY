const API_URL = "https://your-railway-backend-url.com/search"; // Replace with your Railway backend URL

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("query").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Searching...";

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    resultsDiv.innerHTML = "";
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      data.RelatedTopics.forEach((topic) => {
        if (topic.Text && topic.FirstURL) {
          const div = document.createElement("div");
          div.className = "result";
          div.innerHTML = `<a href="${topic.FirstURL}" target="_blank">${topic.Text}</a>`;
          resultsDiv.appendChild(div);
        }
      });
    } else {
      resultsDiv.innerHTML = "<p>No results found.</p>";
    }
  } catch (err) {
    resultsDiv.innerHTML = "<p>Error fetching results.</p>";
    console.error(err);
  }
});
