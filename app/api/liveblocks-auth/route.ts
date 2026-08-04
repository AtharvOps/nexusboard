// import { auth, currentUser } from "@clerk/nextjs/server";
// import { Liveblocks } from "@liveblocks/node";
// import { ConvexHttpClient } from "convex/browser";

// import { api } from "@/convex/_generated/api";

// const convex = new ConvexHttpClient(
//   process.env.NEXT_PUBLIC_CONVEX_URL!
// );

// const liveblocks = new Liveblocks({
//   secret: process.env.LIVEBLOCKS_SECRET_KEY!,
// });

// export async function POST(request: Request) {
//   const authorization = await auth();
//   const user = await currentUser();

//   if (!authorization || !user) {
//     return new Response("Unauthorized", { status: 403 });
//   }

//   const { room } = await request.json();
//   const board = await convex.query(api.board.get, { id: room });

//   if (board?.orgId !== authorization.orgId) {
//     return new Response("Unauthorized", { status: 403 });
//   }

//   const userInfo = {
//     name: user.firstName || "Teammeate",
//     picture: user.imageUrl,
//   };

//   console.log({ userInfo });

//   const session = liveblocks.prepareSession(
//     user.id,
//     { userInfo }
//   );

//   if (room) {
//     session.allow(room, session.FULL_ACCESS);
//   }

//   const { status, body } = await session.authorize();
//   return new Response(body, { status });
// };

import { auth, currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
  const authorization = await auth();
  const user = await currentUser();

  // 1. Ensure user is logged in
  if (!authorization || !user) {
    return new Response("Unauthorized: No session found", { status: 403 });
  }

  const { room } = await request.json();

  if (!room) {
    return new Response("Bad Request: Room ID is required", { status: 400 });
  }

  // 2. Fetch board metadata from Convex
  const board = await convex.query(api.board.get, { id: room });

  if (!board) {
    return new Response("Unauthorized: Board not found", { status: 403 });
  }

  // 3. Verify access: Check if board's org matches active Clerk org OR author ID matches user
  const isOrgMatch = board.orgId && board.orgId === authorization.orgId;
  const isAuthorMatch = board.authorId && board.authorId === user.id;

  if (!isOrgMatch && !isAuthorMatch) {
    return new Response("Unauthorized: Organization mismatch", { status: 403 });
  }

  // 4. Prepare user information for Liveblocks cursors and presence
  const userInfo = {
    name: user.firstName || user.username || "Teammate",
    picture: user.imageUrl,
  };

  const session = liveblocks.prepareSession(
    user.id,
    { userInfo }
  );

  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}