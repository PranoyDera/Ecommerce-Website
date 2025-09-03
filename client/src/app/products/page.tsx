

import ProductList from "../../components/ProductList";

const ProductPage = async({
    searchParams,
}:{
    searchParams: Promise<{category:string}>;
}) =>{
    const category = (await searchParams).category;
    return(
        <div className="w-[95%] mx-auto">
         <ProductList category={category} params={"products"}/>
        </div>
    )
}

export default ProductPage;