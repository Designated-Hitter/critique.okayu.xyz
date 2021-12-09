;(async() => {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    const myNickname = decoded.nickname;

    const critiqueNo = Number(new URLSearchParams(location.search).get("critique_no"));
    
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/critique_no/${critiqueNo}`
    })
    const bookData = result.data.result;

    const cover = document.querySelector('img.cover');
    cover.src = bookData.cover;
    const title = document.querySelector('label.title');
    title.innerHTML = "제목: " + bookData.title;
    const author = document.querySelector('label.author');
    author.innerHTML = "저자: " + bookData.author;
    const nickname = document.querySelector('label.nickname');
    nickname.innerHTML = "리뷰어: " + bookData.nickname;
    const starGrade = document.querySelector('label.star-grade');
    starGrade.innerHTML = bookData.star_grade;
    const comment = document.querySelector('label.comment');
    comment.innerHTML = "한줄평: " + bookData.comment;
    //긴 서평은 나만 볼수 있게
    if(bookData.nickname == myNickname){
        const secret = document.querySelector('label.secret');
        const critique = document.createElement('div.critique');
        critique.innerText = "총평: " + bookData.critique;
        secret.append(critique);
    }
    //수정 삭제 버튼은 나만 볼 수 있게
    if(bookData.nickname == myNickname){
        const footer = document.querySelector('footer');
        const deleteButton = document.createElement('button');
        deleteButton.classList.add("delete");
        deleteButton.innerText = "삭제";
        deleteButton.addEventListener("click", () =>{deleteThisCritique(critiqueNo)});
        const modifyButton = document.createElement('button');
        modifyButton.classList.add("modify");
        modifyButton.innerText = "수정";
        modifyButton.addEventListener("click", () => {modifyThisCritique(critiqueNo)});
        footer.append(deleteButton, modifyButton)
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
