import { memo } from "react";

function MemberList({ owner, members }) {
  const people = [
    { ...owner, role: "Owner" },
    ...members.map((m) => ({ ...m, role: "Member" })),
  ];

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "12px 0" }}>
      {people.map((p) => (
        <li
          key={p._id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            marginBottom: 8,
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
            }}
          >
            {p.name?.[0]?.toUpperCase()}
          </span>
          <span style={{ flex: 1 }}>
            <b>{p.name}</b>
            <br />
            <small>{p.email}</small>
          </span>
          <small>{p.role === "Owner" ? "👑 Owner" : "Member"}</small>
        </li>
      ))}
    </ul>
  );
}

export default memo(MemberList);