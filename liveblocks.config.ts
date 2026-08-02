import { 
  createClient,
  LiveList,
  LiveMap,
  LiveObject,
} from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

import { Layer, Color } from "@/types/canvas";

export const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
});

// Define Liveblocks types for your application
declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      selection: string[];
      pencilDraft: [x: number, y: number, pressure: number][] | null;
      penColor: Color | null;
    };
    Storage: {
      layers: LiveMap<string, LiveObject<Layer>>;
      layerIds: LiveList<string>;
    };
    UserMeta: {
      id?: string;
      info?: {
        name?: string;
        picture?: string;
      };
    };
    RoomEvent: Record<string, never>;
    ThreadMetadata: Record<string, never>;
    RoomInfo: Record<string, never>;
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
    //useObject,
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