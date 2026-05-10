export const FormField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
    {children}
  </label>
);
