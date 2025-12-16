import ProductAction from '../Product/ProductAction';

function ProductHeader({ openAddModal }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Products</h1>
        <p className="text-slate-600">Manage your product inventory</p>
      </div>
      <ProductAction 
        openAddModal={openAddModal} 
      />
    </div>
  );
}

export default ProductHeader;
