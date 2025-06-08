async function submitDesc(button) {
  const cell = button.parentElement;
  const row = cell.closest("tr");
  const descDiv = cell.querySelector(".backend-desc");
  const textarea = cell.querySelector("textarea");
  const newText = textarea.value.trim();

  if (!newText) return;

  const houseName = row.dataset.house;
  const city = row.dataset.city;
  const originalDesc = row.cells[2].textContent.trim();
  const username = currentUsername; // 使用全域變數作為使用者名稱

  try {
    button.disabled = true;
    button.textContent = "送出中...";

    const response = await fetch("/api/update-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        houseName,
        city,
        originalDesc,
        newNote: newText,
        username, // 載入使用者名稱
      }),
    });

    const result = await response.json();

    if (result.success) {
      descDiv.textContent = result.updatedDesc; // 更新顯示
      textarea.value = "";
      alert("備註已成功更新到 CSV 檔案！");
    } else {
      alert("更新失敗：" + result.error);
    }
  } catch (error) {
    console.error("更新備註失敗:", error);
    alert("更新失敗，請稍後再試");
  } finally {
    button.disabled = false;
    button.textContent = "送出";
  }
}
