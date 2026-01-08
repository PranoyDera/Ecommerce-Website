"use client";

import BottomContent from "./BottomContent";
import TopContent from "./TopContent";

export default function Dashboard(){
    return(
        <div className="flex flex-col gap-6">
          <TopContent/>
          <BottomContent/>
        </div>
    ) 
}