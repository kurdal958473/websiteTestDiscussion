document.addEventListener("DOMContentLoaded", () => {
  const clickImage = document.getElementById("clickable-img");
  const countDisplay = document.getElementById("click-count");

  async function refreshCount() {
    try {
      const res = await fetch("/api/get-click-count");
      const data = await res.json();
      if (data.success) {
        countDisplay.textContent = `點讚次數：${data.count}`;





      } else {
        countDisplay.textContent = "讀取失敗";
      }
    } catch (err) {
      console.error(err);
      countDisplay.textContent = "錯誤";
    }
  }

  clickImage.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/increment-click", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        countDisplay.textContent = `點讚次數：${data.newCount}`;
      }
    } catch (err) {
      console.error("點讚失敗", err);
    }
  });

  refreshCount(); // 頁面載入時讀取目前點擊數
});
