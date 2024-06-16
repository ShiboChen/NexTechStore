import React from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../redux/slices/usersApiSlice";
import Spinner from "../../components/Spinner";
import Alert from "../../components/Alert";

const UserListPage = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you wanna delete it?")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold m-4">Users</h1>
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert type="4">{error?.data?.message || error.error}</Alert>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="font-bold text-black text-center">
                <th>PROFILE IMAGE</th>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="flex items-center gap-4">
                    <div className="avatar mx-auto">
                      <div className="mask mask-circle w-16 h-16">
                        <img
                          src={user.profileImg || "/avatar.png"}
                          alt={user.name}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck className="inline-block text-center text-green-400" />
                    ) : (
                      <FaTimes className="inline-block text-center text-red-400" />
                    )}
                  </td>
                  <td>
                    {!user.isAdmin && (
                      <>
                        <Link to={`/admin/users/${user._id}/edit`}>
                          <button className="btn btn-ghost btn-sm">
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => deleteHandler(user._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
