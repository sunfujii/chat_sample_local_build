(() => {
  //const CHAT_URL = "https://sunfujii.github.io/chat_sample_local_build/";
  const CHAT_URL = "http://localhost:8080/out/";
  const SIDEBAR_WIDTH = 400;

  // スタイルを挿入
  const style = document.createElement("style");
  style.textContent = `
    #chat-sidebar {
      position: fixed;
      top: 0;
      right: -${SIDEBAR_WIDTH}px;
      width: ${SIDEBAR_WIDTH}px;
      height: 100vh;
      background: #fff;
      border-left: 1px solid #ccc;
      box-shadow: -3px 0 6px rgba(0,0,0,0.1);
      transition: right 0.3s ease;
      display: flex;
      flex-direction: column;
      z-index: 9998;
    }

    #chat-sidebar.open {
      right: 0;
    }

    #chat-sidebar iframe {
      border: none;
      width: 100%;
      height: 100%;
      flex: 1;
    }

    #chat-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #0078ff;
      color: white;
      font-size: 14px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 9999;
      transition: right 0.3s ease;
    }

    #chat-toggle-btn:hover {
      background: #005fd1;
    }
  `;
  document.head.appendChild(style);

  // サイドバーを作成
  const sidebar = document.createElement("div");
  sidebar.id = "chat-sidebar";
  const iframe = document.createElement("iframe");
  iframe.src = CHAT_URL;
  sidebar.appendChild(iframe);
  document.body.appendChild(sidebar);

  // トグルボタンを作成
  const button = document.createElement("button");
  button.id = "chat-toggle-btn";
  button.textContent = "Chat";
  document.body.appendChild(button);

  // 開閉トグル動作
  let isOpen = false;
  button.addEventListener("click", () => {
    isOpen = !isOpen;
    sidebar.classList.toggle("open", isOpen);
    button.textContent = isOpen ? "Close" : "Chat";

    // サイドバーが開いたときはボタンを左にずらす
    if (isOpen) {
      button.style.right = `${SIDEBAR_WIDTH + 20}px`;
    } else {
      button.style.right = "20px";
    }
  });
})();
