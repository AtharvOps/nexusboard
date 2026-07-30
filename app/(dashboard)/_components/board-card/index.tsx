"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";
import { Actions } from "@/components/actions";

import { Footer } from "./footer";
import { Overlay } from "./overlay";

interface BoardCardProps {
  id: string;
  title: string;
  authorName: string;
  authorId: string;
  createdAt: number;
  imageUrl: string;
  orgId: string;
  isFavorite: boolean;
}

export const BoardCard = ({
  id,
  title,
  authorName,
  authorId,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
    const { userId } = useAuth();

    const authorLabel = authorId === userId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true });

    return (
      <Link href={`/board/${id}`}>
        <div className="group aspect-100/127 border rounded-lg flex flex-col justify-center overflow-hidden">
            <div className="relative flex-1 bg-amber-50">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-fit"
                />
                <Overlay />

                <Actions
                  id={id}
                  title={title}
                  side="bottom"
                >
                  <button
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none"
                  >
                    <MoreHorizontal
                      className="text-white opacity-75 hover:opacity-100 transition-opacity"
                    />
                   </button>
                </Actions>
                
            </div>
            <Footer
                isFavorite={isFavorite}
                title={title}
                authorLabel={authorLabel}
                createdAtLabel={createdAtLabel}
                onClick={() => {}}
                disabled={false}
            />
        </div>
    </Link>
  );
};

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className="aspect-100/127 rounded-lg overflow-hidden animate-shimmer bg-linear-to-r from-gray-300 via-gray-200 to-gray-300 bg-length:200%_100%">
            <Skeleton className="w-full h-full" />
        </div>
    );
};