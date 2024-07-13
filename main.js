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

let url = new URL(` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`)

let totalResults = 0
let page = 1
let pageSize = 10
let groupSize = 5

 
const getNews = async() => {
  try{
    url.searchParams.set("page", page); // => &page=page
    url.searchParams.set("pageSize", pageSize);    
    const response = await fetch(url);
    const data = await response.json();
    console.log("data", data)
    if(response.status === 200) {
        if(data.articles.length === 0) {
          throw new Error("이 검색에 대한 결과가 없습니다.");
        }
      newsList = data.articles;
      totalResults = data.totalResults;
      render(); 
      paginationRender();
    } else {
      throw new Error(data.message)
    }

  }catch(error){
    errorRender(error.message)
  }
     console.log("ds" ,newsList)
}

// 최신 뉴스를 가져오는 함수
const getLatesNews = async () => {
  url = new URL(
    ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr`
  );

  await getNews();
};



// 카테고리별 뉴스를 가져오는 함수
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&category=${category}`
  );

  await getNews();
};

// 키워드로 뉴스를 검색하는 함수
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  url = new URL(
    ` https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines?country=kr&q=${keyword}`
  );
  await getNews()
  searchInput.value = ""
};

// 사이드 네비게이션을 여는 함수
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}


// 사이드 네비게이션을 닫는 함수
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// 메인페이지 이동
document.getElementById('main').addEventListener('click', function() {
  window.location.href = 'https://mynewsmagazine.netlify.app';
});


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
        `<img class = "noImg" src="https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png">`}
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
          ${news.source.name || "no source"} / ${moment(news.publishedAt).fromNow()} / ${ news.author || "no author"}
        </div>
      </div>
    </div>`;
  }).join("");

  document.querySelector("#newsBoard").innerHTML = newsHTML;
};

const errorRender = (errorMassage) => {
  const errorHtml = `<div class="alert alert-danger d-flex align-items-center" role="alert">
  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
  <div>
    ${errorMassage}
  </div>
  </div>`
  document.querySelector("#newsBoard").innerHTML = errorHtml
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

const paginationRender = () => {
   // totalREsult,
   // page  1
   // pageSize  10
   // groupSize   5


   // pageGroup
   const pageGroup = Math.ceil(page / groupSize)

  // totalPages
   const totalPages = Math.ceil(totalResults / pageSize)

   // lastPage
   let lastPage = pageGroup * groupSize
   if(lastPage > totalPages) {
    lastPage = totalPages
   }
   // firstPage
   const firstPage = 
    lastPage - (groupSize - 1)<= 0? 1 : lastPage - (groupSize - 1);


  let paginationHTML = `<li class="page-item" onClick="moveToPage(${page - 1})"><a class="page-link">Previous</a></li>`

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page? "active" : "" 
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
  }
  paginationHTML += `<li class="page-item" onClick="moveToPage(${page + 1})"><a class="page-link">Next</a></li>`
  document.querySelector(".pagination").innerHTML = paginationHTML

  /*
`<nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item"><a class="page-link">Previous</a></li>
    <li class="page-item"><a class="page-link">1</a></li>
    <li class="page-item"><a class="page-link">2</a></li>
    <li class="page-item"><a class="page-link">3</a></li>
    <li class="page-item"><a class="page-link">Next</a></li>
  </ul>
</nav>`
  */
}

const moveToPage = (pageNum) => {
  console.log("출력", pageNum);
  page = pageNum
  getNews()
}

// 페이지 로드 시 최신 뉴스를 가져옵니다.
getLatesNews();