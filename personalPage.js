;(async () => {
    const page = Number(new URLSearchParams(location.search).get("page") ?? 1);
    const nickname = new URLSearchParams(location.search).get("nickname");

    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);

    if(!token) {
        alert("로그인이 필요합니다.");
        location.href="index.html";
    }

    if(token) {
        const myPage = document.querySelector('div[name="nickname"]');
        const nick = document.createElement('h1');
        nick.classList.add('nickname');
        nick.innerHTML = nickname + " 님의 개인페이지";
        myPage.append(nick);
    }

    if(decoded.nickname === nickname){
        location.href = "myPage.html"
    }

    //최근 작성한 서평들
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/individual?nickname=${nickname}&page=${page}`
    })
    const list = result.data.result
    const recentMyCritique = document.querySelector('div[name="recentCritique"]');
    
    for(const item of list) {
        const critiqueNo = item.critique_no;
        const aToOneCritique = document.createElement('a');
        aToOneCritique.classList.add(`to-critique-${critiqueNo}`);
        aToOneCritique.href =`readOneCritique.html?critique_no=${critiqueNo}`
        const eachCritique = document.createElement('div');
        eachCritique.classList.add('each');
        const divCover = document.createElement('div');
        divCover.classList.add('cover');
        const cover = document.createElement('img');
        cover.classList.add('cover')
        cover.src = item.cover;
        divCover.append(cover);
        
        const divStarGrade = document.createElement('div');
        divStarGrade.classList.add('star-grade');
        const starGradeLabel = document.createElement('label');
        starGradeLabel.classList.add('star-grade');
        starGradeLabel.innerHTML = "평점: " ;
        const starGradeWrapper = document.createElement('div');
        starGradeWrapper.classList.add('star-grade-wrapper');
        const starGrade = document.createElement('label');
        starGrade.classList.add('star-grade');
        starGrade.innerHTML = "★★★★★";
        starGradeWrapper.append(starGrade);
        starGradeWrapper.style.width = `calc(75px * ${item.star_grade} / 10)`;
        divStarGrade.append(starGradeLabel,starGradeWrapper);

        const divComment = document.createElement('div');
        divComment.classList.add('comment');
        const comment = document.createElement('label');
        comment.classList.add('comment');
        comment.innerHTML = "한줄평: " + item.comment;
        divComment.append(comment)

        eachCritique.append(divCover, divStarGrade, divComment)
        aToOneCritique.append(eachCritique)
        recentMyCritique.append(aToOneCritique);
    }

    //페이지 네이션
    const numberOfSearches = result.data.number_of_critiques;
    const firstPageOfAll = 1;
    const lastPageOfAll = Math.ceil(numberOfSearches / 10);
    
    const firstPageOfThis = (Math.ceil(page / 10) - 1) * 10 + 1;
    const lastPageOfThis = Math.ceil(page / 10) * 10;

    const displayFirstPage = firstPageOfAll > firstPageOfThis ? firstPageOfAll : firstPageOfThis;
    const displayLastPage = lastPageOfAll > lastPageOfThis ? lastPageOfThis : lastPageOfAll;


    const pagination = document.querySelector("div.page");

    if(displayFirstPage !== firstPageOfAll) {
        const aPage = document.createElement('a');
        aPage.classList.add('pagination');
        aPage.classList.add('arrow')
        aPage.href = `myPage.html?page=${displayFirstPage - 1}`;
        aPage.innerText = "이전 페이지";

        pagination.append(aPage);
    }

    for (let p = displayFirstPage; p <= displayLastPage; p++) {
        const aPage = document.createElement('a');
        aPage.classList.add('pagination');
        aPage.href = `myPage.html?page=${p}`;
        aPage.innerText = p;
        
        if(p === page) {
            aPage.classList.add('now-page');
        }
        pagination.append(aPage);
    }

    if (displayLastPage !== lastPageOfAll) {
        const aPage = document.createElement('a');
        aPage.classList.add('pagination');
        aPage.classList.add('arrow')
        aPage.href = `myPage.html?page=${displayLastPage + 1}`;
        aPage.innerText = "다음 페이지";

        pagination.append(aPage);
    }


   

})();

function parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

