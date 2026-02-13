import React  from 'react'
import { Modal,Button,Form, Input, Select, Checkbox,InputNumber } from 'antd'

const AddProduct = ({visible,onCancel,addProductToStore}) => {
    
  return (
    <Modal
        title="Add New Product"
        open={visible}
        closable = {true}
        footer={null}
        // onOk={addProductToStore}
        onCancel={onCancel}
        destroyOnHidden
    >
        <Form
            name="addproduct"
            layout='vertical'
            onFinish={(values)=>addProductToStore(values)}
            onCancel={onCancel}
            initialValues={{ isDailyEssential: true, isAvailable: true }}
            
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
                <InputNumber placeholder='e.g 20'></InputNumber>
            </Form.Item>
            <Form.Item label="Stock Quantity" name="stockQuantity" rules={[{required:true,message:"Stock Quantity is required"}]}>
                <InputNumber placeholder=' 200'></InputNumber>
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
            <div className='flex justify-center items-center space-x-80'>
                <div>
                    <Button type="primary" onClick={onCancel}>Cancel</Button>
                </div>
                <div>
                    <Button type='primary' htmlType='submit' onClick={addProductToStore}>AddToStore</Button>
                </div>
            </div>
        </Form>
    
    </Modal>
    
  )
}

export default AddProduct