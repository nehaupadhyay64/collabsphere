import { memo } from "react";

const cardStyle = {
  flex: 1,
  minWidth: 140,
  padding: 16,
  borderRadius: 12,
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
};

function StatCard({ icon, label, value }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: 26 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      <small>{label}</small>
    </div>
  );
}

function AnalyticsSummary({ totalNotes, totalFiles, memberCount, topContributor }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "12px 0" }}>
      <StatCard icon="📝" label="Total notes" value={totalNotes} />
      <StatCard icon="📁" label="Total files" value={totalFiles} />
      <StatCard icon="👥" label="Team size" value={memberCount} />
      <StatCard icon="🏆" label="Top contributor" value={topContributor?.name || "-"} />
    </div>
  );
}

export default memo(AnalyticsSummary);