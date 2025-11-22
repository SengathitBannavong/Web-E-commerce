function TableView({ data, columns }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#FEE2AD]">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 text-left text-sm font-semibold text-black">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item.Product_Id || index}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                  {column.key === 'create_at' ? item[column.key] ? item[column.key].split('T')[0] : '' : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
