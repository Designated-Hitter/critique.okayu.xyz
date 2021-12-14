async function tryUpdateInfo() {
    const token = localStorage.getItem("token");

    const oldPassword = document.querySelector('input[name="old-password"]').value;
    const newPassword = document.querySelector('input[name="password"]').value;
    const newPasswordConfirm = document.querySelector('input[name="password-confirm"]').value;
    const newNickname = document.querySelector('input[name="nickname"]').value;

    if (newPassword !== newPasswordConfirm) {
        alert('새로운 비밀번호가 일치하지 않습니다.');
        return;
    }

    if(newNickname.length > 20) {
        alert('닉네임이 20글자를 초과했습니다.');
        return;
    }

    const result = await axios({
        "method": "POST",
        "url": "https://api.critique.okayu.xyz/user/update",
        "data": {
            "oldPassword": oldPassword,
            "newPassword": newPassword,
            "newNickname": newNickname
        },
        "headers": { "Authorization": token }
    });

    if (result.data.success){
        alert(result.data.message);
        location.href = 'index.html';
    }else {
        alert(result.data.error);
    }

}
async function tryDeleteInfo() {
    
    const response = confirm('정말로 탈퇴하시겠습니까? 지금까지 작성하신 모든 서평과 개인정보는 삭제됩니다.')

    if (response) {
        const withdraw = document.querySelector('div.withdraw');
        const lastPassword = document.createElement('input');
        lastPassword.type = "password";
        lastPassword.name = 'last-password';
        lastPassword.placeholder = "비밀번호를 입력해주십시오."
        const leaveButton = document.createElement('button');
        leaveButton.classList.add('leave');
        leaveButton.innerText = "탈퇴"
        leaveButton.addEventListener("click", leave)
        withdraw.append(lastPassword, leaveButton);
        

    };
};

async function leave() {
    const lastPassword = document.querySelector('input[name="last-password"]');
    const token = localStorage.getItem("token");
    const passwordInput = lastPassword.value;

    const result = await axios({
        method: "DELETE",
        url: "https://api.critique.okayu.xyz/user/delete",
        data: { password: passwordInput },
        headers: { Authorization: token }
    });

    if (!result.data.success) {
        alert(result.data.error);
        return;
    } else {
        alert(result.data.message);
        localStorage.removeItem("token");
        location.href = 'index.html';
    };
}