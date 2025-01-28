import React from "react";
import Post from "./Post";
import ProfilePost from "../Profile/ProfilePost";
import ProfileLikesPost from "../Profile/ProfileLikesPost";
import { useSelector } from "react-redux";

const PostContainer = ({ activeTab }) => {
  const { posts, allPosts } = useSelector((state) => state.posts);
  const { tweets, likedPosts } = useSelector((state) => state.profile);

  let content;

  switch (activeTab) {
    case "Posts":
      content = tweets.map((p) => {
        return <ProfilePost key={p._id} post={p} />;
      });
      break;
    case "LikedPosts":
      content = likedPosts.map((p) => {
        return <ProfileLikesPost key={p._id} post={p} />;
      });
      break;
    case "For You":
      content = posts.map((p) => {
        return <Post key={p._id} post={p} />;
      });
      break;
    case "Following":
      content = allPosts.map((p) => {
        return <Post key={p._id} post={p} />;
      });
      break;
    default:
      content = null;
  }

  return <>{content}</>;
};

export default PostContainer;
