;(async () => {
    const vCode = new URLSearchParams.get(code);
    const result = await axios({
        method: "POST",
        url: `https://api.critique.okayu.xyz/user/verify?code=${vCode}`
    })

    if(result.data.success){
        alert(result.data.error);
        return;
    } else {
        alert(result.data.message);
        location.href = "index.html";
    };

    
});