import React,{useEffect} from 'react'

import { Modal,Button,Form, Input, Select, Checkbox,InputNumber } from 'antd'
import { getProductOfStoreAsync, updateProductAsync } from '../redux/selectionSlice';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';

const EditProduct = ({visible,onCancel,productDetails}) => {
    const [form]=Form.useForm();
    const dispatch=useDispatch();
    const{loading}=useSelector(state=>state.selection);



    useEffect(()=>{
        console.log("--use effect dertails",productDetails);
        if(visible && productDetails){
            form.setFieldsValue({
                productName : productDetails.productName,
                brand : productDetails.brand,
                category  : productDetails.category,
                price : productDetails.price,
                stockQuantity : productDetails.stockQuantity,
                unit: productDetails.unit,
                description: productDetails.description,
                isDailyEssential: productDetails.isDailyEssential || false,
                isAvailable: productDetails.isAvailable || false,
                discount: productDetails.discount || 0
            })
        }
    },[visible, productDetails, form])

    // useEffect(() => {
    //     if (!visible) {
    //     form.resetFields();
    //     }
    // }, [visible, form]);



    const updateProductAndSave = async(values)=>{
        try{
            console.log("updated products")
            console.log(values)
            console.log("updated products")
            console.log("the p id is ",productDetails._id)
            await dispatch(updateProductAsync( {productId: productDetails._id, 
                                             ...values})).unwrap();
            message.success('Product updated!');
            onCancel();
            form.resetFields();
            await dispatch(getProductOfStoreAsync())
        }
        catch(error){
            message.error("Update failed");
            console.log(error)
        }
    }
  return (
    <Modal
        title="Edit Product"
        open={visible}
        closable = {true}
        footer={null}
        onCancel={onCancel}
        destroyOnHidden
    >
        <Form
            form={form}
            name="editproduct"
            layout='horizontal'
            onFinish={updateProductAndSave}
            onCancel={onCancel}
            colon={false} 
            labelCol={{ span: 8 }} 
            wrapperCol={{ span: 16 }} 
            labelAlign="left"
        >
            <Form.Item label="Product Name" name="productName" rules={[{required:true,message:"Product Name is required"}]}>
                <Input placeholder='e.g Milk,Curd,Egg'></Input>
            </Form.Item>
            <Form.Item label="Brand" name="brand" rules={[{required:true,message:"Brand is required"}]}>
                <Input placeholder='e.g Amul,Nandini'></Input>
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{required:true,message:"Category is required"}]}>
                <Select placeholder="Select Category" value={""}>
                    <Select.Option value="Milk & Diary">Milk & Diary</Select.Option>
                    <Select.Option value="Vegetable & Fruits">Vegetable &Fruits</Select.Option>
                    <Select.Option value="Grains & Masalas">Grains & Masalas</Select.Option>
                    <Select.Option value="Snacks">Snacks</Select.Option>
                    <Select.Option value="Household">Households</Select.Option>
                    <Select.Option></Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Price" name="price" rules={[{required:true,message:"Price is required"}]}>
                <InputNumber placeholder='e.g 20' style={{ width: '100%' }}></InputNumber>
            </Form.Item>
            <Form.Item label="Stock Quantity" name="stockQuantity" rules={[{required:true,message:"Stock Quantity is required"}]}>
                <InputNumber placeholder='200' style={{ width: '100%' }}></InputNumber>
            </Form.Item>
            <Form.Item label="Discount" name="discount" rules={[{type:"number",min:0,max:100,message:"Discount must be 0 - 100"}]}>
                <InputNumber  min={0} 
                    max={100} 
                    placeholder="10" 
                    precision={0}
                    style={{ width: '100%' }}></InputNumber>
            </Form.Item>
            <Form.Item label="Unit" name="unit" rules={[{ required: true }]}>
            <Select placeholder="Select Unit">
                <Select.Option value="ml">ml</Select.Option>
                <Select.Option value="litre">litre</Select.Option>
                <Select.Option value="Kg">Kg</Select.Option>
                <Select.Option value="g">g</Select.Option>
                <Select.Option value="piece">Piece</Select.Option>
            </Select>
            </Form.Item>
            <Form.Item label="Description" name="description" rules={[{}]}>
                <Input.TextArea placeholder="Describe the product in a line"></Input.TextArea>
            </Form.Item>
            <div className="flex gap-4">
                <Form.Item name="isDailyEssential" valuePropName="checked">
                    <Checkbox>Daily Essential</Checkbox>
                </Form.Item>
                <Form.Item name="isAvailable" valuePropName="checked">
                    <Checkbox>Available</Checkbox>
                </Form.Item>
            </div>
            <div className='flex justify-center items-center space-x-70'>
                <div>
                    <Button type="primary" onClick={onCancel}>Cancel</Button>
                </div>
                <div>
                    <Button loading={loading} type='primary' htmlType='submit'>Update Product</Button>
                </div>
            </div>
        </Form>
    
    </Modal>
  )
}

export default EditProduct