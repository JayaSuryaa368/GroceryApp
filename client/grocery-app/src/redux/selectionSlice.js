import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import { updateProductDetailsOfStore, deleteProductByStore, getProductByStore } from "../api/products";

export const updateProductAsync = createAsyncThunk(
    'selection/updateProduct',
    async(productData,{ rejectWithValue })=>{
        try{
            const { productId, ...updatedProductDetails } = productData;
            const response=await updateProductDetailsOfStore(productId,updatedProductDetails);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.message)
        }
    }
)

export const deleteProductByStoreAsync = createAsyncThunk(
    'selection/deleteProduct',
    async(id, {rejectWithValue})=>{
        try{
            const response = await deleteProductByStore(id);
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response.message)
        }
    }
)

export const getProductOfStoreAsync = createAsyncThunk(
    'selection/getAllProduct',
    async(_,{rejectWithValue})=>{
        try{
            const response= await getProductByStore();
            return response.data;
        }
        catch(error){
            const message = error.response?.data?.message || error.message || "Failed to fetch products";
            return rejectWithValue(message);
        }
    }
)

const selectionSlice=createSlice({
    name : "productupdate",
    initialState:{
        selectedIds : [],
        selectedOption : null,
        isSelectionOptionActive : false,
        deleteProductId : null,
        loading: false,
        error: null,
        storeProducts: []
    },
    reducers :{
        setSelectionMode : (state,action)=>{
            if(state.selectedOption == action.payload){
                state.selectedOption=null;
                state.selectedIds=[];
                state.isSelectionOptionActive=false;
            }
            else{
                state.selectedOption=action.payload;
                state.isSelectionOptionActive=true;
                state.selectedIds=[];
            }
            
        },
        addSelectedProductIds : (state,action)=>{
            console.log("id clikced is ",action.payload)
            const productId = action.payload;
            const index = state.selectedIds.indexOf(productId);

            if(index > -1){
                state.selectedIds.splice(index,1)
            }
            else{
                state.selectedIds.push(productId)
            }
        },

        resetSelectionMode : (state)=>{
            state.selectedIds = [];
            state.selectedOption = null;
            state.isSelectionOptionActive =false
        }
    },

    extraReducers: (builder)=>{
        builder
            .addCase(updateProductAsync.pending,(state)=>{
                state.loading = true;
                state.error = null;
            })

            .addCase(updateProductAsync.fulfilled, (state,action)=>{
                state.loading=false;
                console.log("update product",action.payload)
            })

            .addCase(updateProductAsync.rejected, (state,action)=>{
                state.loading=false;
                state.error=action.error.message;
                console.log("update failed",action.error)
            })

            .addCase(deleteProductByStoreAsync.pending, (state)=>{
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteProductByStoreAsync.fulfilled, (state,action)=>{
                state.loading = false;
                state.deleteProductId = null;
                console.log("product deleted",action.payload);
            })

            .addCase(deleteProductByStoreAsync.rejected, (state,action)=>{
                state.loading = false;
                state.error = action.error.message;
                console.log("delete production failed", action.error)
            })

            .addCase(getProductOfStoreAsync.pending, (state) => {
                state.loading = true;
            })
            
            .addCase(getProductOfStoreAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.storeProducts = action.payload.data; 
            })
           
            .addCase(getProductOfStoreAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const {setSelectionMode,addSelectedProductIds, resetSelectionMode} = selectionSlice.actions;

export default selectionSlice.reducer;

