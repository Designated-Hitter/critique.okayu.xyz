;(async() => {
    const searchWord = new URLSearchParams(location.search).get("keyword");
    const page = Number(new URLSearchParams(location.search).get("page") ?? 1);
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/search?keyword=${searchWord}&page=${page}`
    })

    const list = result.data.result;
    const searchResult = document.querySelector('div.search-result');

    for(const item of list){
        const itemId = item.item_id;
        const cover = item.cover;

        const a = document.createElement('a');
        a.classList.add(`to-entire-critique-${itemId}`);
        a.href = `readManyCritiques.html?book_id=${itemId}`;

        const imgBox = document.createElement('div');
        imgBox.classList.add('imgBox');
        const resultCover = document.createElement('img');
        resultCover.classList.add('cover');
        resultCover.src = cover;
        imgBox.append(resultCover);
        
        const title = item.title;
        const resultTitle = document.createElement('div');
        resultTitle.classList.add('title');
        resultTitle.innerText = "제목: " + title;
        a.append(imgBox, resultTitle);

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
        writeComment.addEventListener("click", () => {writeCritique(itemId, author, cover)});
        writeComment.innerText = "서평 쓰기";

        const searchedBook = document.createElement('div');
        searchedBook.classList.add("searched");

        searchedBook.append(a, resultAuthor, resultCategory, resultPublisher, writeComment);
        searchResult.append(searchedBook);
    };

    //페이지네이션
    const numberOfSearches = result.data.number_of_searches;
    const firstPageOfAll = 1;
    const lastPageOfAll = Math.ceil(numberOfSearches / 10);
    console.log(lastPageOfAll)
    const firstPageOfThis = (Math.ceil(page / 10) - 1) * 10 + 1;
    console.log(firstPageOfThis)
    const lastPageOfThis = Math.ceil(page / 10) * 10;
    console.log(lastPageOfThis)
    const displayFirstPage = firstPageOfAll > firstPageOfThis ? firstPageOfAll : firstPageOfThis;
    console.log(displayFirstPage)
    const displayLastPage = lastPageOfAll > lastPageOfThis ? lastPageOfThis : lastPageOfAll;
    console.log(displayLastPage)

    const pagination = document.querySelector("div.page");

    if(displayFirstPage !== firstPageOfAll) {
        const aPage = document.createElement('a');
        aPage.href = `search.html?keyword=${searchWord}&page=${displayFirstPage - 1}`;
        aPage.innerText = "이전 페이지";

        pagination.append(aPage);
    }

    for (let p = displayFirstPage; p <= displayLastPage; p++) {
        const aPage = document.createElement('a');
        aPage.href = `search.html?keyword=${searchWord}&page=${p}`;
        aPage.innerText = p;
        
        if(p === page) {
            aPage.classList.add('now-page');
        }
        pagination.append(aPage);
    }

    if (displayLastPage !== lastPageOfAll) {
        const aPage = document.createElement('a');
        aPage.href = `search.html?keyword=${searchWord}&page=${displayLastPage + 1}`;
        aPage.innerText = "다음 페이지";

        pagination.append(aPage);
    }
})();

async function writeCritique(itemId, author, cover) {
    const writeItemId = itemId;
    const writeAuthor = author;
    const writeCover = cover;
    location.href = `writeCritique.html?itemId=${writeItemId}&author=${writeAuthor}&cover=${writeCover}`;
};

async function aladinSearch(){ 
    const searchWord = document.querySelector('input[name="aladin-search"]').value;
    location.href = `advSearch.html?keyword=${searchWord}`;
};