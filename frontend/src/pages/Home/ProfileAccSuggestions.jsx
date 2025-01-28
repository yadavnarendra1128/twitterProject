import { useEffect } from "react";
import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

import {fetchProfileAccountSuggestions} from "../../redux/Home/accountSlice";

import ProfileAccountItem from "../../components/Profile/ProfileAccountItem";
import LoaderSvg from "../../utils/svg/LoaderSvg";

const ProfileAccSuggestions = () => {
  const { data:user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { username } = useParams();
  const location = useLocation();
  const isUserProfile = location.pathname.includes(`${user.username}`)

  const { accounts, loading } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchProfileAccountSuggestions(username));
  }, [dispatch,username]);

  return !loading ? (
    <div className="hidden ml-2 sm:hidden lg:block lg:min-w-[21%] lg:h-[50%] lg:mt-2 rounded-lg bg-slate-800 p-4 flex-col">
      <div className="text-xl pl-1 pb-2 font-normal text-white">
        Suggested accounts
      </div>
      <div className="p-1 flex flex-col gap-y-2 py-2">
        {accounts &&
          accounts.slice(0, 5).map((acc, i) => {
            return !user.following.includes(acc._id) && <ProfileAccountItem key={i} acc={acc} isUserProfile={isUserProfile} />;
          })}
      </div>
    </div>
  ) : (
    <div className="lg:min-w-[21%] lg:h-[50%] lg:mt-2 p-4 bg-slate-800 rounded-xl ml-4">
      <div className="text-xl pl-1 pb-2 font-normal text-white">
        Suggested accounts
      </div>
      <div className="flex justify-center items-center w-full h-[85%]">
        <LoaderSvg height="30" width="30" />
      </div>
    </div>
  );
};

export default ProfileAccSuggestions;
