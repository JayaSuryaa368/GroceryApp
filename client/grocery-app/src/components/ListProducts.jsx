import { Row, Col, Card, Badge, Button, Typography, Checkbox, message, Popconfirm  } from 'antd';
import { addSelectedProductIds, deleteProductByStoreAsync, getProductOfStoreAsync } from '../redux/selectionSlice';
import { useSelector, useDispatch } from 'react-redux';
const { Title, Text } = Typography;
import { useState } from 'react';
import EditProduct from './EditProduct';
import { CloseCircleFilled } from '@ant-design/icons';

const ListProducts = ({ storeProducts}) => {
 const [editOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const dispatch = useDispatch();
  const {selectedOption,selectedIds}=useSelector((state)=>state.selection);
  
  const handleEdit = (productDetails)=>{
    setEditOpen(true);
    setEditingProduct(productDetails);
    console.log(productDetails)
  }

  const handleCancelEdit = ()=>{
    setEditOpen(false);
    setEditingProduct([]);
  }

  const deleteTheProduct = async(id)=>{
    try{
      console.log("in delte product api",id)
      await dispatch(deleteProductByStoreAsync(id));
      message.success('Product deleted!');
      await dispatch(getProductOfStoreAsync())
    }
    catch(error){
      message.error("deletion failed");
      console.log(error)
    }
  }
  const checkedProducts = (isChecked,id)=>{
    dispatch(addSelectedProductIds(id))
  }

  if (storeProducts.length === 0) {
    return (
      <div className='text-center py-12 bg-gray-50'>
        <Title level={3}>Add Your First Product</Title>
      </div>
    );
  }

  return (
  <div>
    <div>
      <h3>Your Products {storeProducts.length}</h3>
      <div className='bg-blue-200 m-2 p-4 rounded-md'>
      {/* 1. Parent: Use Grid instead of Flex for perfect alignment */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1'>
        {storeProducts.map((productsDetails) => {
          return (
            <div 
              key={productsDetails._id} 
              // 2. Child: Removed w-70, used flex-col and h-full to make them equal height
              className='flex flex-col h-full border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden'
            >
              {/* Fixed Image Height */}
              {(selectedOption === "remove" || selectedOption === "updateoutofstock" || selectedOption === "applydiscount") && <div className='absolute m-1'>
                <Checkbox className="transform scale-120"
                  checked={selectedIds.includes(productsDetails._id)}
                  onChange={(e)=>checkedProducts(e.target.checked,productsDetails._id)}></Checkbox>
                </div>
              }
              <div className="w-full h-30 shrink-0">
                <div className='flex justify-evenly h-7 items-center bg-amber-200'>
                <div className='relative text-sm font-medium hover:bg-white transition-all'>
                      <Button onClick={()=>handleEdit(productsDetails)}>Edit</Button>
                </div>
                <div className='relative text-sm font-medium hover:bg-red-500 transition-all'>
                    <Popconfirm title="Delete the product"
                        description={`Are you sure you want to delete ${productsDetails?.brand} ${productsDetails?.productName}?`}
                        onConfirm={()=>{deleteTheProduct(productsDetails._id)}}
                        okText="Yes"
                        cancelText="No"
                        placement='bottom'
                        icon={<CloseCircleFilled style={{ color: 'red' }} />}
                        
                      >
                      <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
                </div>
                <img 
                  src={productsDetails.imageUrl} 
                  alt={productsDetails.productName}
                  className='w-full h-full object-cover'
                />
                  
              </div>
              
              {/* Content Area: flex-1 makes this section expand to fill the card */}
              <div className="p-7 flex flex-col flex-1">
                <div className="font-bold text-lg mb-1">
                  {
                    productsDetails.discount > 0 ? (
                      <>
                      <div className="font-bold text-lg text-green-600">
                        Rs.{Math.floor(productsDetails.price - (productsDetails.price * productsDetails.discount / 100))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="line-through">Rs.{productsDetails.price}</span>
                        <span className="ml-2 text-red-500">({productsDetails.discount}% Off)</span>
                      </div>
                    </>
                    ):
                    (
                      <>
                        <div className="font-bold text-lg">Rs.{productsDetails.price}</div>
                        <div className=''>No Discount</div>
                      </>
                    )
                  }
                </div>
                <div className='bg-blue-300 rounded-2xl w-full'>
                  {
                    productsDetails.stockQuantity  > 10 ? (
                      <div>Stock Quanity {productsDetails.stockQuantity}</div>
                    ):(
                      <div className='bg-gray-200 text-red-800 font-bold'>Stock Quanity {productsDetails.stockQuantity}
                        <div className='text-black font-medium'>Update your stock Quantity Soon</div>
                      </div>
                    )
                  }
                </div>
                {/* 3. Description: line-clamp ensures text doesn't break the layout */}
                <div className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                  {productsDetails.description}
                </div>
                <div>{productsDetails.isAvailable}</div>
                <div className="mt-auto">
                  
                  {productsDetails.isAvailable === true ? (
                    <div className='bg-green-100 text-green-700 px-2 py-1 rounded text-center text-xs font-semibold'>
                      Available
                    </div>
                  ) : (
                    <div className='bg-red-100 text-red-700 px-2 py-1 rounded text-center text-xs font-semibold'>
                      Out Of Stock
                    </div>
                  )}
                </div>
              
              </div>
            </div>
            
          )
        })}
      </div>  
      </div> 
      </div>
       <EditProduct visible={editOpen}  onCancel={handleCancelEdit} productDetails={editingProduct}/>
      </div> 
  )
}

export default ListProducts;
