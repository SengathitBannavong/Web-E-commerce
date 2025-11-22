
function TableView({ data, columns, onEdit }) {
  const shouldHideColumn = (columnKey) => {
    const hiddenOnMobile = ['Description', 'Photo_Id', 'create_at'];
    return hiddenOnMobile.includes(columnKey);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[#FEE2AD]">
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key} 
                className={`px-4 py-3 text-left text-sm font-semibold text-black ${
                  shouldHideColumn(column.key) ? 'hidden md:table-cell' : ''
                }`}
              >
                {column.label}
              </th>
            ))}
            {onEdit && (
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={item.Product_Id || index}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td 
                  key={column.key} 
                  className={`px-4 py-3 text-sm text-gray-700 ${
                    shouldHideColumn(column.key) ? 'hidden md:table-cell' : ''
                  }`}
                >
                  {column.key === 'create_at' ? item[column.key] ? item[column.key].split('T')[0] : '' : item[column.key]}
                </td>
              ))}
              {onEdit && (
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-white w-auto px-2 content-fit text-center rounded bg-black hover:bg-gray-800 transition-colors flex items-center gap-1"
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
