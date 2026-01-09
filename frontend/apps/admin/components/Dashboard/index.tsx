"use client";

import { useEffect, useState } from "react";
import BottomContent from "./BottomContent";
import TopContent from "./TopContent";
import { apiGet } from "@/app/utils/api";
import { useUsers } from "@/hooks/useUsers";

export default function Dashboard(){
  const [totalOrders,setTotalOrders] = useState();
  const [totalRevenue,settotalRevenue] = useState();
  const [totalProductsPurchased,setTotalProductpurchased] = useState();
  const { users, loading: pageLoading, fetchUsers } = useUsers();
  const fetchOrders = async()=>{
    const token = localStorage.getItem("token");
    const res = await apiGet("/api/admin/orders",token?token:"");
    console.log("Orders:",res);
    const orderLen = res?.totalOrders
    const revenue = res?.totalRevenue.toFixed(2)
    const totalProducts = res?.totalProductsPurchased
    setTotalOrders(orderLen);
    settotalRevenue(revenue);
    setTotalProductpurchased(totalProducts);
  }
  useEffect(()=>{
    fetchOrders();
    fetchUsers();
  },[])
  const totalUser = users.length
  console.log("totalOrders:",totalOrders);
  console.log("total Revenue:",totalRevenue);
    return(
        <div className="flex flex-col">
          <TopContent totalOrders={totalOrders?totalOrders:0} totalRevenue={totalRevenue?totalRevenue:0} totalUser={totalUser} totalProductsPurchased={totalProductsPurchased}/>
          <BottomContent/>
        </div>
    ) 
}