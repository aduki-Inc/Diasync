import ChatApp from "./app.js";
import ChatItem from "./chat.js";
import ChatContainer from "./container.js";
import Message from "./message.js";
import ChatImages from "./images.js";
import users from "./users/index.js";

// register the custom element
export default function chats() {
  users();
  customElements.define("chats-section", ChatApp);
  customElements.define("chat-container", ChatContainer);
  customElements.define("chat-item", ChatItem, { extends: "div" });
  customElements.define("message-item", Message, { extends: "div" });
  customElements.define("chat-images", ChatImages, { extends: "div" });
}