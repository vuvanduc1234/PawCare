import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import postService from '../../services/postService';
import PostCard from '../../components/Community/PostCard';
import CreatePostForm from '../../components/Community/CreatePostForm';

/**
 * FeedPage: Trang feed bài đăng cộng đồng
 * URL: /community
 * Features: Infinite scroll, create post, like, comment
 */
const FeedPage = () => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const observerTarget = useRef(null);

  // Infinite query for posts
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) =>
      postService.getFeed({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
  });

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten pages data
  const posts = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  return (
    <div className="feed-page min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white shadow z-10">
        <div className="container mx-auto p-4 max-w-2xl">
          <h1 className="text-2xl font-bold">🐾 Cộng đồng</h1>
          <p className="text-gray-600 text-sm">
            Chia sẻ những khoảnh khắc đẹp với cộng đồng
          </p>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-2xl">
        {/* Create Post Form */}
        {!isCreatingPost && (
          <button
            onClick={() => setIsCreatingPost(true)}
            className="w-full bg-white p-4 rounded shadow mb-6 text-left text-gray-600 hover:bg-gray-50"
          >
            ✍️ Viết bài đăng...
          </button>
        )}

        {isCreatingPost && (
          <div className="mb-6">
            <CreatePostForm
              onSuccess={() => {
                setIsCreatingPost(false);
                refetch();
              }}
              onCancel={() => setIsCreatingPost(false)}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Lỗi tải bài đăng: {error.message}
          </div>
        )}

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onPostUpdated={() => refetch()}
              />
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="py-8 text-center">
              {isFetchingNextPage ? (
                <div className="animate-spin text-2xl">⏳</div>
              ) : hasNextPage ? (
                <p className="text-gray-500">Đang tải thêm...</p>
              ) : (
                <p className="text-gray-500">Không còn bài đăng nào</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded shadow p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              😔 Chưa có bài đăng nào
            </p>
            <p className="text-gray-500">
              Hãy là người đầu tiên chia sẻ bài đăng!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
