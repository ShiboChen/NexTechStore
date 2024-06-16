import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../redux/slices/usersApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const profileImgRef = useRef(null);

  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImg, setProfileImg] = useState(userInfo?.profileImg || "");

  const [updateProfile] = useProfileMutation();

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const response = await updateProfile({
          _id: userInfo._id,
          profileImg,
          name,
          email,
          newPassword,
        }).unwrap();

        dispatch(setCredentials({ ...response }));
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <form onSubmit={submitHandler}>
        <h1 className="text-3xl text-center font-semibold my-6">
          User Profile
        </h1>
        <div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={profileImgRef}
            onChange={(e) => handleImgChange(e, "profileImg")}
          />
          {/* USER AVATAR */}
          <div className="avatar flex items-center justify-center">
            <div className="w-28 rounded-full relative group/avatar">
              <img src={profileImg || "/avatar.png"} />
              <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                {
                  <MdEdit
                    className="w-4 h-4 text-white"
                    onClick={() => profileImgRef.current.click()}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            className="input input-bordered"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input input-bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-control mt-6">
          <button className="btn btn-primary text-base hover:opacity-80">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
