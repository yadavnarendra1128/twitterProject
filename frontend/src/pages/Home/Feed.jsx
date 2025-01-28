import { useState, useEffect, act } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostSuggestions,
  fetchAllPosts,
} from "../../redux/Home/postSlice";
import PostContainer from "../../components/common/PostContainer";
import Navbar from "../../components/common/Navbar";
import CreatePost from "../../components/common/CreatePost";

const Feed = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("For You");

  useEffect(() => {
    dispatch(fetchPostSuggestions());
    dispatch(fetchAllPosts());
  }, [dispatch]);

  return (
    <div className="w-full lg:w-[55%] h-full border-r-2 border-gray-800 overflow-auto scroll scrollbar-none">
      <Navbar
        tabs={["For You", "Following"]}
        selectedTab={activeTab}
        setSelectedTab={setActiveTab}
      />
      {activeTab === "For You" ? <CreatePost /> : null}
      <PostContainer activeTab={activeTab}/>
    </div>
  );
};

export default Feed;
