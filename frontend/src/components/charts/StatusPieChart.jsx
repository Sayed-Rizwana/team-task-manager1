import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const colors = ["#38bdf8", "#f59e0b", "#10b981"];

export const StatusPieChart = ({ data }) => (
  <div className="panel h-80 p-5">
    <h3 className="text-lg font-semibold text-white">Task Status Breakdown</h3>
    <div className="mt-6 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);
