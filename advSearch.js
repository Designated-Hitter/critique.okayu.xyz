;(async() => {
    const searchWord = new URLSearchParams(location.search).get("keyword")
    const encodedWord = encodeURIComponent(searchWord)
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/search/adv?keyword=${encodedWord}`
    })

    const list = result.data.result;
    const searchResult = document.querySelector('div.search-result');

    for(const item of list){
        const itemId = item.item_id;
        const cover = item.cover;

        const a = document.createElement('a');
        a.classList.add(`to-entire-critique-${itemId}`)
        a.href = `readManyCritiques.html?book_id=${itemId}`

        const resultCover = document.createElement('img');
        resultCover.classList.add('cover');
        resultCover.src = cover;
        
        const title = item.title;
        const resultTitle = document.createElement('div');
        resultTitle.classList.add('title');
        resultTitle.innerText = "제목: " + title;
        a.append(resultCover, resultTitle);

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
        writeComment.innerText = "서평 쓰기"

        const searchedBook = document.createElement('div');
        searchedBook.classList.add("searched");

        searchedBook.append(a, resultAuthor, resultCategory, resultPublisher, writeComment);
        searchResult.append(searchedBook)
    }

})();

async function writeCritique(itemId, author, cover) {
    const writeItemId = itemId;
    const writeAuthor = author;
    const writeCover = cover;
    location.href = `writeCritique.html?itemId=${writeItemId}&author=${writeAuthor}&cover=${writeCover}`;
}
