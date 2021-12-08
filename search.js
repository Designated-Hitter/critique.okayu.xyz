;(async() => {
    const searchWord = new URLSearchParams(location.search).get("keyword")
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/search?keyword=${searchWord}`
    })

    const list = result.data.result;
    const searchResult = document.querySelector('div.search-result');

    for(const item of list){
        const itemId = item.item_id;
        const cover = item.cover;
        const resultCover = document.createElement('img');
        resultCover.classList.add('cover');
        resultCover.src = cover;
        
        const title = item.title;
        const resultTitle = document.createElement('div');
        resultTitle.classList.add('title');
        resultTitle.innerText = "제목: " + title;

        const author = item.author;
        const resultAuthor = document.createElement('div');
        resultAuthor.classList.add('author');
        resultAuthor.innerText = "저자: " + author;

        const category = item.category_name;
        const resultCategory = document.createElement('div');
        resultCategory.classList.add('category');
        resultCategory.innerText = "분류: " + category;

        const publisher = item.publisher;
        const resultPublisher = document.createElement('div');
        resultPublisher.classList.add('publisher');
        resultPublisher.innerText = "출판사: " + publisher ;

        const writeComment = document.createElement('button');
        writeComment.addEventListener("click", () => {writeCritique(itemId, )});
        writeComment.innerText = "서평 쓰기"

        const searchedBook = document.createElement('div');
        searchedBook.classList.add("searched");

        searchedBook.append(resultCover, resultTitle, resultAuthor, resultCategory, resultPublisher, writeComment);
        searchResult.append(searchedBook)
    }
})()

async function writeCritique(keyword) {
    const itemId = keyword;
    location.href = `writeCritique.html?itemId=${itemId}&author=${author}&cover=${cover}`;
}

async function aladinSearch(){ 
    const searchWord = document.querySelector('input[name="aladin-search"]').value
    location.href = `advSearch.html?keyword=${searchWord}`
}