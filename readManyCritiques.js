;(async() => {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    const myNickname = decoded.nickname;

    const bookId = Number(new URLSearchParams(location.search).get("book_id"));
    
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/book_id/${bookId}`
    })
    const bookData = result.data.resultBook;
    console.log(bookData)
    const cover = document.querySelector('img.cover');
    cover.src = bookData.cover;
    const title = document.querySelector('label.title');
    title.innerHTML = "제목: " + bookData.title;
    const author = document.querySelector('label.author');
    author.innerHTML = "저자: " + bookData.author;

    const critiqueData = result.data.resultCritique;

    for(const item of critiqueData) {
        const critiqueDiv = document.querySelector('div.critique')
        const toEachCritique = document.createElement('a');
        toEachCritique.classList.add(`click-to-each-critique-${item.critique_no}`);
        toEachCritique.href = `readOneCritique.html?critique_no=${item.critique_no}`;
        const nickname = document.createElement('label');
        nickname.classList.add('nickname');
        nickname.innerHTML = "리뷰어: " + item.nickname;
        const starGrade = document.createElement('label');
        starGrade.classList.add('star-grade')
        starGrade.innerHTML = "평점: " + item.star_grade;
        const comment = document.createElement('label.comment');
        comment.innerHTML = "한줄평: " + item.comment;
        toEachCritique.append(nickname, starGrade, comment)
        critiqueDiv.append(toEachCritique)
        
        //수정 삭제 버튼은 나만 볼 수 있게
        if(item.nickname == myNickname){
            const footerButton = document.createElement('footer');
            footerButton.classList.add(`footer-${item.nickname}`);
            const deleteButton = document.createElement('button');
            deleteButton.classList.add("delete");
            deleteButton.innerText = "삭제";
            deleteButton.addEventListener("click", () =>{deleteThisCritique(critiqueNo)});
            const modifyButton = document.createElement('button');
            modifyButton.classList.add("modify");
            modifyButton.innerText = "수정";
            modifyButton.addEventListener("click", () => {modifyThisCritique(critiqueNo)});
            footerButton.append(deleteButton, modifyButton);
            critiqueDiv.append(footerButton);
        }
    }
})();

//서평 수정
async function modifyThisCritique(critiqueNo){
    location.href = `modifyCritique.html?critique_no=${critiqueNo}`;
}

//서평 삭제
async function deleteThisCritique(critiqueNo){
    let confirmButton = confirm("정말로 삭제하시겠습니까?")
    if(confirmButton){
        const token = localStorage.getItem("token");
        const result = await axios({
            method:"DELETE",
            url: "https://api.critique.okayu.xyz/critique/delete",
            data: { "critique_no": critiqueNo },
            headers: { "Authorization": token }
        })
        if (!result.data.success){
            alert(result.data.error);
        } else {
            alert(result.data.message);
        }
        location.href="index.html";
    } else{
        return;
    }
}

function parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
