;(async () => {
    const page = Number(new URLSearchParams(location.search).get("page") ?? 1);
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    if(!token) {
        alert("로그인이 필요합니다.");
        location.href="index.html";
    }

    if(token) {
        const nickname = decoded.nickname;
        const myPage = document.querySelector('div[name="nickname"]');
        const nick = document.createElement('h1');
        nick.classList.add('nickname');
        nick.innerHTML = nickname + " 님의 개인페이지";
        myPage.append(nick);
    }

    //자기가 최근 작성한 서평들
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/individual?nickname=${decoded.nickname}&page=${page}`
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


        const divButtons = document.createElement('div');
        divButtons.classList.add('buttons');
        
        const deleteThis = document.createElement('button');
        deleteThis.classList.add("delete");
        deleteThis.innerText = "삭제";
        deleteThis.addEventListener("click", () =>{deleteThisCritique(critiqueNo)});

        const updateThis = document.createElement('button');
        updateThis.classList.add("update");
        updateThis.innerText = "수정";
        updateThis.addEventListener("click", () => {modifyThisCritique(critiqueNo)})
        divButtons.append(deleteThis, updateThis)

        eachCritique.append(divCover, divStarGrade, divComment, divButtons)
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


    //개인정보 구역
    const updatePersonalInfo = document.querySelector('div[name="updateMyInfo"]');
    const updatePersonalInfoButton = document.createElement("button");
    updatePersonalInfoButton.classList.add("update-personal-info");
    updatePersonalInfoButton.classList.add("button-61");
    updatePersonalInfoButton.innerText = "개인정보 수정";
    updatePersonalInfoButton.addEventListener("click", updateInfo);
    updatePersonalInfo.append(updatePersonalInfoButton);

    if(!decoded.verified) {
        const resendVerificationEmail = document.createElement("button");
        resendVerificationEmail.classList.add('reverify');
        resendVerificationEmail.classList.add('button-61');
        resendVerificationEmail.innerHTML = "이메일 재인증하기";
        resendVerificationEmail.addEventListener('click', reverify);
        updatePersonalInfo.append(resendVerificationEmail);
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

//서평 수정
async function modifyThisCritique(critiqueNo){
    location.href = `modifyCritique.html?critique_no=${critiqueNo}`;
}

//서평 삭제 -- 왜 해당 서평 페이지로 가는지 의문
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
        location.href="myPage.html";
    } else{
        location.href="myPage.html";
        return;
    }
}
//개인정보 업데이트
async function updateInfo() {
    location.href = "personalInfo.html"
}

//이메일 재인증
async function reverify() {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    const email = decoded.email;

    const result = await axios({
        method: "POST",
        url: "https://api.critique.okayu.xyz/user/reverify",
        data: {
            email: email
        }
    })

    alert("재인증용 이메일을 보냈습니다. 확인해주십시오.")
}