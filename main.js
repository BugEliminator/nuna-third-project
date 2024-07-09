
const API_KEY = `a775a2ad59a6439fabb5ac4a5745542c`
let news = []
const getLatesNews = async() => {
  const url = new URL(
    `https://mynewsmagazine.netlify.app/top-headlines?country=kr

    `
  );
  const response = await fetch(url);
  const data = await response.json();
  news = data.articles
  console.log("sds", news);
};

getLatesNews();