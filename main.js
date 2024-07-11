// 각 요소를 변수에 할당합니다.
let navBtn = document.querySelector("#navBtn");
let menus = document.querySelector("#menus");
let searchBtn = document.querySelector("#searchBtn");
let inputContainer = document.querySelector("#inputContainer");
let searchInput = document.querySelector("#searchInput");

// 메뉴 버튼에 클릭 이벤트 리스너를 추가합니다.
let menuBtn = document.querySelectorAll(".menus button");
menuBtn.forEach((menu) => 
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

// 사이드 네비게이션 링크에 클릭 이벤트 리스너를 추가합니다.
const sideNavLinks = document.querySelectorAll('.sidenav a');
sideNavLinks.forEach((link) => 
  link.addEventListener('click', (event) => {
    getNewsByCategory(event);
    closeNav();
  })
);

// searchBtn을 클릭하면 inputContainer의 표시 상태를 토글합니다.
searchBtn.addEventListener("click", () => {
  inputContainer.classList.toggle("hidden");
  searchInput.focus(); // 입력 필드에 포커스를 맞춥니다.
});

// 검색 버튼 클릭 이벤트 리스너 추가
searchBtn.addEventListener('click', async () => {
  await getNewsByKeyword();
  searchInput.value = ''; // 검색 후 입력 필드 비우기
});

// Enter 키 눌렀을 때 검색 이벤트 리스너 추가
searchInput.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // 기본 Enter 키 동작 방지 (폼 제출 방지)
    await getNewsByKeyword();
    searchInput.value = ''; // 검색 후 입력 필드 비우기
  }
});

// API 키
const API_KEY = `a775a2ad59a6439fabb5ac4a5745542c`;

// 뉴스 리스트를 저장할 배열
let newsList = [];

// 최신 뉴스를 가져오는 함수
const getLatesNews = async () => {
  const url = new URL(
    `https://mynewsmagazine.netlify.app/top-headlines?country=kr`
  );
  const response = await fetch(url);
  const data = await response.json();
  newsList = data.articles;
  render();
  console.log("sds", newsList);
};

// 페이지 로드 시 최신 뉴스를 가져옵니다.
getLatesNews();

// 카테고리별 뉴스를 가져오는 함수
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category", category);
  const url = new URL(
    `https://mynewsmagazine.netlify.app/top-headlines?country=kr&category=${category}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("category data", data);
  newsList = data.articles;
  render();
};

// 키워드로 뉴스를 검색하는 함수
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  console.log("keyword", keyword);

  const url = new URL(
    `https://mynewsmagazine.netlify.app/top-headlines?country=kr&q=${keyword}`
  );
  const response = await fetch(url);
  const data = await response.json();
  console.log("keyword data", data);
  newsList = data.articles;
  searchInput.value = ""
  render();
};

// 사이드 네비게이션을 여는 함수
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

// 사이드 네비게이션을 닫는 함수
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// 창 크기 조정 시 네비게이션 버튼을 토글하는 이벤트 리스너
window.addEventListener('resize', function() {
  if (window.innerWidth <= 1200) {
    navBtn.classList.remove('hidden');
  } else {
    navBtn.classList.add('hidden');
  }
});

// 창 크기 조정 시 메뉴를 토글하는 이벤트 리스너
window.addEventListener('resize', function() {
  if (window.innerWidth >= 1200) {
    menus.classList.remove('hidden');
  } else {
    menus.classList.add('hidden');
  }
});

// 뉴스를 화면에 렌더링하는 함수
const render = () => {
  const newsHTML = newsList.map(news => {
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
        <p>${
          news.description == null || news.description == ""
            ? "내용없음"
            : news.description.length > 200
            ? news.description.substring(0, 200) + "..."
            : news.description
        }</p>
        <div>
          ${news.source.name || "no source"} ${moment(news.publishedAt).fromNow()}
        </div>
      </div>
    </div>`;
  }).join("");

  document.querySelector("#newsBoard").innerHTML = newsHTML;
};

function scrollToTop() {
  window.scrollTo(0, 0);
}

// 1. 버튼에 클릭이벤트 주기
// 2. 카테고리별 뉴스 가져오기
// 3. 그 뉴스를 보여주기

// 1. 입력창에 값을 넣으면 그 값을 저장해서 출력해보기
// 2. 그 값을 render()를 통해서 

// 1. x 잘 작동하게 하기
// 2. 