let navBtn = document.querySelector("#navBtn")
let menus = document.querySelector("#menus")
let searchBtn = document.querySelector("#searchBtn")
let inputContainer = document.querySelector("#inputContainer")

// searchBtn을 클릭하면 input과 button을 옆에다가 생성해야한다.

searchBtn.addEventListener("click", () => {
  inputContainer.classList.toggle("hidden");
});

const API_KEY = `a775a2ad59a6439fabb5ac4a5745542c`
let newsList = []
const getLatesNews = async() => {
  const url = new URL(
    `https://mynewsmagazine.netlify.app/top-headlines?country=kr

    `
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("sds", newsList);
};


getLatesNews();



/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

window.addEventListener('resize', function() {
  if (window.innerWidth <= 1200) {
    navBtn.classList.remove('hidden');
  } else {
    navBtn.classList.add('hidden');
  }
});

window.addEventListener('resize', function() {
  if (window.innerWidth >= 1200) {
    menus.classList.remove('hidden');
  } else {
    menus.classList.add('hidden');
  }
});


const render = () => {
  const newsHTML = newsList.map(news => {
    let description = news.description.length > 200 ? `${news.description.slice(0, 200)}...` : news.description;
    if (!news.description) {
      description = "내용없음";
    }
    return `<div class="row news">
      <div class="col-lg-4">
      ${news.urlToImage ?
        `<img src="${news.urlToImage}" class="newsImg" alt="${news.title}" onerror="this.onerror=null; this.src='https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png';">` :
        `<img src="https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png">`}
      </div>
      <div class="col-lg-8">
        <h2>${news.title}</h2>
        <p>
          ${description}
        </p>
        <div>
          ${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}
        </div>
      </div>
    </div>`;
  }).join("");

  document.querySelector("#newsBoard").innerHTML = newsHTML;
};
