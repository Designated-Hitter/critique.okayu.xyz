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
    const token = localStorage.getItem("token");
    const response = confirm('정말로 탈퇴하시겠습니까?')

    if (response) {
        const passwordInput = prompt('비밀번호를 입력해주십시오.');

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
    };
};