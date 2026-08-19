import React from 'react';

type Column<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export function Table<T>({ columns, data }: TableProps<T>) {
  return (
    <div className="overflow-auto bg-surface-container-lowest rounded-xl border border-outline-variant">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left p-3 text-label-md text-on-surface-variant">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-3 align-top">{c.render ? c.render(row) : (row as any)[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
