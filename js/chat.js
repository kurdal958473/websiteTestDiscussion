const currentUsername = "訪客"; // 可用登入系統接入

async function loadComments() {
  const res = await fetch("/api/comments");
  const data = await res.json();
  const board = document.getElementById("comment-board");
  board.innerHTML = "";

  if (!data || data.length === 0) {
    board.textContent = "目前尚無留言。";
    return;
  }

  data.forEach(entry => {
    const div = document.createElement("div");
    div.textContent = `${entry.username}: ${entry.comment}`;
    board.appendChild(div);
  });
}

async function submitComment() {
  const input = document.getElementById("comment-input");
  const comment = input.value.trim();
  if (!comment) return alert("留言不可為空");

  const body = {
    username: currentUsername,
    comment,
    datetime: new Date().toISOString()
  };

  const res = await fetch("/api/add-comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const result = await res.json();
  if (result.success) {
    input.value = "";
    loadComments(); // ✅ 留言成功後刷新
  } else {
    alert("留言失敗：" + result.error);
  }
}

// 初次載入留言
loadComments();
</script>
