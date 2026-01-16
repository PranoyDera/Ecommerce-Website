"use client";

import { useEffect, useState } from "react";
import BottomContent from "./BottomContent";
import TopContent from "./TopContent";
import { apiGet } from "@/app/utils/api";
import { useUsers } from "@/hooks/useUsers";
import { ADMIN } from "@/app/constants/apiUrl";

export default function Dashboard(){
  const [totalOrders,setTotalOrders] = useState();
  const [totalRevenue,settotalRevenue] = useState();
  const [totalProductsPurchased,setTotalProductpurchased] = useState();
  const [topProductsList,setTopProductsList] = useState();
  const { users, loading: pageLoading, fetchUsers } = useUsers();

  const fetchOrders = async()=>{
    const token = localStorage.getItem("token");
    const res = await apiGet(`${ADMIN.GET_ALL_ORDERS}`,token?token:"");
    const orderLen = res?.totalOrders
    const revenue = res?.totalRevenue.toFixed(2)
    const totalProducts = res?.totalProductsPurchased
    setTotalOrders(orderLen);
    settotalRevenue(revenue);
    setTotalProductpurchased(totalProducts);
  }

  const topProducts = async()=>{
    const token = localStorage.getItem("token");
    const res = await apiGet(`${ADMIN.TOP_PRODUCTS}`,token?token:"");
    setTopProductsList(res?.data);
  }

  useEffect(()=>{
    fetchOrders();
    fetchUsers();
    topProducts();
  },[])

  const totalUser = users.length;
  
    return(
        <div className="flex flex-col">
          <TopContent totalOrders={totalOrders?totalOrders:0} totalRevenue={totalRevenue?totalRevenue:0} totalUser={totalUser} totalProductsPurchased={totalProductsPurchased?totalProductsPurchased:0}/>
          <BottomContent topProductsList={topProductsList}/>
        </div>
    ) 
}