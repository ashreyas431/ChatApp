import { useNavigate } from "react-router-dom";
import {
  Window,
  LoadingIndicator,
  Chat,
  ChannelList,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  useChatContext,
} from "stream-chat-react";
import { ChannelListMessengerProps } from "stream-chat-react/dist/components";
import { Button } from "../components/Button";
import { useAuth, useLoggedInAuth } from "../context/AuthContext";

export function Home() {
  const { user, streamChat } = useLoggedInAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <>
      <Chat client={streamChat}>
        <ChannelList
          List={Channels}
          sendChannelsToList
          filters={{ members: { $in: [user.id] } }}
        />
        <Channel>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </Chat>
    </>
  );
}

function Channels({ loadedChannels }: ChannelListMessengerProps) {
  const navigate = useNavigate();
  const {logout} = useLoggedInAuth();
  const { setActiveChannel, channel: activeChannel } = useChatContext();
  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button onClick={() => navigate("/channel/new")}>New Conversation</Button>
      <hr className="border-gray-500" />
      {loadedChannels != null && loadedChannels?.length > 0
        ? loadedChannels.map((channels) => {
            const isActive = channels === activeChannel;
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-gray-100";
            return (
              <button
                onClick={() => setActiveChannel(channels)}
                disabled={isActive}
                className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
                key={channels.id}
              >
                {channels.data?.image && (
                  <img
                    src={channels.data.image}
                    className="w-10 h-10 rounded-full object-center object-cover"
                  />
                )}
                <div className="text-ellipsis overflow-hidden whitespace-nowrap">
                  {channels.data?.name || channels.id}
                </div>
              </button>
            );
          })
        : "no channels"}
      <hr className="border-gray-500 mt-auto" />
      <Button onClick={()=> logout.mutate()} disabled={logout.isLoading}>Logout</Button>
    </div>
  );
}
