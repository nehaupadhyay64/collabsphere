import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../features/projects/projectsSlice";
import useAuth from "../hooks/useAuth";
import MemberList from "../components/MemberList";

export default function MembersTab() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { current, error } = useSelector((state) => state.projects);
  const [email, setEmail] = useState("");

  const isOwner = current.owner._id === user._id;

  const handleAdd = async (e) => {
    e.preventDefault();
    const result = await dispatch(addMember({ id: current._id, email }));
    if (addMember.fulfilled.match(result)) setEmail("");
  };

  return (
    <div>
      <h3>Team</h3>
      <MemberList owner={current.owner} members={current.members} />

      {isOwner ? (
        <form onSubmit={handleAdd}>
          <input
            type="email"
            placeholder="Member's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />{" "}
          <button>Add Member</button>
        </form>
      ) : (
        <p>Only the owner can add members.</p>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}