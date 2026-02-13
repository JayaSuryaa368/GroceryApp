import { useNavigate } from "react-router-dom";
const { Header } = Layout;
import { Layout, Menu, Button } from 'antd';
import React from 'react'

const NavBar = ({menus,defaultKey,onMenuClick}) => {
    const navigate=useNavigate();

    const menuItems=menus.map((name)=>{
        return {
            key:name.toLowerCase(),
            label : name
        }
    })

    const logout = ()=>{
        localStorage.clear();
        navigate("/login");
    }
  return (
    <Header style={{ display: 'flex', alignItems: 'center' ,height:"30px", backgroundColor:"blue",borderRadius:"1px"}}>
        <div className=" text-black font-bold  bg-auto">
            GROCERY APP
        </div>
        <Menu 
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={defaultKey}
            items={menuItems}
            style={{ flex: 1, minWidth: 0 , height:"30px",}}
            onClick={(e)=>onMenuClick(e.key)}
        />
        <Button htmlType="submit" type="primary" onClick={logout} className="hover:cursor-pointer">
            Logout
        </Button>
    </Header>
  )
}

export default NavBar