;(async () => {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    if(!token) {
        alert("로그인이 필요합니다.");
        location.href="index.html";
    }

    if(token) {
        const nickname = decoded.nickname;
        const myPage = document.querySelector('div[name="myPage"]');
        const nick = document.createElement('h1');
        nick.classList.add('nickname');
        nick.innerHTML = nickname + " 님의 개인페이지";
        myPage.append(nick);
    }

    //자기가 최근 작성한 서평들
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/individual?email=${decoded.email}`
    })
    const list = result.data.result
    const recentMyCritique = document.querySelector('div[name="recentCritique"]');
    
    for(const item of list) {
        const critiqueNo = item.critique_no;
        const cover = document.createElement('img');
        cover.classList.add('cover')
        cover.src = item.cover;
        
        const starGrade = document.createElement('label');
        starGrade.classList.add('star-grade');
        starGrade.innerHTML = "평점: " + item.star_grade;

        const comment = document.createElement('label');
        comment.classList.add('comment')
        comment.innerHTML = "한줄평: " + item.comment;

        const deleteThis = document.createElement('button');
        deleteThis.classList.add("delete");
        deleteThis.innerText = "삭제";
        deleteThis.addEventListener("click", () =>{deleteThisCritique(critiqueNo)});

        const updateThis = document.createElement('button');
        updateThis.classList.add("update");
        updateThis.innerText = "수정";
        updateThis.addEventListener("click", () => {modifyThisCritique(critiqueNo)})

        recentMyCritique.append(cover, starGrade, comment, deleteThis, updateThis);
    }
    const updatePersonalInfo = document.querySelector('div[name="updateMyInfo"]');
    const updatePersonalInfoButton = document.createElement("button");
    updatePersonalInfoButton.classList.add("update-personal-info");
    updatePersonalInfoButton.innerText = "개인정보 수정"
    updatePersonalInfoButton.addEventListener("click", updateInfo);
    updatePersonalInfo.append(updatePersonalInfoButton);

    if(!decoded.verified) {
        const resendVerificationEmail = document.createElement("button");
        resendVerificationEmail.classList.add('reverify');
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