import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react"; 

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth",
});

// Define Liveblocks types for your application
declare global {
  interface Liveblocks {
    Presence: {
      // Example: cursor: { x: number; y: number };
    };
    Storage: {
      // Example: animals: LiveList<string>;
    };
    UserMeta: {
      id?: string;
      info?: {
        name?: string;
        picture?: string;
      };
    };
    RoomEvent: {};
    ThreadMetadata: {};
    RoomInfo: {};
  }
}

// Pass client directly without manual type generics
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    // useObject,
    // useMap,
    // useList,
    // useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext(client);