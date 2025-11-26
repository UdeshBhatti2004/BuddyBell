// import React, { useState } from "react";
// import { useChannelStateContext, useTypingContext } from "stream-chat-react";
// import { Paperclip, SendHorizonal, X } from "lucide-react";


// const CustomMessageInput = () => {
//   const { channel } = useChannelStateContext();
//   const { typing } = useTypingContext();
//   const [message, setMessage] = useState("");
//   const [attachments, setAttachments] = useState([]);

//   if (!channel) return null;

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (message.trim() === "" && attachments.length === 0) return;

//     try {
//       await channel.sendMessage({
//         text: message,
//         attachments,
//       });
//       setMessage("");
//       setAttachments([]);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);

//     const uploaded = await Promise.all(
//       files.map(async (file) => {
//         try {
//           const response = await channel.sendFile(file);
//           return {
//             type: "file",
//             asset_url: response.file,
//             title: file.name,
//             mime_type: file.type,
//           };
//         } catch (error) {
//           console.error("Upload failed", error);
//           return null;
//         }
//       })
//     );

//     setAttachments((prev) => [...prev, ...uploaded.filter(Boolean)]);
//   };

//   const removeAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   // Typing indicator: filter out current user
//   const typingUsers = Object.values(typing || {}).filter(
//     (u) => u?.user?.id !== channel.getClient().user?.id
//   );

//   return (
//     <div className="w-full px-4 pt-1 pb">
//       {/* Typing indicator */}
      

//       {/* Attachments Preview */}
//       {attachments.length > 0 && (
//         <div className="flex flex-wrap gap-2 px-2 mb-2">
//           {attachments.map((file, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
//             >
//               <span className="truncate max-w-[100px]">{file.title}</span>
//               <X
//                 className="w-4 h-4 cursor-pointer hover:text-red-500"
//                 onClick={() => removeAttachment(index)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Input Row */}
//       <form
//         onSubmit={handleSend}
//         className="w-full flex items-center gap-3 px-4 py-2 rounded-full shadow-sm bg-red-600"
//       >
//         {/* Attach Icon */}
//         <label className="cursor-pointer text-gray-500 hover:text-[#0095f6] transition">
//           <Paperclip className="w-5 h-5 bg-blue-300"  />
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </label>

