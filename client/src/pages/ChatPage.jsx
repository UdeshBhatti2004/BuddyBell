// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import useAuthUser from "../hooks/useAuthUser";
// import { useQuery } from "@tanstack/react-query";
// import { getStreamToken } from "../lib/api";
// import {
//   Chat,
//   Channel,
//   ChannelHeader,
//   MessageList,
//   Window,
//   Thread,
// } from "stream-chat-react";

// import toast from "react-hot-toast";
// import PageLoader from "../components/PageLoader.jsx";
// import CallButton from "../components/CallButton.jsx";
// import ChatNavbar from "../components/ChatNavbar.jsx";
// import { getStreamClient } from "../lib/streamClient.js";
// import CustomInput from "../components/CustomInput.jsx";
// import "stream-chat-react/dist/css/v2/index.css"; // ✅ already in your code
// import { useThemeStore } from "../store/ThemeSelector.js";



// const ChatPage = () => {
//   const { id } = useParams();
//   const [channel, setChannel] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { authUser } = useAuthUser();
//   const client = getStreamClient();

//   const { data: tokenData } = useQuery({
//     queryKey: ["streamToken"],
//     queryFn: getStreamToken,
//     enabled: !!authUser,
//   });

//   useEffect(() => {
//     const setupChannel = async () => {
//       if (!authUser || !tokenData?.token) return;

//       try {
//         if (!client.userID) {
//           await client.connectUser(
//             {
//               id: authUser._id,
//               name: authUser.name,
//               image: authUser.profilePicture,
//             },
//             tokenData.token
//           );
//         }

//         const channelId = [authUser._id, id].sort().join("-");
//         const currentChannel = client.channel("messaging", channelId, {
//           members: [authUser._id, id],
//         });

//         await currentChannel.watch();
//         setChannel(currentChannel);
//       } catch (error) {
//         console.error("Error setting up chat:", error);
//         toast.error("Failed to load chat. Please refresh.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     setupChannel();
//   }, [authUser, id, tokenData, client]);

//   const handleVideoCall = () => {
//     if (channel) {
//       const callUrl = `${window.location.origin}/call/${channel.id}`;
//       channel.sendMessage({
//         text: `Join the video call: ${callUrl}`,
//       });
//       toast.success("Video call link sent!");
//     }
//   };

//   if (loading || !channel) return <PageLoader />;

//   return (
//   <div className="flex flex-col h-[93vh] sm:h-screen">
   
//   <Chat client={client} >
    
//     <ChatNavbar  />
//     <div className="chat-overlay"></div>

//     <Channel channel={channel} Input={CustomInput}>
//       <div className="flex flex-col flex-grow overflow-hidden">	
        
//         <Window className="flex flex-col flex-grow">
//           <ChannelHeader   />
//           <MessageList className="flex-grow overflow-y-auto" />
//           <CustomInput />
//         </Window>
//         <Thread />
//       </div>

//       <CallButton handleVideoCall={handleVideoCall} />
//     </Channel>
//   </Chat>
// </div>


//   );
// };

// export default ChatPage;




import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  Window,
  Thread,
} from "stream-chat-react";

import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";
import CallButton from "../components/CallButton.jsx";
import ChatNavbar from "../components/ChatNavbar.jsx";
import { getStreamClient } from "../lib/streamClient.js";
import CustomInput from "../components/CustomInput.jsx";
import "stream-chat-react/dist/css/v2/index.css";

import { useThemeStore } from "../store/ThemeSelector.js";

const ChatPage = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();
  const client = getStreamClient();

  const { theme } = useThemeStore();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const setupChannel = async () => {
      if (!authUser || !tokenData?.token) return;

      try {
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.name,
              image: authUser.profilePicture,
            },
            tokenData.token
          );
        }

        const channelId = [authUser._id, id].sort().join("-");
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, id],
        });

        await currentChannel.watch();
        setChannel(currentChannel);
      } catch (error) {
        console.error("Error setting up chat:", error);
        toast.error("Failed to load chat. Please refresh.");
      } finally {
        setLoading(false);
      }
    };

    setupChannel();
  }, [authUser, id, tokenData, client]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `Join the video call: ${callUrl}`,
      });
      toast.success("Video call link sent!");
    }
  };

  if (loading || !channel) return <PageLoader />;

  return (
<div className={`${theme} flex flex-col h-screen overflow-hidden`}>
  <Chat client={client} theme={theme}>
    <ChatNavbar />

    {/* Padding from top and sides */}
    <div className={`${theme} flex flex-col flex-grow min-h-0   sm:px-6  w-full`}>
      <Channel
        channel={channel}
        Input={CustomInput}
        theme={theme}
        className="flex flex-col flex-grow min-h-0 w-full bg-transparent"
      >
        <Window className="flex flex-col flex-grow min-h-0 overflow-hidden bg-transparent">
          <ChannelHeader theme={theme} />

          <MessageList
            className="flex-1 overflow-y-auto px-4 sm:px-2 bg-transparent"
            theme={theme}
          />

          <div className="flex-shrink-0">
            <CustomInput theme={theme} />
          </div>
        </Window>

        <Thread className="flex-shrink-0 bg-transparent" />

        <CallButton handleVideoCall={handleVideoCall} />
      </Channel>
    </div>
  </Chat>
</div>



  );
};

export default ChatPage;

