async function iForgot() {
    const email = document.querySelector('input[name="email"]').value;
    const result = await axios({
        "method": "POST",
        "url": "https://api.critique.okayu.xyz/user/forgot",
        "data": {
            "email": email,
        }
    });
    if (result.data.success){
        alert(result.data.message);
        location.href = 'index.html';
    }else {
        alert(result.data.error);
    }
}