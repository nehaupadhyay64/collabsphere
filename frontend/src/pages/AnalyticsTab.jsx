import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Spinner from "../components/Spinner";
import AnalyticsSummary from "../components/AnalyticsSummary";

export default function AnalyticsTab() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/api/projects/${id}/analytics`);

  // useMemo: data badle tabhi dobara calculate hoga
  const topContributor = useMemo(() => {
    if (!data || data.perMember.length === 0) return null;
    return [...data.perMember].sort(
      (a, b) => b.notes + b.files - (a.notes + a.files)
    )[0];
  }, [data]);

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Contribution Summary</h3>

      <AnalyticsSummary
        totalNotes={data.totalNotes}
        totalFiles={data.totalFiles}
        memberCount={data.perMember.length}
        topContributor={topContributor}
      />

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", marginTop: 10 }}>
        <thead>
          <tr>
            <th>Member</th>
            <th>Notes</th>
            <th>Files</th>
          </tr>
        </thead>
        <tbody>
          {data.perMember.map((m) => (
            <tr key={m.name}>
              <td>{m.name}</td>
              <td>{m.notes}</td>
              <td>{m.files}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
