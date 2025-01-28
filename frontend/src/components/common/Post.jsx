import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import CharLimitTextarea from "./PostLimit";
import Button from "../../components/common/Button";
import axiosInstance from "../../utils/axiosInstance";

import { useSelector, useDispatch } from "react-redux";
import {
  setPosts,
  setAllPosts,
  deletePostFromPosts,
  deletePostFromAllPosts,
  updateLikePosts,
  updateLikeAllPosts,commentOnPosts
} from "../../redux/Home/postSlice";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);

  const [postUser, setPostUser] = useState(null);

  const [comment, setComment] = useState("");
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [error, setError] = useState(false);

  const [postLiked, setPostLiked] = useState(false);
  const [isLikeDisabled, setIsLikeDisabled] = useState(false);

  const [isPostDisabled, setIsPostDisabled] = useState(false);

  const fetchPostBy = async () => {
    try {
      const res = await axiosInstance.get(`/api/users/user/${post.postBy}`);
      setPostUser(res.data.user);
      user.likedPosts.includes(post._id) ? setPostLiked(true) : null;
    } catch (error) {
      console.log("Error fetching post:", error);
    }
  };

  const deletePost = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.delete(`/api/posts/${post._id}`);
      dispatch(deletePostFromPosts(post._id));
      dispatch(deletePostFromAllPosts(post._id));
    } catch (e) {
      console.log(e);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment can't be empty");
      return;
    }
    setIsPostDisabled(true);
    await commentApi(comment);
    setIsPostDisabled(false);
  };

  const commentApi = async (comment) => {
    try {
      const res = await axiosInstance.post(`/api/posts/comment/${post._id}`, {
        text: comment,
      });
      dispatch(commentOnPosts({userId:user._id,postId:post._id,comment:comment}));
      setComment("");
      setIsCommentClicked(false); //
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const handleLikeUnlike = async (e) => {
    e.preventDefault();
    setIsLikeDisabled(true);
    await likeUnlikePost();
    setIsLikeDisabled(false);
  };

  const likeUnlikePost = async () => {
    try {
      const res = await axiosInstance.post(`/api/posts/like/${post._id}`);
      dispatch(updateLikePosts({ userId: user._id, postId: post._id }));
      dispatch(updateLikeAllPosts({ userId: user._id, postId: post._id }));
      setPostLiked((prev) => !prev);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  useEffect(() => {
    fetchPostBy();
    post.likes.includes(user._id) ? setPostLiked(true) : setPostLiked(false);
  }, []);

  return (
    <div className="border-b-2 relative border-gray-800 p-2 px-2 w-full">
      <img
        className="w-10 h-10 mt-1 rounded-full object-cover absolute left-3 top-3"
        src={postUser?.profileImg || "/assets/defaultprofile.jpg"}
        alt={""}
      />
      <div className="ml-12 px-1">
        <div className="flex gap-x-2 items-center px-2 relative">
          <div className="text-lg font-semibold text-slate-200 mt-1">
            {postUser?.fullname}
          </div>
          <Link
            to={`/profile/${postUser?.username}`}
            className="text-md text-slate-400 mt-1"
          >
            @{postUser?.username}
          </Link>
          {user._id == post?.postBy && (
            <img
              src="/assets/icons/trash.svg"
              className="h-4 w-4 absolute right-3 top-2 cursor-pointer"
              alt=""
              onClick={deletePost}
            />
          )}
        </div>

        <div className="flex flex-col px-2 relative">
          {post?.text && (
            <div className="text-lg text-slate-200">{post?.text}</div>
          )}

          {post?.img && (
            <a href={post?.img} target="_blank">
              <img
                src={post?.img}
                alt="Post Image"
                className="py-4 px-4 rounded-3xl w-[450px] h-[550px] cursor-pointer object-cover"
              />
            </a>
          )}
        </div>

        {isCommentClicked && (
          <CharLimitTextarea
            text={comment}
            setText={setComment}
            placeholder={"comment something"}
            maxChars={150}
            height={"h-[80px] px-2"}
            textSize={"text-md"}
            error={error}
            setError={setError}
          />
        )}

        <div className="flex justify-between items-center px-2 w-full min-h-8 mt-2  py-2">
          <div className="flex gap-x-6">
            <div className="flex gap-x-1 items-center">
              <button onClick={() => setIsCommentClicked((prev) => !prev)}>
                <img
                  className="w-5 h-5"
                  src="/assets/icons/message-square.svg"
                  alt={""}
                />
              </button>
              <span className="text-gray-400 text-sm ">{post.comments.length}</span>
            </div>

            <div className="flex gap-x-1 items-center">
              <button onClick={handleLikeUnlike} disabled={isLikeDisabled}>
                {postLiked ? (
                  <img
                    src="/assets/icons/filledHeart.svg"
                    className="w-5 h-5"
                    alt=""
                  />
                ) : (
                  <img
                    className="w-5 h-5"
                    src="/assets/icons/heart.svg"
                    alt=""
                  />
                )}
              </button>
              <span className="text-gray-400 text-sm">{post.likes.length}</span>
            </div>
          </div>

          {isCommentClicked && (
            <Button
              onClick={handleComment}
              disabled={isPostDisabled}
              text="Comment"
              classes="bg-twitter text-slate-200 hover:bg-hoverBlue"
            ></Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