//         {/* Input */}
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => {
//             setMessage(e.target.value);
//             channel.keystroke();
//           }}
//           placeholder="Type a message..."
//           className="flex-1 text-sm bg-transparent focus:outline-none"
//         />

//         {/* Send Button */}
//         <button
//           type="submit"
//           disabled={message.trim() === "" && attachments.length === 0}
//           className={`p-2 rounded-full transition ${
//             message.trim() === "" && attachments.length === 0
//               ? "text-gray-300 cursor-not-allowed"
//               : "text-[#0095f6] hover:text-[#007cd2]"
//           }`}
//         >
//           <SendHorizonal className="w-5 h-5 bg-green-400" />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomMessageInput;

// import React, { useState } from "react";
// import { useChannelStateContext, useTypingContext } from "stream-chat-react";
// import { Paperclip, SendHorizonal, X } from "lucide-react";
// import { useThemeStore } from "../store/ThemeSelector";
// import { THEMES } from "../configurations/index.js"; // ✅ central theme config

// const CustomMessageInput = () => {
//   const { channel } = useChannelStateContext();
//   const { typing } = useTypingContext();
//   const { theme } = useThemeStore();
//   const [message, setMessage] = useState("");
//   const [attachments, setAttachments] = useState([]);

//   if (!channel) return null;

//   // ✅ get theme classes directly from THEMES
//   const currentTheme =
//     THEMES.find((t) => t.name === theme)?.classes || THEMES[0].classes;

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (message.trim() === "" && attachments.length === 0) return;

//     try {
//       await channel.sendMessage({
//         text: message,
//         attachments,
//       });
//       setMessage("");
//       setAttachments([]);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     const uploaded = await Promise.all(
//       files.map(async (file) => {
//         try {
//           const response = await channel.sendFile(file);
//           return {
//             type: "file",
//             asset_url: response.file,
//             title: file.name,
//             mime_type: file.type,
//           };
//         } catch (error) {
//           console.error("Upload failed", error);
//           return null;
//         }
//       })
//     );
//     setAttachments((prev) => [...prev, ...uploaded.filter(Boolean)]);
//   };

//   const removeAttachment = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="w-full px-4 pt-1 pb bg-red-500">
//       {/* Attachments Preview */}
//       {attachments.length > 0 && (
//         <div className="flex flex-wrap gap-2 px-2 mb-2">
//           {attachments.map((file, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
//             >
//               <span className="truncate max-w-[100px]">{file.title}</span>
//               <X
//                 className="w-4 h-4 cursor-pointer hover:text-red-500"
//                 onClick={() => removeAttachment(index)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Input Row */}
//       <form
//         onSubmit={handleSend}
//         className={`w-full flex items-center gap-3 px-4 py-2 rounded-full shadow-sm ${currentTheme.inputBg}`}
//       >
//         {/* Attach Icon */}
//         <label
//           className={`cursor-pointer transition ${currentTheme.attachIcon}`}
//         >
//           <Paperclip className="w-5 h-5" />
//           <input
//             type="file"
//             multiple
//             onChange={handleFileChange}
//             className="hidden"
//           />
//         </label>

//         {/* Input */}
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => {
//             setMessage(e.target.value);
//             channel.keystroke();
//           }}
//           placeholder="Type a message..."
//           className="flex-1 text-sm bg-transparent focus:outline-none"
//         />

//         {/* Send Button */}
//         <button
//           type="submit"
//           disabled={message.trim() === "" && attachments.length === 0}
//           className={`p-2 rounded-full transition ${
//             message.trim() === "" && attachments.length === 0
//               ? "text-gray-300 cursor-not-allowed"
//               : currentTheme.sendIcon
//           }`}
//         >
//           <SendHorizonal className="w-5 h-5" />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CustomMessageInput;
import React, { useState } from "react";
import { useChannelStateContext, useTypingContext } from "stream-chat-react";
import { Paperclip, SendHorizonal, X } from "lucide-react";
import { useThemeStore } from "../store/ThemeSelector";
import { THEMES } from "../configurations/index.js";

const CustomMessageInput = () => {
  const { channel } = useChannelStateContext();
  const { typing } = useTypingContext();
  const { theme } = useThemeStore();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  if (!channel) return null;

  // Get current theme object
  const currentTheme = THEMES.find((t) => t.name === theme);
  const containerBgColor = currentTheme?.colors[0] || "#ffffff";
  const inputBgClass = currentTheme?.classes?.inputBg || "bg-white";
  const attachIconClass = currentTheme?.classes?.attachIcon || "text-gray-500";
  const sendIconClass = currentTheme?.classes?.sendIcon || "text-blue-500";

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim() === "" && attachments.length === 0) return;

    try {
      await channel.sendMessage({
        text: message,
        attachments,
      });
      setMessage("");
      setAttachments([]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const uploaded = await Promise.all(
      files.map(async (file) => {
        try {
          const response = await channel.sendFile(file);
          return {
            type: "file",
            asset_url: response.file,
            title: file.name,
            mime_type: file.type,
          };
        } catch (error) {
          console.error("Upload failed", error);
          return null;
        }
      })
    );
    setAttachments((prev) => [...prev, ...uploaded.filter(Boolean)]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Typing indicator: filter out current user
  const typingUsers = Object.values(typing || {}).filter(
    (u) => u?.user?.id !== channel.getClient().user?.id
  );

  return (
    <div className="w-full px-4 pt-2 pb-2" style={{ backgroundColor: containerBgColor }}>
  {attachments.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-2">
      {attachments.map((file, index) => (
        <div
          key={index}
          className="bg-gray-100 text-sm text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
        >
          <span className="truncate max-w-[100px]">{file.title}</span>
          <X className="w-4 h-4 cursor-pointer hover:text-red-500" onClick={() => removeAttachment(index)} />
        </div>
      ))}
    </div>
  )}

  <form
    onSubmit={handleSend}
    className={`w-full flex items-center gap-3 px-4 py-2 rounded-full shadow-sm`}
  >
    <label className={`cursor-pointer transition`}>
      <Paperclip className="w-5 h-5" />
      <input type="file" multiple onChange={handleFileChange} className="hidden" />
    </label>

    <input
      type="text"
      value={message}
      onChange={(e) => {
        setMessage(e.target.value);
        channel.keystroke();
      }}
      placeholder="Type a message..."
      className="flex-1 text-sm bg-transparent focus:outline-none"
    />

    <button
      type="submit"
      disabled={message.trim() === "" && attachments.length === 0}
      className={`p-2 rounded-full transition ${
        message.trim() === "" && attachments.length === 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"
      }`}
    >
      <SendHorizonal className="w-5 h-5" />
    </button>
  </form>
</div>

  );
};

export default CustomMessageInput;
